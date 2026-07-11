// MobX state domain tracking logged-in user structures,
// session updates, and reactive permission bindings.
import { makeAutoObservable } from "mobx";


class AuthStore {
  loading = false;
  error = "";

  constructor() {
    makeAutoObservable(this);
  }

  async signup({ name, email, password, confirmPassword }) {
    this.error = "";
    this.loading = true;

    if (password !== confirmPassword) {
      this.error = "Passwords do not match";
      this.loading = false;
      return false;
    }

    // Add Supabase signup
    

 

    this.loading = false;
    return true;
  }
}

export const authStore = new AuthStore();
