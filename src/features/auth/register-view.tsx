"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ---------------------------------------------------------------------------
// Shared field classes — mirrors the existing Input component styling
// ---------------------------------------------------------------------------
const fieldCls =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------
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

function calcAgeFromBirthday(dateStr: string): number {
  const birth = new Date(dateStr);
  if (isNaN(birth.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return Math.max(0, age);
}

// ---------------------------------------------------------------------------
// Register View
// ---------------------------------------------------------------------------
export function RegisterView() {
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
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
    },
  });

  const { watch, setValue } = form;
  const birthday = watch("pet_birthday");

  // Auto-calculate age when birthday changes
  useEffect(() => {
    if (!birthday) return;
    setValue("pet_age_years", calcAgeFromBirthday(birthday), { shouldValidate: false });
  }, [birthday, setValue]);

  const onSubmit = form.handleSubmit(() => {
    // TODO: POST to /api/profile/save once MongoDB is connected
    router.push("/");
  });

  const handleSkip = () => {
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-12 md:px-6 lg:px-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-barkley-sage">
            Account setup
          </p>
          <h1 className="font-display text-4xl text-barkley-cocoa">Tell us about yourself</h1>
          <p className="text-sm text-muted-foreground">
            This helps us personalise your experience. All pet fields are optional.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="shrink-0 rounded-full px-6 text-xs font-semibold uppercase tracking-[0.18em]"
          onClick={handleSkip}
        >
          Skip for now
        </Button>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-10">
        {/* ------------------------------------------------------------------ */}
        {/* Section 1 — Owner Info                                              */}
        {/* ------------------------------------------------------------------ */}
        <section className="space-y-6 rounded-3xl bg-white/90 p-6 shadow-soft ring-1 ring-white/70 md:p-8">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-barkley-sage">
              Section 1
            </p>
            <h2 className="font-display text-2xl text-barkley-cocoa">Owner info</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* first name */}
            <div className="space-y-2">
              <Label htmlFor="owner_first_name">First name *</Label>
              <Input id="owner_first_name" {...form.register("owner_first_name")} />
              {form.formState.errors.owner_first_name && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.owner_first_name.message}
                </p>
              )}
            </div>

            {/* last name */}
            <div className="space-y-2">
              <Label htmlFor="owner_last_name">Last name *</Label>
              <Input id="owner_last_name" {...form.register("owner_last_name")} />
              {form.formState.errors.owner_last_name && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.owner_last_name.message}
                </p>
              )}
            </div>

            {/* phone */}
            <div className="space-y-2">
              <Label htmlFor="owner_phone">Phone *</Label>
              <Input id="owner_phone" type="tel" autoComplete="tel" {...form.register("owner_phone")} />
              {form.formState.errors.owner_phone && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.owner_phone.message}
                </p>
              )}
            </div>

            {/* email */}
            <div className="space-y-2">
              <Label htmlFor="owner_email">Email *</Label>
              <Input
                id="owner_email"
                type="email"
                autoComplete="email"
                {...form.register("owner_email")}
              />
              {form.formState.errors.owner_email && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.owner_email.message}
                </p>
              )}
            </div>

            {/* city */}
            <div className="space-y-2">
              <Label htmlFor="owner_city">City</Label>
              <Input id="owner_city" {...form.register("owner_city")} />
            </div>

            {/* signup source */}
            <div className="space-y-2">
              <Label htmlFor="signup_source">How did you hear about us?</Label>
              <select
                id="signup_source"
                className={fieldCls}
                {...form.register("signup_source")}
              >
                <option value="">Select…</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="TikTok">TikTok</option>
                <option value="Google Search">Google Search</option>
                <option value="Friend/Referral">Friend / Referral</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Section 2 — Pet Info (optional)                                     */}
        {/* ------------------------------------------------------------------ */}
        <section className="space-y-6 rounded-3xl bg-white/90 p-6 shadow-soft ring-1 ring-white/70 md:p-8">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-barkley-sage">
              Section 2 — Optional
            </p>
            <h2 className="font-display text-2xl text-barkley-cocoa">Pet info</h2>
            <p className="text-xs text-muted-foreground">
              All fields in this section are optional. Fill in as much or as little as you like.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* pet name */}
            <div className="space-y-2">
              <Label htmlFor="pet_name">Pet name</Label>
              <Input id="pet_name" {...form.register("pet_name")} />
            </div>

            {/* pet breed */}
            <div className="space-y-2">
              <Label htmlFor="pet_breed">Breed</Label>
              <Input id="pet_breed" {...form.register("pet_breed")} />
            </div>

            {/* birthday */}
            <div className="space-y-2">
              <Label htmlFor="pet_birthday">Birthday</Label>
              <Input id="pet_birthday" type="date" {...form.register("pet_birthday")} />
              <p className="text-[0.65rem] text-muted-foreground">
                Filling this in auto-calculates age below.
              </p>
            </div>

            {/* age — auto-filled, manually editable */}
            <div className="space-y-2">
              <Label htmlFor="pet_age_years">Age (years)</Label>
              <Input
                id="pet_age_years"
                type="number"
                min={0}
                {...form.register("pet_age_years")}
              />
            </div>

            {/* weight */}
            <div className="space-y-2">
              <Label htmlFor="pet_weight_lbs">Weight (lbs)</Label>
              <Input
                id="pet_weight_lbs"
                type="number"
                min={0}
                step="0.1"
                {...form.register("pet_weight_lbs")}
              />
            </div>

            {/* sex */}
            <div className="space-y-2">
              <Label htmlFor="pet_sex">Sex</Label>
              <select id="pet_sex" className={fieldCls} {...form.register("pet_sex")}>
                <option value="">Select…</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* activity level */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="activity_level">Activity level</Label>
              <select
                id="activity_level"
                className={fieldCls}
                {...form.register("activity_level")}
              >
                <option value="">Select…</option>
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
                <option value="Very High">Very High</option>
              </select>
            </div>

            {/* allergies */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="allergies">Allergies</Label>
              <textarea
                id="allergies"
                rows={3}
                className={`${fieldCls} resize-none`}
                placeholder="e.g. chicken, grain, dairy…"
                {...form.register("allergies")}
              />
            </div>

            {/* health conditions */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="health_conditions">Health conditions</Label>
              <textarea
                id="health_conditions"
                rows={3}
                className={`${fieldCls} resize-none`}
                placeholder="e.g. hip dysplasia, diabetes…"
                {...form.register("health_conditions")}
              />
            </div>

            {/* vet notes */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="vet_notes">Vet notes</Label>
              <textarea
                id="vet_notes"
                rows={3}
                className={`${fieldCls} resize-none`}
                placeholder="Any notes from your vet…"
                {...form.register("vet_notes")}
              />
            </div>
          </div>
        </section>

        {/* Submit row */}
        <div className="flex flex-wrap items-center gap-4">
          <Button
            type="submit"
            className="rounded-full px-10 text-xs font-semibold uppercase tracking-[0.2em]"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Saving…" : "Complete setup"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="rounded-full text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
            onClick={handleSkip}
          >
            Skip for now
          </Button>
        </div>
      </form>
    </div>
  );
}
