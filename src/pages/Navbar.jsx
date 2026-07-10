import { Button } from "../components/ui/button";

export default function Navbar(isLoggedIn) {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b bg-background">
      <div className="font-semibold">Objection</div>
      <nav className="flex gap-2">
        <Button variant="ghost">Signup</Button>
        <Button variant="default">Login</Button>
      </nav>
    </header>
  );
}
