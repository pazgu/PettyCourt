import { makeAutoObservable } from "mobx";
import { supabase } from "@/utils/supabase";

class AuthStore {
  loading = false;
  error = "";
  user = null;
  session = null;

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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      this.error = error;
      this.loading = false;
      return false;
    }

    await supabase.from("profiles").insert({
      id: data.user.id,
      username: name,
      email,
    });

    this.loading = false;
    return true;
  }

  async login({ email, password }) {
    this.error = "";
    this.loading = true;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      this.error = error.message;
      this.loading = false;
      return false;
    }
    this.user = data.user;
    this.session = data.session;
    this.loading = false;
    return true;
  }

  async loadUser() {
    const { data } = await supabase.auth.getUser();
    this.user = data.user;
  }

  async logout() {
    await supabase.auth.signOut();
    this.user = null;
    this.session = null;
  }
}

export const authStore = new AuthStore();
