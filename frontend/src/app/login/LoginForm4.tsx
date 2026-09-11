"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import {
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  Leaf,
  Sparkles,
  Mail,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";

export default function LoginForm2() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-background text-foreground min-h-screen overflow-hidden">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <section className="bg-ink relative flex min-h-[430px] flex-1 flex-col justify-between overflow-hidden px-6 py-7 text-white sm:px-10 lg:min-h-screen lg:px-16 lg:py-10">
          <div
            className="grain pointer-events-none absolute inset-0 opacity-25"
            aria-hidden="true"
          />
          <div
            className="orb orb-one bg-coral/80 pointer-events-none absolute -top-24 -right-24 size-72 rounded-full blur-3xl"
            aria-hidden="true"
          />
          <div
            className="orb orb-two bg-indigo/70 pointer-events-none absolute bottom-0 left-1/4 size-64 rounded-full blur-3xl"
            aria-hidden="true"
          />

          <header className="animate-fade-up relative z-10 flex items-center justify-between">
            <a
              href="#"
              className="flex items-center gap-3"
              aria-label="Luma home"
            >
              <span className="text-ink grid size-9 place-items-center rounded-xl bg-white shadow-lg shadow-black/20">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <span className="font-mono text-sm font-bold tracking-[0.22em]">
                LUMA
              </span>
            </a>
            <p className="hidden font-mono text-[10px] tracking-[0.22em] text-white/55 uppercase sm:block">
              Workspace / 04
            </p>
          </header>

          <div className="relative z-10 max-w-xl py-16 lg:py-0">
            <p className="text-coral animate-fade-up mb-6 flex items-center gap-3 font-mono text-[10px] tracking-[0.28em] uppercase [animation-delay:120ms]">
              <span className="bg-coral h-px w-8" /> The calmer way to work
            </p>
            <h1 className="animate-fade-up max-w-lg text-5xl leading-[0.98] font-semibold tracking-[-0.06em] text-balance [animation-delay:220ms] sm:text-6xl lg:text-7xl">
              Make space for the work that matters.
            </h1>
            <p className="animate-fade-up mt-7 max-w-md text-sm leading-6 text-pretty text-white/65 [animation-delay:320ms] sm:text-base">
              Luma brings your people, projects, and momentum into one clear
              place — so every day starts with intention.
            </p>
          </div>

          <footer className="animate-fade-up relative z-10 flex items-end justify-between gap-6 [animation-delay:420ms]">
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] text-white/45 uppercase">
                Trusted by teams at
              </p>
              <div className="mt-3 flex items-center gap-5 text-sm font-medium text-white/75">
                <span>northstar</span>
                <span>Rove</span>
                <span>frame.io</span>
              </div>
            </div>
            <p className="hidden max-w-32 text-right text-xs leading-5 text-white/45 sm:block">
              A little more focus. A lot more forward.
            </p>
          </footer>
        </section>

        <section className="bg-paper flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="animate-fade-up w-full max-w-md [animation-delay:180ms]">
            <div className="mb-10">
              <p className="text-muted-foreground mb-4 font-mono text-[10px] tracking-[0.26em] uppercase">
                Welcome back
              </p>
              <h2 className="text-ink text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Sign in to Luma
              </h2>
              <p className="text-muted-foreground mt-3 text-sm leading-6">
                Pick up right where you left off.
              </p>
            </div>

            <form
              className="flex flex-col gap-5"
              onSubmit={(event) => event.preventDefault()}
            >
              <label
                className="text-ink flex flex-col gap-2 text-sm font-medium"
                htmlFor="email"
              >
                Email address
                <span className="relative">
                  <Mail
                    className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    className="border-border text-ink placeholder:text-muted-foreground/60 focus:border-indigo focus:ring-indigo/10 h-12 w-full rounded-xl border bg-white pr-4 pl-11 text-sm transition outline-none focus:ring-4"
                    required
                  />
                </span>
              </label>

              <label
                className="text-ink flex flex-col gap-2 text-sm font-medium"
                htmlFor="password"
              >
                Password
                <span className="relative">
                  <LockKeyhole
                    className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="border-border text-ink placeholder:text-muted-foreground/60 focus:border-indigo focus:ring-indigo/10 h-12 w-full rounded-xl border bg-white px-11 text-sm transition outline-none focus:ring-4"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:bg-muted hover:text-ink absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-lg transition"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </button>
                </span>
              </label>

              <div className="flex items-center justify-between gap-4 text-xs">
                <label
                  className="text-muted-foreground flex cursor-pointer items-center gap-2"
                  htmlFor="remember"
                >
                  <input
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                    className="border-border accent-indigo size-4 rounded"
                  />
                  Remember me
                </label>
                <a
                  href="#forgot"
                  className="text-indigo hover:text-coral font-medium transition"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="group bg-indigo shadow-indigo/20 hover:bg-indigo/90 mt-2 h-12 rounded-xl text-white shadow-lg transition hover:-translate-y-0.5"
              >
                Continue{" "}
                <ArrowRight
                  data-icon="inline-end"
                  className="transition-transform group-hover:translate-x-1"
                />
              </Button>
            </form>

            <div className="text-muted-foreground/70 my-8 flex items-center gap-4 font-mono text-[10px] tracking-[0.2em] uppercase">
              <span className="bg-border h-px flex-1" /> or{" "}
              <span className="bg-border h-px flex-1" />
            </div>

            <Button
              variant="outline"
              className="border-border text-ink hover:bg-muted h-12 w-full rounded-xl bg-white"
            >
              <span
                className="bg-ink grid size-5 place-items-center rounded-full text-[10px] font-bold text-white"
                aria-hidden="true"
              >
                G
              </span>
              Continue with Google
            </Button>

            <p className="text-muted-foreground mt-8 text-center text-sm">
              New to Luma?{" "}
              <a
                href="#signup"
                className="text-indigo hover:text-coral font-semibold"
              >
                Create an account
              </a>
            </p>
            <p className="text-muted-foreground/70 mt-12 text-center text-[10px] leading-5">
              By continuing, you agree to our{" "}
              <a href="#terms" className="underline underline-offset-2">
                Terms
              </a>{" "}
              and{" "}
              <a href="#privacy" className="underline underline-offset-2">
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
