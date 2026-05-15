import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { UserModel } from "@/models/User";
import { GOOGLE_SHEETS_URL } from "@/features/auth/profile-schema";

// Fire-and-forget — never blocks the response
function notifyGoogleSheets(body: Record<string, unknown>) {
  const payload = {
    owner_first_name: body.owner_first_name ?? "",
    owner_last_name: body.owner_last_name ?? "",
    owner_email: body.owner_email ?? "",
    owner_phone: body.owner_phone ?? "",
    owner_city: body.owner_city ?? "",
    pet_name: body.pet_name ?? "",
    pet_breed: body.pet_breed ?? "",
    pet_birthday: body.pet_birthday ?? "",
    pet_age_years: body.pet_age_years ?? "",
    pet_weight_lbs: body.pet_weight_lbs ?? "",
    pet_sex: body.pet_sex ?? "",
    health_conditions: body.health_conditions ?? "",
    signup_source: body.signup_source ?? "",
  };

  // Server-to-server: no CORS restrictions, redirect handling is reliable
  fetch(GOOGLE_SHEETS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    redirect: "follow",
  }).catch((err) => console.error("[api/profile/save] Sheets error:", err));
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (typeof body.owner_email === "string" ? body.owner_email : "")
    .toLowerCase()
    .trim();

  if (!email) {
    return NextResponse.json({ error: "owner_email is required" }, { status: 400 });
  }

  try {
    await connectDB();

    // Upsert: update profile on existing user, or create a new user document.
    // $setOnInsert only runs on insert (new user), providing the required `name` field.
    await UserModel.findOneAndUpdate(
      { email },
      {
        $set: { profile: body },
        $setOnInsert: {
          name:
            `${body.owner_first_name ?? ""} ${body.owner_last_name ?? ""}`.trim() || email,
        },
      },
      { upsert: true, new: true },
    );

    // Fire-and-forget to Google Sheets — does not affect the response
    notifyGoogleSheets(body);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/profile/save]", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
