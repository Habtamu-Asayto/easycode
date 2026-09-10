import { Suspense } from "react";

import LoginForm from "./LoginForm";
import LoginForm2 from "./LoginForm2";
import LoginForm3 from "./LoginForm3";  
import LoginForm4 from "./LoginForm4"; 

function LoginLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="size-4 animate-spin rounded-full border-2 border-muted border-t-primary" />
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
