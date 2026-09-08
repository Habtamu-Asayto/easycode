
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

  const callbackUrl =
    searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [remember, setRemember] = useState(true)

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
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <section className="relative flex min-h-[430px] flex-1 flex-col justify-between overflow-hidden bg-ink px-6 py-7 text-white sm:px-10 lg:min-h-screen lg:px-16 lg:py-10">
          <div className="grain pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
          <div className="orb orb-one pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-coral/80 blur-3xl" aria-hidden="true" />
          <div className="orb orb-two pointer-events-none absolute bottom-0 left-1/4 size-64 rounded-full bg-indigo/70 blur-3xl" aria-hidden="true" />

          <header className="relative z-10 flex items-center justify-between animate-fade-up">
            <a href="#" className="flex items-center gap-3" aria-label="Luma home">
              <span className="grid size-9 place-items-center rounded-xl bg-white text-ink shadow-lg shadow-black/20">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <span className="font-mono text-sm font-bold tracking-[0.22em]">LUMA</span>
            </a>
            <p className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 sm:block">Workspace / 04</p>
          </header>

          <div className="relative z-10 max-w-xl py-16 lg:py-0">
            <p className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-coral animate-fade-up [animation-delay:120ms]">
              <span className="h-px w-8 bg-coral" /> The calmer way to work
            </p>
            <h1 className="max-w-lg text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-6xl lg:text-7xl animate-fade-up [animation-delay:220ms]">
              Make space for the work that matters.
            </h1>
            <p className="mt-7 max-w-md text-pretty text-sm leading-6 text-white/65 sm:text-base animate-fade-up [animation-delay:320ms]">
              Luma brings your people, projects, and momentum into one clear place — so every day starts with intention.
            </p>
          </div>

          <footer className="relative z-10 flex items-end justify-between gap-6 animate-fade-up [animation-delay:420ms]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Trusted by teams at</p>
              <div className="mt-3 flex items-center gap-5 text-sm font-medium text-white/75">
                <span>northstar</span><span>Rove</span><span>frame.io</span>
              </div>
            </div>
            <p className="hidden max-w-32 text-right text-xs leading-5 text-white/45 sm:block">A little more focus. A lot more forward.</p>
          </footer>
        </section>

        <section className="flex flex-1 items-center justify-center bg-paper px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-md animate-fade-up [animation-delay:180ms]">
            <div className="mb-10">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">Welcome back</p>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">Sign in to Luma</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Pick up right where you left off.</p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={(event) => event.preventDefault()}>
              <label className="flex flex-col gap-2 text-sm font-medium text-ink" htmlFor="email">
                Email address
                <span className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" className="h-12 w-full rounded-xl border border-border bg-white pl-11 pr-4 text-sm text-ink outline-none transition placeholder:text-muted-foreground/60 focus:border-indigo focus:ring-4 focus:ring-indigo/10" required />
                </span>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-ink" htmlFor="password">
                Password
                <span className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" className="h-12 w-full rounded-xl border border-border bg-white px-11 text-sm text-ink outline-none transition placeholder:text-muted-foreground/60 focus:border-indigo focus:ring-4 focus:ring-indigo/10" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-ink" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                  </button>
                </span>
              </label>

              <div className="flex items-center justify-between gap-4 text-xs">
                <label className="flex cursor-pointer items-center gap-2 text-muted-foreground" htmlFor="remember">
                  <input id="remember" type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="size-4 rounded border-border accent-indigo" />
                  Remember me
                </label>
                <a href="#forgot" className="font-medium text-indigo transition hover:text-coral">Forgot password?</a>
              </div>

              <Button type="submit" className="group mt-2 h-12 rounded-xl bg-indigo text-white shadow-lg shadow-indigo/20 transition hover:-translate-y-0.5 hover:bg-indigo/90">
                Continue <ArrowRight data-icon="inline-end" className="transition-transform group-hover:translate-x-1" />
              </Button>
            </form>

            <div className="my-8 flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/70">
              <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
            </div>

            <Button variant="outline" className="h-12 w-full rounded-xl border-border bg-white text-ink hover:bg-muted">
              <span className="grid size-5 place-items-center rounded-full bg-ink text-[10px] font-bold text-white" aria-hidden="true">G</span>
              Continue with Google
            </Button>

            <p className="mt-8 text-center text-sm text-muted-foreground">New to Luma? <a href="#signup" className="font-semibold text-indigo hover:text-coral">Create an account</a></p>
            <p className="mt-12 text-center text-[10px] leading-5 text-muted-foreground/70">By continuing, you agree to our <a href="#terms" className="underline underline-offset-2">Terms</a> and <a href="#privacy" className="underline underline-offset-2">Privacy Policy</a>.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
