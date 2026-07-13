import { SignupForm } from "@/components/shared/signup-form";
import { observer } from "mobx-react-lite";
import { authStore } from "@/store/AuthStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  useEffect(() => {
    authStore.clearError();
  }, []);

  async function handleSignup(e) {
    e.preventDefault();

    const form = new FormData(e.target);

    let success = await authStore.signup({
      email: form.get("email"),
      password: form.get("password"),
      confirmPassword: form.get("confirm-password"),
    });

    if (success) {
      navigate("/login", { replace: true });
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm onSubmit={handleSignup} />

        {authStore.error && (
          <p className="mt-4 text-center text-red-500">{authStore.error}</p>
        )}

        {authStore.loading && (
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Creating your account…
          </p>
        )}
      </div>
    </div>
  );
}

export default observer(Signup);
