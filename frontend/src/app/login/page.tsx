import { Suspense } from "react";

import LoginForm from "./LoginForm";
import LoginForm2 from "./LoginForm2";
import LoginForm3 from "./LoginForm3";
import LoginForm4 from "./LoginForm4";

function LoginLoading() {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center">
      <div className="text-muted-foreground flex items-center gap-3 text-sm">
        <span className="border-muted border-t-primary size-4 animate-spin rounded-full border-2" />
        Loading...
      </div>
    </main>
  );
}
export default async function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm2 />
    </Suspense>
  );
}
