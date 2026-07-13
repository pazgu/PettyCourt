import { observer } from "mobx-react-lite";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Gavel, BriefcaseBusiness } from "lucide-react";
import { authStore } from "@/store/AuthStore";
import { toast } from "@/hooks/useToast";

export default observer(function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!authStore.user;

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b bg-background">
      <Link to="/">
        <div className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white">
            <Gavel className="h-5 w-5" />
          </span>
          Objection
        </div>
      </Link>

      <nav className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Link to="/my-cases" className="flex items-center gap-1.5">
              <BriefcaseBusiness className="h-4 w-4" />
              My Cases
            </Link>

            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={async () => {
                const success = await authStore.logout();
                if (success) {
                  navigate("/login");
                } else {
                  toast.error("Couldn't log out. Please try again.");
                }
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/signup">
              <Button variant="ghost">Signup</Button>
            </Link>
            <Link to="/login">
              <Button variant="default">Login</Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
});
