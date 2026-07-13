import { observer } from "mobx-react-lite";
import { authStore } from "@/store/AuthStore";
import { LoginForm } from "@/components/shared/login-form";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
      authStore.clearError();
    }, []);

  async function handleLogin(e) {
    e.preventDefault();

    const form = new FormData(e.target);

    const success = await authStore.login({
      email: form.get("email"),
      password: form.get("password"),
    });

    if (success) {
      navigate(location.state?.from?.pathname || "/", { replace: true });
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onSubmit={handleLogin} isLoading={authStore.loading} />

        {authStore.error && (
          <p className="mt-4 text-center text-red-500">{authStore.error}</p>
        )}

        {authStore.loading && (
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Logging in…
          </p>
        )}
      </div>
    </div>
  );
}

export default observer(Login);
