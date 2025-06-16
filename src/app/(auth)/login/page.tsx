import { Suspense } from "react";
import LoginForm from "./LoginForm";
import { Loader2 } from "lucide-react";

export default function SignInPage() {
  return (
    <Suspense fallback={
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
    }>
      <LoginForm mode="signin" />
    </Suspense>
  );
}
