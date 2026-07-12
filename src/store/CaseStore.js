// MobX state domain orchestrating fetched case catalogs, active filters,
// case insertions, and synchronous rating mutations.

import { makeAutoObservable, runInAction } from "mobx";
import { supabase } from "@/utils/supabase";
import { authStore } from "./AuthStore";

class CaseStore {
  title = "";
  category = "";
  complaint = "";
  defense = "";

  isSubmitting = false;

  currentCase = null;
  myCases = null;
  isLoadingCase = false;

  error = {
    title: "",
    complaint: "",
    defense: "",
    submit: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setField(field, value) {
    this[field] = value;
    if (this.error && this.error[field]) {
      this.error[field] = "";
    }
  }

  resetForm() {
    this.title = "";
    this.category = "";
    this.complaint = "";
    this.defense = "";
    this.error = {
      title: "",
      complaint: "",
      defense: "",
      submit: "",
    };
    this.isSubmitting = false;
  }

  async submitCase() {
    this.error = { title: "", complaint: "", defense: "", submit: "" };
    let hasErrors = false;

    if (!this.title) {
      this.error.title = "Please fill out the title.";
      return false;
    }

    if (!this.complaint) {
      this.error.complaint = "Please fill out the compaint";
      return false;
    }

    if (!this.defense) {
      this.error.defense = "Please fill out the defense";
      return false;
    }

    if (hasErrors) {
      return false;
    }

    this.isSubmitting = true;

    try {
      const currentUser = authStore.user;

      if (!currentUser) {
        throw new Error("You must be logged in to file a new case.");
      }

      const caseData = {
        title: this.title,
        category: this.category || "General",
        complaint: this.complaint,
        defense: this.defense,
        plaintiff_id: currentUser.id,
        status: "awaiting_verdict",
      };

      console.log("Sending case to server...", caseData);

      const { data, error: insertError } = await supabase
        .from("cases")
        .insert([caseData])
        .select();

      if (insertError) {
        throw insertError;
      }

      console.log("Case successfully created!", data);

      runInAction(() => {
        this.resetForm();
      });

      return true;
    } catch (err) {
      console.error("Failed to submit case:", err);

      runInAction(() => {
        this.error = this.error || {
          title: "",
          complaint: "",
          defense: "",
          submit: "",
        };
        this.error.submit =
          err.message || "Something went wrong. Please try again.";
      });
      return false;
    } finally {
      runInAction(() => {
        this.isSubmitting = false;
      });
    }
  }

  async loadCaseById(caseId) {
    this.isLoadingCase = true;
    this.currentCase = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("cases")
        .select("*")
        .eq("id", caseId)
        .single();

      if (fetchError) throw fetchError;

      runInAction(() => {
        this.currentCase = data;
      });
    } catch (err) {
      console.error("Error fetching case details from Supabase:", err);
      runInAction(() => {
        this.currentCase = null;
      });
    } finally {
      runInAction(() => {
        this.isLoadingCase = false;
      });
    }
  }

  async loadMyCases() {
    this.isLoadingCase = true;
    this.myCases = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("cases")
        .select("*");

      if (fetchError) throw fetchError;

      runInAction(() => {
        this.myCases = data;
      });
    } catch (err) {
      console.error("Error fetching case details from Supabase:", err);
      runInAction(() => {
        this.myCases = null;
      });
    } finally {
      runInAction(() => {
        this.isLoadingCase = false;
      });
    }
  }
}

export const caseStore = new CaseStore();
