import mongoose, { Schema, type InferSchemaType, models, model } from "mongoose";

const addressSchema = new Schema(
  {
    label: { type: String },
    fullName: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    name: { type: String, required: true },
    image: { type: String },
    emailVerified: { type: Date },
    isAdmin: { type: Boolean, default: false },
    marketingOptIn: { type: Boolean, default: false },
    stripeCustomerId: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    defaultAddress: addressSchema,
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const UserModel = models.User ?? model("User", userSchema);
