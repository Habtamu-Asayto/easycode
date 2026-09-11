"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Loader2, Eye, EyeOff, AlertCircle, Leaf } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-muted/30 flex min-h-screen">
      {/* Left: Brand panel */}
      <div className="from-primary hidden flex-col justify-between bg-gradient-to-br to-emerald-700 p-10 text-white lg:flex lg:w-[420px]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg leading-tight font-bold">
                Fertilizer Management System
              </h2>
              <p className="text-[12px] text-white/70">
                Fertilizer Management Platform
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl leading-tight font-bold">
              Manage Fertilizer Distribution with Confidence
            </h1>
            <p className="mt-3 max-w-[320px] text-[14px] leading-relaxed text-white/80">
              A centralized platform for managing fertilizer demand, supply,
              warehouses, logistics, and reporting across Ethiopia.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Regions", value: "11+" },
              { label: "Users", value: "1,200+" },
              { label: "MT Tracked", value: "74M+" },
              { label: "Uptime", value: "99.9%" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg bg-white/10 p-3">
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-[11px] text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-white/40">
          © {new Date().getFullYear()} Fertilizer Management System. All rights
          reserved.
        </p>
      </div>

      {/* Right: Sign in form */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-[400px]">
          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-lg">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-foreground text-lg font-bold">
              Fertilizer Management System
            </span>
          </div>

          {/* Sign in card */}
          <div className="bg-card rounded-lg border p-8 shadow-sm">
            <div className="mb-6">
              <h1 className="text-foreground text-xl font-semibold">Sign in</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Enter your credentials to access your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 p-3 text-[13px] text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-foreground text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  autoFocus
                  disabled={loading}
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-foreground text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    disabled={loading}
                    className="h-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="h-10 w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            {/* Demo accounts */}
            <div className="bg-muted/50 mt-6 rounded-md border p-3">
              <p className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">
                Demo Accounts
              </p>
              <div className="text-muted-foreground space-y-1 text-xs">
                <p>
                  <span className="text-foreground font-medium">Admin:</span>{" "}
                  admin@test.com / Admin@123456
                </p>
                <p>
                  <span className="text-foreground font-medium">User:</span>{" "}
                  user@test.com / User@123456
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
