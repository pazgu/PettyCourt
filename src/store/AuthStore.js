import { makeAutoObservable, runInAction } from "mobx";
import { supabase } from "@/utils/supabase";

class AuthStore {
  loading = false;
  error = "";
  user = null;
  session = null;
  initializing = true;

  constructor() {
    makeAutoObservable(this);
  }

  async signup({ email, password, confirmPassword }) {
    runInAction(() => {
      this.error = "";
      this.loading = true;
    });

    if (password.length < 6) {
      runInAction(() => {
        this.error = "Password must be at least 6 characters long";
        this.loading = false;
      });
      return false;
    }

    if (password !== confirmPassword) {
      runInAction(() => {
        this.error = "Passwords do not match";
        this.loading = false;
      });

      return false;
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (!data.user) {
        runInAction(() => {
          if (error.message == {}) error.message = "";
          this.error = error?.message || "Signup failed";
          this.loading = false;
        });
        return false;
      }

       runInAction(() => {
        this.loading = false;
      });

      return true;
    } catch (err) {
      runInAction(() => {
        this.error = "An unexpected error occurred. Please try again.";
        this.loading = false;
      });
    }
  }

  async login({ email, password }) {
    runInAction(() => {
      this.error = "";
      this.loading = true;
    });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        runInAction(() => {
          this.error = error.message;
          this.loading = false;
        });
        return false;
      }

      runInAction(() => {
        this.user = data.user;
        this.session = data.session;
        this.loading = false;
      });

      return true;
    } catch (err) {
      runInAction(() => {
        this.error = "An unexpected error occurred. Please try again.";
        this.loading = false;
      });
    }
  }

  async loadUser() {
    try {
      const { data } = await supabase.auth.getUser();

      runInAction(() => {
        this.user = data.user;
      });
    } catch (err) {
      console.error("An unexpected error occurred. Please try again.", err);
    } finally {
      runInAction(() => {
        this.initializing = false;
      });
    }
  }

  async logout() {
    try {
      await supabase.auth.signOut();
      runInAction(() => {
        this.user = null;
        this.session = null;
      });
    } catch (err) {
      console.error("An unexpected error occurred while logging out.", err);
    }
  }

  clearError() {
    runInAction(() => {
      this.error = "";
    });
  }
}

export const authStore = new AuthStore();
