"use server";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { UserModel } from "@/models/User";

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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/profile/save]", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
