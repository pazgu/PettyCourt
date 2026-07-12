import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export default function Navbar(isLoggedIn) {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b bg-background">
      <Link to="/">
        <div className="font-semibold">Objection</div>
      </Link>
      <nav className="flex gap-2">
        <Link to="/signup">
          <Button variant="ghost">Signup</Button>
        </Link>
        <Link to="/login">
          <Button variant="default">Login</Button>
        </Link>
      </nav>
    </header>
  );
}
