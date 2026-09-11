"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Eye,
  EyeOff,
  Fingerprint,
  Leaf,
  Loader2,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

type DemoAccount = { role: string; email: string; password: string };

const demoAccounts: DemoAccount[] = [
  { role: "Admin", email: "admin@test.com", password: "Admin@123456" },
  { role: "User", email: "user@test.com", password: "User@123456" },
];

export default function LoginForm2() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const resetTilt = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  };

  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [error, setError] = useState("");

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
        setError(
          result.error === "CredentialsSignin"
            ? "Invalid email or password"
            : result.error,
        );
      } else {
        window.setTimeout(() => {
          setLoading(false);
          setSignedIn(true);
        }, 900);
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="text-foreground flex min-h-screen flex-col overflow-hidden bg-[oklch(0.92_0.018_250)] lg:flex-row">
      {" "}
      {/* ========================================================= LEFT BRAND PANEL ========================================================= */}{" "}
      <section className="brand-panel relative flex min-h-[390px] flex-1 flex-col justify-between overflow-hidden bg-[radial-gradient(circle_at_45%_48%,oklch(0.92_0.14_145_/_0.72),transparent_29%),radial-gradient(circle_at_92%_6%,oklch(0.86_0.16_88_/_0.7),transparent_25%),var(--background)] px-6 py-6 sm:px-10 lg:min-h-screen lg:px-16 lg:py-8">
        {" "}
        {/* Grid */}{" "}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(oklch(0.8_0.1_195_/_0.08)_1px,transparent_1px),linear-gradient(90deg,oklch(0.8_0.1_195_/_0.08)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_85%)] [background-size:42px_42px] opacity-20"
        />{" "}
        {/* Orb 1 */}{" "}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[18%] left-[30%] h-[38rem] w-[38rem] animate-[breathe_8s_ease-in-out_infinite] rounded-full border border-[oklch(0.78_0.16_195_/_0.25)] shadow-[0_0_90px_oklch(0.75_0.16_195_/_0.1),inset_0_0_50px_oklch(0.75_0.16_195_/_0.08)] max-lg:top-0 max-lg:left-[40%] max-lg:h-[26rem] max-lg:w-[26rem]"
        />{" "}
        {/* Orb 2 */}{" "}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[5%] left-[37%] h-[48rem] w-[27rem] animate-[breathe_11s_ease-in-out_infinite] rounded-full border border-[oklch(0.8_0.13_35_/_0.25)] shadow-[0_0_90px_oklch(0.75_0.16_195_/_0.08)] [animation-delay:-3s] max-lg:top-[-4rem] max-lg:left-[52%] max-lg:h-[30rem] max-lg:w-[18rem]"
        />{" "}
        {/* Sweep */}{" "}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[48%] left-[10%] h-px w-[80%] animate-[sweep_7s_ease-in-out_infinite] bg-[linear-gradient(90deg,transparent,var(--primary),transparent)] opacity-45"
        />{" "}
        {/* Header */}{" "}
        <header className="relative z-10 flex animate-[enter-up_800ms_cubic-bezier(.16,1,.3,1)_50ms_forwards] items-center justify-between opacity-0">
          {" "}
          <div className="flex items-center gap-3" aria-label="NNPP home">
            {" "}
            <span className="bg-primary text-primary-foreground grid size-10 animate-[logo-float_4s_ease-in-out_infinite] place-items-center rounded-2xl shadow-[0_0_25px_oklch(0.78_0.16_195_/_0.25)]">
              {" "}
              <Leaf className="size-5" aria-hidden="true" />{" "}
            </span>{" "}
            <span className="font-mono text-sm font-bold tracking-[0.3em]">
              {" "}
              NNPP{" "}
            </span>{" "}
          </div>{" "}
          <span className="text-muted-foreground flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase">
            {" "}
            <span className="bg-primary size-1.5 animate-[blink_2s_ease-in-out_infinite] rounded-full shadow-[0_0_12px_var(--primary)]" />{" "}
            Live workspace{" "}
          </span>{" "}
        </header>{" "}
        {/* Hero */}{" "}
        <div className="relative z-10 max-w-xl py-14 lg:py-0">
          {" "}
          <p className="text-primary mb-6 flex animate-[enter-up_800ms_cubic-bezier(.16,1,.3,1)_140ms_forwards] items-center gap-3 font-mono text-[10px] tracking-[0.3em] uppercase opacity-0">
            {" "}
            <span className="bg-primary h-px w-10" /> Private by design{" "}
          </p>{" "}
          <h1 className="max-w-2xl animate-[enter-up_800ms_cubic-bezier(.16,1,.3,1)_230ms_forwards] text-6xl leading-[0.87] font-semibold tracking-[-0.09em] text-balance opacity-0 sm:text-7xl lg:text-[7.4rem]">
            {" "}
            Manage <br />{" "}
            <span className="text-primary [text-shadow:0_0_50px_oklch(0.78_0.16_195_/_0.23)]">
              {" "}
              with focus.{" "}
            </span>{" "}
          </h1>{" "}
          <p className="text-muted-foreground mt-8 max-w-sm animate-[enter-up_800ms_cubic-bezier(.16,1,.3,1)_320ms_forwards] text-sm leading-6 text-pretty opacity-0 sm:text-base">
            {" "}
            A centralized command center for managing fertilizer demand, supply,
            warehouses, logistics, and reporting.{" "}
          </p>{" "}
        </div>{" "}
        {/* Footer */}{" "}
        <footer className="text-muted-foreground relative z-10 flex animate-[enter-up_800ms_cubic-bezier(.16,1,.3,1)_410ms_forwards] items-end justify-between font-mono text-[10px] tracking-[0.22em] uppercase opacity-0">
          {" "}
          <span>NNPP / 01</span> <span>Secure workspace</span>{" "}
        </footer>{" "}
      </section>{" "}
      {/* ========================================================= RIGHT FORM PANEL ========================================================= */}{" "}
      <section className="flex flex-1 items-center justify-center bg-[oklch(0.97_0.012_250)] px-5 py-12 sm:px-10 lg:px-16">
        {" "}
        <div
          className="w-full max-w-md [perspective:1000px]"
          onPointerMove={handlePointerMove}
          onPointerLeave={resetTilt}
        >
          {" "}
          {/* Login Card */}{" "}
          <div className="relative [transform:rotateX(var(--tilt-y,0deg))_rotateY(var(--tilt-x,0deg))] overflow-hidden rounded-[1.75rem] border border-[oklch(0.88_0.018_250)] bg-[linear-gradient(145deg,oklch(1_0_0_/_0.98),oklch(0.985_0.012_250_/_0.98))] p-6 shadow-[0_30px_90px_oklch(0.28_0.04_250_/_0.12),0_0_0_1px_oklch(0.55_0.08_250_/_0.06)] transition-[transform,box-shadow] duration-300 hover:shadow-[0_40px_110px_oklch(0.28_0.04_255_/_0.18),0_0_40px_oklch(0.58_0.17_148_/_0.12)] max-[560px]:rounded-[1.35rem] sm:p-9">
            {" "}
            {/* Card Glow */}{" "}
            <div
              aria-hidden="true"
              className="bg-primary pointer-events-none absolute top-[-8rem] right-[-8rem] size-56 animate-[card-glow_6s_ease-in-out_infinite] rounded-full opacity-[0.09] blur-[22px]"
            />{" "}
            <div className="relative z-10">
              {" "}
              {/* Card Header */}{" "}
              <div className="mb-8 flex items-start justify-between gap-5">
                {" "}
                <div>
                  {" "}
                  <div className="text-primary mb-4 flex items-center gap-2 text-[10px] font-semibold tracking-[0.28em] uppercase">
                    {" "}
                    <Sparkles className="size-3" aria-hidden="true" /> Workspace
                    access{" "}
                  </div>{" "}
                  <h2 className="text-4xl font-semibold tracking-[-0.07em] sm:text-5xl">
                    {" "}
                    Welcome back.{" "}
                  </h2>{" "}
                  <p className="text-muted-foreground mt-3 text-sm leading-6">
                    {" "}
                    The next clear move starts here.{" "}
                  </p>{" "}
                </div>{" "}
                <span className="border-border text-primary hidden animate-[fingerprint-pulse_3s_ease-in-out_infinite] rounded-2xl border p-3 shadow-[0_0_20px_oklch(0.78_0.16_195_/_0.1)] sm:block">
                  {" "}
                  <Fingerprint className="size-5" aria-hidden="true" />{" "}
                </span>{" "}
              </div>{" "}
              {/* Error */}{" "}
              {error && (
                <div className="border-destructive/20 bg-destructive/5 text-destructive mb-5 rounded-xl border px-4 py-3 text-sm">
                  {" "}
                  {error}{" "}
                </div>
              )}{" "}
              {/* Form */}{" "}
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {" "}
                {/* Email */}{" "}
                <label htmlFor="email" className="flex flex-col gap-2">
                  {" "}
                  <span
                    className={`font-mono text-[10px] font-medium tracking-[0.18em] uppercase transition-all duration-200 ${focused === "email" ? "text-primary translate-x-[3px]" : "text-muted-foreground"} `}
                  >
                    {" "}
                    Email address{" "}
                  </span>{" "}
                  <span className="relative block">
                    {" "}
                    <Mail
                      className={`pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 transition-all duration-200 ${focused === "email" ? "text-primary scale-110" : "text-muted-foreground"} `}
                      aria-hidden="true"
                    />{" "}
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      disabled={loading}
                      required
                      className="border-border bg-background/70 text-foreground placeholder:text-muted-foreground/65 focus:border-primary focus:bg-card h-15 w-full rounded-2xl border px-11 transition-all duration-200 outline-none focus:-translate-y-[3px] focus:shadow-[0_0_0_4px_oklch(0.58_0.17_148_/_0.12),0_10px_30px_oklch(0.58_0.17_148_/_0.08)] disabled:cursor-not-allowed disabled:opacity-60"
                    />{" "}
                  </span>{" "}
                </label>{" "}
                {/* Password */}{" "}
                <label htmlFor="password" className="flex flex-col gap-2">
                  {" "}
                  <span
                    className={`font-mono text-[10px] font-medium tracking-[0.18em] uppercase transition-all duration-200 ${focused === "password" ? "text-primary translate-x-[3px]" : "text-muted-foreground"} `}
                  >
                    {" "}
                    Password{" "}
                  </span>{" "}
                  <span className="relative block">
                    {" "}
                    <LockKeyhole
                      className={`pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 transition-all duration-200 ${focused === "password" ? "text-primary scale-110" : "text-muted-foreground"} `}
                      aria-hidden="true"
                    />{" "}
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused(null)}
                      disabled={loading}
                      required
                      className="border-border bg-background/70 text-foreground placeholder:text-muted-foreground/65 focus:border-primary focus:bg-card h-15 w-full rounded-2xl border px-11 pr-12 transition-all duration-200 outline-none focus:-translate-y-[3px] focus:shadow-[0_0_0_4px_oklch(0.58_0.17_148_/_0.12),0_10px_30px_oklch(0.58_0.17_148_/_0.08)] disabled:cursor-not-allowed disabled:opacity-60"
                    />{" "}
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      disabled={loading}
                      className="text-muted-foreground hover:bg-accent hover:text-foreground absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full transition disabled:pointer-events-none disabled:opacity-50"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {" "}
                      {showPassword ? (
                        <EyeOff className="size-4" aria-hidden="true" />
                      ) : (
                        <Eye className="size-4" aria-hidden="true" />
                      )}{" "}
                    </button>{" "}
                  </span>{" "}
                </label>{" "}
                {/* Remember / Forgot */}{" "}
                <div className="flex items-center justify-between gap-4 text-xs">
                  {" "}
                  <label
                    htmlFor="remember"
                    className="text-muted-foreground flex cursor-pointer items-center gap-2"
                  >
                    {" "}
                    <input
                      id="remember"
                      type="checkbox"
                      checked={remember}
                      onChange={(event) => setRemember(event.target.checked)}
                      disabled={loading}
                      className="border-border accent-primary size-4 rounded"
                    />{" "}
                    Remember me{" "}
                  </label>{" "}
                  <a
                    href="#forgot"
                    className="text-primary hover:text-primary/70 font-medium transition"
                  >
                    {" "}
                    Forgot password?{" "}
                  </a>{" "}
                </div>{" "}
                {/* Submit */}{" "}
                <Button
                  type="submit"
                  disabled={loading || signedIn}
                  className={`group bg-primary text-primary-foreground hover:bg-primary relative mt-2 h-14 w-full overflow-hidden rounded-2xl shadow-[0_12px_30px_oklch(0.78_0.16_195_/_0.16)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_18px_40px_oklch(0.78_0.16_195_/_0.26)] ${signedIn ? "bg-[oklch(0.7_0.15_150)] hover:bg-[oklch(0.7_0.15_150)]" : ""} `}
                >
                  {" "}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -translate-x-[120%] bg-[linear-gradient(110deg,transparent_25%,oklch(1_0_0_/_0.28)_50%,transparent_75%)] transition-transform duration-700 group-hover:translate-x-[120%]"
                  />{" "}
                  {loading ? (
                    <>
                      {" "}
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />{" "}
                      Signing in...{" "}
                    </>
                  ) : signedIn ? (
                    <>
                      {" "}
                      <Check className="size-4" aria-hidden="true" />{" "}
                      You&apos;re in{" "}
                    </>
                  ) : (
                    <>
                      {" "}
                      <span>Enter workspace</span>{" "}
                      <ArrowUpRight
                        className="size-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                        aria-hidden="true"
                      />{" "}
                    </>
                  )}{" "}
                </Button>{" "}
              </form>{" "}
              {/* Divider */}{" "}
              <div className="text-muted-foreground/70 my-7 flex items-center gap-4 font-mono text-[10px] tracking-[0.2em] uppercase">
                {" "}
                <span className="bg-border h-px flex-1" /> or{" "}
                <span className="bg-border h-px flex-1" />{" "}
              </div>{" "}
              {/* Google */}{" "}
              <Button
                type="button"
                variant="outline"
                className="google-button border-border bg-card text-foreground hover:border-primary hover:bg-accent h-14 w-full rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
              >
                {" "}
                <span
                  aria-hidden="true"
                  className="bg-foreground text-background grid size-6 place-items-center rounded-full text-[10px] font-bold"
                >
                  {" "}
                  G{" "}
                </span>{" "}
                Continue with Google{" "}
              </Button>{" "}
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
              {/* Security */}{" "}
              <div className="text-muted-foreground mt-7 flex items-center justify-center gap-2 text-xs">
                {" "}
                <span className="text-primary grid size-5 place-items-center rounded-full bg-[oklch(0.78_0.16_195_/_0.12)]">
                  {" "}
                  <LockKeyhole className="size-3" aria-hidden="true" />{" "}
                </span>{" "}
                End-to-end encrypted workspace{" "}
              </div>{" "}
              {/* Signup */}{" "}
              <p className="text-muted-foreground mt-6 text-center text-sm">
                {" "}
                New to NNPP?{" "}
                <a
                  href="#signup"
                  className="text-primary hover:text-primary/70 font-semibold transition"
                >
                  {" "}
                  Create an account{" "}
                </a>{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
    </main>
  );
}
