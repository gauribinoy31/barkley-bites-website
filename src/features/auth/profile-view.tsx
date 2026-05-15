"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle } from "lucide-react";
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

const fieldCls =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export function ProfileView() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const isLoggedIn = useBarkleyStore((s) => s.isLoggedIn);
  const profileData = useBarkleyStore((s) => s.profileData);
  const setProfileData = useBarkleyStore((s) => s.setProfileData);

  useEffect(() => setMounted(true), []);

  // Redirect to / if not logged in (after mount so SSR stays consistent)
  useEffect(() => {
    if (mounted && !isLoggedIn) router.replace("/");
  }, [mounted, isLoggedIn, router]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    // TODO: Pre-fill from MongoDB once connected — currently uses localStorage via Zustand
    defaultValues: emptyProfileDefaults,
  });

  const { watch, setValue } = form;
  const birthday = watch("pet_birthday");

  // Pre-fill from stored profile data once after mount
  const hasPrefilled = useRef(false);
  useEffect(() => {
    if (mounted && profileData && !hasPrefilled.current) {
      hasPrefilled.current = true;
      form.reset(profileData);
    }
  }, [mounted, profileData, form]);

  // Auto-calculate age when birthday changes
  useEffect(() => {
    if (!birthday) return;
    setValue("pet_age_years", calcAgeFromBirthday(birthday), { shouldValidate: false });
  }, [birthday, setValue]);

  const onSubmit = form.handleSubmit((data) => {
    // TODO: POST to /api/profile/save once MongoDB is connected
    setProfileData(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  });

  if (!mounted) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="h-8 w-48 animate-pulse rounded-2xl bg-barkley-sand/40" />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-12 md:px-6 lg:px-8">
      {/* Page header */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-barkley-sage">
          Account
        </p>
        <h1 className="font-display text-4xl text-barkley-cocoa">My Profile</h1>
        <p className="text-sm text-muted-foreground">
          Keep your details up to date. Changes save to your account.
        </p>
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
            <div className="space-y-2">
              <Label htmlFor="p-owner_first_name">First name *</Label>
              <Input id="p-owner_first_name" {...form.register("owner_first_name")} />
              {form.formState.errors.owner_first_name && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.owner_first_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-owner_last_name">Last name *</Label>
              <Input id="p-owner_last_name" {...form.register("owner_last_name")} />
              {form.formState.errors.owner_last_name && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.owner_last_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-owner_phone">Phone *</Label>
              <Input id="p-owner_phone" type="tel" {...form.register("owner_phone")} />
              {form.formState.errors.owner_phone && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.owner_phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-owner_email">Email *</Label>
              <Input id="p-owner_email" type="email" {...form.register("owner_email")} />
              {form.formState.errors.owner_email && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.owner_email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-owner_city">City</Label>
              <Input id="p-owner_city" {...form.register("owner_city")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-signup_source">How did you hear about us?</Label>
              <select id="p-signup_source" className={fieldCls} {...form.register("signup_source")}>
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
            <p className="text-xs text-muted-foreground">All fields optional.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="p-pet_name">Pet name</Label>
              <Input id="p-pet_name" {...form.register("pet_name")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-pet_breed">Breed</Label>
              <Input id="p-pet_breed" {...form.register("pet_breed")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-pet_birthday">Birthday</Label>
              <Input id="p-pet_birthday" type="date" {...form.register("pet_birthday")} />
              <p className="text-[0.65rem] text-muted-foreground">
                Filling this in auto-calculates age below.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-pet_age_years">Age (years)</Label>
              <Input
                id="p-pet_age_years"
                type="number"
                min={0}
                {...form.register("pet_age_years")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-pet_weight_lbs">Weight (lbs)</Label>
              <Input
                id="p-pet_weight_lbs"
                type="number"
                min={0}
                step="0.1"
                {...form.register("pet_weight_lbs")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-pet_sex">Sex</Label>
              <select id="p-pet_sex" className={fieldCls} {...form.register("pet_sex")}>
                <option value="">Select…</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="p-activity_level">Activity level</Label>
              <select
                id="p-activity_level"
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

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="p-allergies">Allergies</Label>
              <textarea
                id="p-allergies"
                rows={3}
                className={`${fieldCls} resize-none`}
                placeholder="e.g. chicken, grain, dairy…"
                {...form.register("allergies")}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="p-health_conditions">Health conditions</Label>
              <textarea
                id="p-health_conditions"
                rows={3}
                className={`${fieldCls} resize-none`}
                placeholder="e.g. hip dysplasia, diabetes…"
                {...form.register("health_conditions")}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="p-vet_notes">Vet notes</Label>
              <textarea
                id="p-vet_notes"
                rows={3}
                className={`${fieldCls} resize-none`}
                placeholder="Any notes from your vet…"
                {...form.register("vet_notes")}
              />
            </div>
          </div>
        </section>

        {/* Submit row + inline success message */}
        <div className="flex flex-wrap items-center gap-4">
          <Button
            type="submit"
            className="rounded-full px-10 text-xs font-semibold uppercase tracking-[0.2em]"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Saving…" : "Save profile"}
          </Button>

          {saved && (
            <span className="inline-flex items-center gap-2 rounded-full bg-barkley-mist/80 px-4 py-2 text-xs font-semibold text-barkley-forest ring-1 ring-barkley-sage/30">
              <CheckCircle className="h-3.5 w-3.5" />
              Profile saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
