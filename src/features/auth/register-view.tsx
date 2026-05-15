"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBarkleyStore } from "@/store/use-store";
import {
  profileSchema,
  type ProfileFormValues,
  calcAgeFromBirthday,
  emptyProfileDefaults,
} from "@/features/auth/profile-schema";

// Re-export schema + type so profile-view.tsx can import from one place
export { profileSchema, type ProfileFormValues } from "@/features/auth/profile-schema";

// ---------------------------------------------------------------------------
// Shared field classes — mirrors the existing Input component styling
// ---------------------------------------------------------------------------
const fieldCls =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

// ---------------------------------------------------------------------------
// Register View
// ---------------------------------------------------------------------------
export function RegisterView() {
  const router = useRouter();
  const setLoggedIn = useBarkleyStore((s) => s.setLoggedIn);
  const profileData = useBarkleyStore((s) => s.profileData);
  const setProfileData = useBarkleyStore((s) => s.setProfileData);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: emptyProfileDefaults,
  });

  const { watch, setValue } = form;
  const birthday = watch("pet_birthday");

  // Pre-fill with previously saved data (e.g. user revisiting /register)
  const hasPrefilled = useRef(false);
  useEffect(() => {
    if (profileData && !hasPrefilled.current) {
      hasPrefilled.current = true;
      form.reset(profileData);
    }
  }, [profileData, form]);

  // Auto-calculate age when birthday changes
  useEffect(() => {
    if (!birthday) return;
    setValue("pet_age_years", calcAgeFromBirthday(birthday), { shouldValidate: false });
  }, [birthday, setValue]);

  const onSubmit = form.handleSubmit((data) => {
    // TODO: POST to /api/profile/save once MongoDB is connected
    setProfileData(data);
    setLoggedIn(true);
    router.push("/");
  });

  const handleSkip = () => {
    setLoggedIn(true);
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
            <h2 className="font-display text-2xl text-barkley-cocoa">About You</h2>
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
            <h2 className="font-display text-2xl text-barkley-cocoa">About Your Pet</h2>
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
