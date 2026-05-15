import { z } from "zod";

export const profileSchema = z.object({
  // Section 1 — Owner Info (required)
  owner_first_name: z.string().min(1, "First name is required"),
  owner_last_name: z.string().min(1, "Last name is required"),
  owner_phone: z.string().min(1, "Phone is required"),
  owner_email: z.string().email("Enter a valid email"),
  owner_city: z.string().optional(),
  signup_source: z
    .enum(["", "Instagram", "Facebook", "TikTok", "Google Search", "Friend/Referral", "Other"])
    .optional(),

  // Section 2 — Pet Info (all optional)
  pet_name: z.string().optional(),
  pet_breed: z.string().optional(),
  pet_birthday: z.string().optional(),
  pet_age_years: z.coerce.number().min(0).optional().or(z.literal("")),
  pet_weight_lbs: z.coerce.number().min(0).optional().or(z.literal("")),
  pet_sex: z.enum(["", "Male", "Female"]).optional(),
  allergies: z.string().optional(),
  health_conditions: z.string().optional(),
  activity_level: z.enum(["", "Low", "Moderate", "High", "Very High"]).optional(),
  vet_notes: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export function calcAgeFromBirthday(dateStr: string): number {
  const birth = new Date(dateStr);
  if (isNaN(birth.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return Math.max(0, age);
}

export const emptyProfileDefaults: ProfileFormValues = {
  owner_first_name: "",
  owner_last_name: "",
  owner_phone: "",
  owner_email: "",
  owner_city: "",
  signup_source: "",
  pet_name: "",
  pet_breed: "",
  pet_birthday: "",
  pet_age_years: "",
  pet_weight_lbs: "",
  pet_sex: "",
  allergies: "",
  health_conditions: "",
  activity_level: "",
  vet_notes: "",
};
