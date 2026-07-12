import { SignupForm } from "@/components/shared/signup-form";
import { observer } from "mobx-react-lite";
import { authStore } from "@/store/AuthStore";


function Signup() {
  async function handleSignup(e) {
    e.preventDefault();

    const form = new FormData(e.target);

    const success = await authStore.signup({
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
      confirmPassword: form.get("confirm-password"),
    });

    if (success) {
      window.location.href = "/login";
    }
  }
  
    return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm onSubmit={handleSignup} />

        {authStore.error && (
          <p className="mt-4 text-center text-red-500">
            {authStore.error}
          </p>
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
