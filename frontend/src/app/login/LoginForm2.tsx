"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";

import { Button } from "@/presentation/components/ui/button";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const resetTilt = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
    setTilt({ x: 0, y: 0 });
  };

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();

    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;

    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -8;

    setTilt({ x, y });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        const message =
          result.error === "CredentialsSignin"
            ? "Invalid email or password"
            : result.error;

        toast.error(message + "Check your backend");

        return;
      }

      window.setTimeout(() => {
        setLoading(false);
        setSignedIn(true);
      }, 900);

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  type DemoAccount = { role: string; email: string; password: string };

  const demoAccounts: DemoAccount[] = [
    { role: "Admin", email: "admin@test.com", password: "Admin@123456" },
    { role: "User", email: "user@test.com", password: "User@123456" },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[oklch(0.97_0.012_250)] text-[oklch(0.20_0.025_250)]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* =====================================================
            LEFT SIDE
           ===================================================== */}
        <section className="relative flex min-h-[480px] flex-1 flex-col justify-between overflow-hidden bg-[oklch(0.92_0.018_250)] px-6 py-7 sm:px-10 lg:min-h-screen lg:px-16 lg:py-10">
          {/* Background glow */}
          <div className="pointer-events-none absolute -top-32 -right-32 size-[28rem] rounded-full bg-[oklch(0.78_0.075_190_/_0.28)] blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 -left-24 size-[26rem] rounded-full bg-[oklch(0.72_0.075_225_/_0.22)] blur-3xl" />

          <div className="pointer-events-none absolute top-1/2 left-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.82_0.055_175_/_0.10)] blur-3xl" />

          {/* Subtle grid */}
          <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] [background-size:42px_42px] opacity-[0.035]" />

          {/* Brand */}
          <header className="animate-fade-up relative z-10 flex items-center justify-between">
            <a
              href="#"
              className="group flex items-center gap-3"
              aria-label="Healthcare system home"
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-white text-[oklch(0.38_0.12_220)] shadow-[0_12px_30px_oklch(0.35_0.05_250_/_0.12)] ring-1 ring-[oklch(0.85_0.02_250)] transition duration-300 group-hover:-translate-y-0.5">
                <HeartPulse className="size-5" strokeWidth={2.2} />
              </span>

              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-[0.18em] text-[oklch(0.25_0.045_250)]">
                  MEDICARE
                </span>

                <span className="text-[9px] font-medium tracking-[0.24em] text-[oklch(0.48_0.035_250)] uppercase">
                  Healthcare System
                </span>
              </div>
            </a>

            <div className="hidden items-center gap-2 rounded-full border border-[oklch(0.84_0.025_250)] bg-white/60 px-3 py-1.5 text-[10px] font-medium tracking-[0.16em] text-[oklch(0.43_0.035_250)] uppercase backdrop-blur-sm sm:flex">
              <span className="size-1.5 rounded-full bg-[oklch(0.62_0.14_165)]" />
              Secure Healthcare
            </div>
          </header>

          {/* Hero */}
          <div className="relative z-10 max-w-xl py-16 lg:py-0">
            <div className="animate-fade-up mb-6 flex items-center gap-3 [animation-delay:120ms]">
              <span className="grid size-8 place-items-center rounded-lg bg-white/70 text-[oklch(0.40_0.12_185)] ring-1 ring-white/80">
                <ShieldCheck className="size-4" />
              </span>

              <p className="text-[10px] font-semibold tracking-[0.25em] text-[oklch(0.40_0.075_220)] uppercase">
                Trusted care. Connected teams.
              </p>
            </div>

            <h1 className="animate-fade-up max-w-lg text-5xl leading-[1.02] font-semibold tracking-[-0.055em] text-balance text-[oklch(0.20_0.035_250)] [animation-delay:220ms] sm:text-6xl lg:text-7xl">
              Better care starts with{" "}
              <span className="text-[oklch(0.40_0.12_200)]">
                better connection.
              </span>
            </h1>

            <p className="animate-fade-up mt-7 max-w-md text-sm leading-6 text-[oklch(0.40_0.035_250)] [animation-delay:320ms] sm:text-base">
              One secure place for clinicians, healthcare teams, and
              administrators to coordinate care, manage information, and keep
              patients at the center of every decision.
            </p>

            <div className="animate-fade-up mt-9 flex flex-wrap gap-3 [animation-delay:380ms]">
              <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-3.5 py-2 text-xs font-medium text-[oklch(0.34_0.04_250)] shadow-sm backdrop-blur-sm">
                <LockKeyhole className="size-3.5 text-[oklch(0.40_0.12_200)]" />
                Secure
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-3.5 py-2 text-xs font-medium text-[oklch(0.34_0.04_250)] shadow-sm backdrop-blur-sm">
                <Activity className="size-3.5 text-[oklch(0.45_0.11_165)]" />
                Connected care
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-3.5 py-2 text-xs font-medium text-[oklch(0.34_0.04_250)] shadow-sm backdrop-blur-sm">
                <Stethoscope className="size-3.5 text-[oklch(0.40_0.12_220)]" />
                Built for clinicians
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="animate-fade-up relative z-10 flex items-end justify-between gap-6 [animation-delay:460ms]">
            <div>
              <p className="text-[9px] font-semibold tracking-[0.22em] text-[oklch(0.48_0.035_250)] uppercase">
                Designed for healthcare professionals
              </p>

              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-medium text-[oklch(0.36_0.04_250)]">
                  <span className="grid size-6 place-items-center rounded-md bg-white/70">
                    <UserRound className="size-3.5" />
                  </span>
                  Clinicians
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-[oklch(0.36_0.04_250)]">
                  <span className="grid size-6 place-items-center rounded-md bg-white/70">
                    <Building2 className="size-3.5" />
                  </span>
                  Hospitals
                </div>
              </div>
            </div>

            <p className="hidden max-w-40 text-right text-xs leading-5 text-[oklch(0.47_0.035_250)] sm:block">
              Simple tools for better decisions, safer care, and healthier
              outcomes.
            </p>
          </footer>
        </section>

        {/* =====================================================
            RIGHT SIDE
           ===================================================== */}
        <section className="relative flex flex-1 items-center justify-center overflow-hidden bg-[oklch(0.97_0.012_250)] px-6 py-12 sm:px-10 lg:px-16">
          {/* Decorative background */}
          <div className="pointer-events-none absolute -top-40 -right-40 size-96 rounded-full bg-[oklch(0.82_0.055_190_/_0.10)] blur-3xl" />

          <div className="pointer-events-none absolute -bottom-40 -left-40 size-96 rounded-full bg-[oklch(0.80_0.055_220_/_0.08)] blur-3xl" />

          <div className="relative z-10 w-full max-w-md">
            {/* Heading */}
            <div className="animate-fade-up mb-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-[oklch(0.92_0.025_200)] text-[oklch(0.40_0.12_200)] ring-1 ring-[oklch(0.87_0.025_200)]">
                  <HeartPulse className="size-5" />
                </div>

                <div>
                  <p className="text-[9px] font-semibold tracking-[0.2em] text-[oklch(0.48_0.035_250)] uppercase">
                    Healthcare Portal
                  </p>

                  <p className="text-xs font-medium text-[oklch(0.32_0.04_250)]">
                    Secure access
                  </p>
                </div>
              </div>

              <p className="mb-3 text-[10px] font-semibold tracking-[0.24em] text-[oklch(0.46_0.06_200)] uppercase">
                Welcome back
              </p>

              <h2 className="text-3xl font-semibold tracking-[-0.045em] text-[oklch(0.20_0.035_250)] sm:text-4xl">
                Sign in to your portal
              </h2>

              <p className="mt-3 text-sm leading-6 text-[oklch(0.47_0.03_250)]">
                Access your clinical workspace and continue providing connected,
                efficient care.
              </p>
            </div>

            {/* Login Card */}
            <div
              onPointerMove={handlePointerMove}
              onPointerLeave={resetTilt}
              className="rounded-2xl border border-[oklch(0.88_0.018_250)] bg-[linear-gradient(145deg,oklch(1_0_0_/_0.98),oklch(0.985_0.012_250_/_0.98))] p-6 shadow-[0_30px_80px_oklch(0.28_0.04_250_/_0.10),0_0_0_1px_oklch(0.55_0.08_250_/_0.04)] transition-transform duration-200 will-change-transform sm:p-7"
            >
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {/* Email */}
                <label
                  htmlFor="email"
                  className="flex flex-col gap-2 text-sm font-medium text-[oklch(0.28_0.035_250)]"
                >
                  Email address
                  <span className="relative">
                    <Mail
                      className={`pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 transition-colors ${
                        focused === "email"
                          ? "text-[oklch(0.45_0.12_200)]"
                          : "text-[oklch(0.52_0.035_250)]"
                      } `}
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      autoComplete="email"
                      placeholder="you@hospital.org"
                      className="h-12 w-full rounded-xl border border-[oklch(0.87_0.018_250)] bg-white pr-4 pl-11 text-sm text-[oklch(0.25_0.035_250)] transition-all duration-200 outline-none placeholder:text-[oklch(0.62_0.025_250)] hover:border-[oklch(0.80_0.025_250)] focus:border-[oklch(0.55_0.12_200)] focus:ring-4 focus:ring-[oklch(0.55_0.12_200_/_0.10)]"
                      required
                    />
                  </span>
                </label>

                {/* Password */}
                <label
                  htmlFor="password"
                  className="flex flex-col gap-2 text-sm font-medium text-[oklch(0.28_0.035_250)]"
                >
                  Password
                  <span className="relative">
                    <LockKeyhole
                      className={`pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 transition-colors ${
                        focused === "password"
                          ? "text-[oklch(0.45_0.12_200)]"
                          : "text-[oklch(0.52_0.035_250)]"
                      } `}
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused(null)}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="h-12 w-full rounded-xl border border-[oklch(0.87_0.018_250)] bg-white px-11 text-sm text-[oklch(0.25_0.035_250)] transition-all duration-200 outline-none placeholder:text-[oklch(0.62_0.025_250)] hover:border-[oklch(0.80_0.025_250)] focus:border-[oklch(0.55_0.12_200)] focus:ring-4 focus:ring-[oklch(0.55_0.12_200_/_0.10)]"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-[oklch(0.52_0.035_250)] transition hover:bg-[oklch(0.94_0.012_250)] hover:text-[oklch(0.32_0.06_250)]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </span>
                </label>

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-[oklch(0.86_0.08_25)] bg-[oklch(0.97_0.025_25)] px-4 py-3 text-xs font-medium text-[oklch(0.48_0.16_25)]"
                  >
                    {error}
                  </div>
                )}

                {/* Remember / Forgot */}
                <div className="flex items-center justify-between gap-4 text-xs">
                  <label
                    htmlFor="remember"
                    className="flex cursor-pointer items-center gap-2 text-[oklch(0.50_0.03_250)]"
                  >
                    <input
                      id="remember"
                      type="checkbox"
                      checked={remember}
                      onChange={(event) => setRemember(event.target.checked)}
                      className="size-4 rounded border-[oklch(0.80_0.02_250)] accent-[oklch(0.50_0.12_200)]"
                    />
                    Remember me
                  </label>

                  <a
                    href="#forgot"
                    className="font-semibold text-[oklch(0.43_0.11_200)] transition hover:text-[oklch(0.36_0.13_190)]"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading || signedIn}
                  className="group mt-2 h-12 rounded-xl bg-[oklch(0.43_0.12_205)] text-white shadow-[0_10px_25px_oklch(0.43_0.12_205_/_0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[oklch(0.39_0.13_205)] hover:shadow-[0_14px_30px_oklch(0.43_0.12_205_/_0.28)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : signedIn ? (
                    <>
                      <ShieldCheck className="size-4" />
                      Signed in
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight
                        data-icon="inline-end"
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </Button>
              </form>
              {/* Divider */}
              <div className="my-7 flex items-center gap-4 text-[9px] font-semibold tracking-[0.18em] text-[oklch(0.60_0.025_250)] uppercase">
                <span className="h-px flex-1 bg-[oklch(0.90_0.015_250)]" />
                or
                <span className="h-px flex-1 bg-[oklch(0.90_0.015_250)]" />
              </div>
              {/* Google */}
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full rounded-xl border-[oklch(0.87_0.018_250)] bg-white text-[oklch(0.30_0.035_250)] transition-all duration-200 hover:border-[oklch(0.80_0.025_250)] hover:bg-[oklch(0.985_0.008_250)] hover:shadow-sm"
              >
                <span className="grid size-5 place-items-center rounded-full border border-[oklch(0.86_0.015_250)] bg-white text-[10px] font-bold text-[oklch(0.35_0.04_250)]">
                  G
                </span>
                Continue with Google
              </Button>
              {/* Demo Accounts */}{" "}
              <div className="mt-5 rounded-2xl border border-dashed border-[oklch(0.78_0.04_95)] bg-[oklch(0.96_0.02_95_/_0.8)] p-4">
                {" "}
                <div className="mb-3 flex items-center gap-2">
                  {" "}
                  <span className="bg-border/50 h-px flex-1" />{" "}
                  <p className="text-muted-foreground font-mono text-[9px] tracking-[0.18em] uppercase">
                    {" "}
                    Quick access{" "}
                  </p>{" "}
                  <span className="bg-border/50 h-px flex-1" />{" "}
                </div>{" "}
                <div className="grid grid-cols-2 gap-2">
                  {" "}
                  {demoAccounts.map((account) => (
                    <button
                      key={account.role}
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        setEmail(account.email);
                        setPassword(account.password);
                        setSignedIn(false);
                        setError("");
                      }}
                      className="bg-card/70 hover:border-primary/55 flex min-w-0 flex-col gap-0.5 rounded-xl border border-[oklch(0.84_0.03_95)] p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-[oklch(0.98_0.04_95)] disabled:pointer-events-none disabled:opacity-50"
                    >
                      {" "}
                      <span className="text-primary text-[11px] font-bold">
                        {" "}
                        {account.role}{" "}
                      </span>{" "}
                      <small className="text-muted-foreground truncate text-[10px]">
                        {" "}
                        {account.email}{" "}
                      </small>{" "}
                    </button>
                  ))}{" "}
                </div>{" "}
              </div>{" "}
            </div>

            {/* Account */}
            <p className="mt-7 text-center text-sm text-[oklch(0.50_0.03_250)]">
              New to the healthcare portal?{" "}
              <a
                href="#signup"
                className="font-semibold text-[oklch(0.43_0.11_200)] transition hover:text-[oklch(0.36_0.13_190)]"
              >
                Create an account
              </a>
            </p>

            {/* Security */}
            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] leading-5 text-[oklch(0.58_0.025_250)]">
              <ShieldCheck className="size-3.5" />

              <span>
                Your connection is protected with secure authentication
              </span>
            </div>

            {/* Legal */}
            <p className="mt-4 text-center text-[10px] leading-5 text-[oklch(0.63_0.02_250)]">
              By continuing, you agree to our{" "}
              <a
                href="#terms"
                className="underline underline-offset-2 hover:text-[oklch(0.42_0.05_250)]"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="#privacy"
                className="underline underline-offset-2 hover:text-[oklch(0.42_0.05_250)]"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
