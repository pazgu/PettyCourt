import { observer } from "mobx-react-lite";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { authStore } from "@/store/AuthStore";

export default observer(function Navbar({ isLoggedIn }) {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b bg-background">
      <Link to="/">
        <div className="font-semibold">Objection</div>
      </Link>

      <nav className="flex items-center gap-2">
        {isLoggedIn ? (
          <>
            <Link to="/my-cases">
              <div>My Cases</div>
            </Link>
            <Link to="#">
              <Button variant="ghost">
                <User className="h-4 w-4" />
              </Button>
            </Link>

            <Button variant="default" onClick={() => authStore.logout()}>
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
