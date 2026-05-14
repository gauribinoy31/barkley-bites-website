import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { UserModel } from "@/models/User";

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  marketingOptIn: z.boolean().optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid registration payload" }, { status: 400 });
  }

  await connectDB();

  const email = parsed.data.email.toLowerCase();
  const existing = await UserModel.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await UserModel.create({
    email,
    name: parsed.data.name,
    passwordHash,
    marketingOptIn: parsed.data.marketingOptIn ?? false,
  });

  return NextResponse.json({ ok: true });
}
