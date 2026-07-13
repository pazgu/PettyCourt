// custom hook to handle all toasts together
// Single import surface for toasts so the underlying library stays swappable
// from one place. Components import { toast } from "@/hooks/useToast".
export { toast } from "sonner";
