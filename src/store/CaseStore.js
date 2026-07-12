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
  isLoadingCase = false;

  error = {
    title: "",
    complaint: "",
    defense: "",
    submit: "",
  };

  votesCache = {};

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

  async loadVotesForCase(caseId) {
    try {
      const { data: votes, error } = await supabase
        .from("votes")
        .select("vote, user_id")
        .eq("case_id", caseId);

      if (error) throw error;

      const currentUser = authStore.user;
      let justiceCount = 0;
      let mistrialCount = 0;
      let userVote = null;

      votes.forEach((v) => {
        if (v.vote === "justice") justiceCount++;
        if (v.vote === "mistrial") mistrialCount++;
        if (currentUser && v.user_id === currentUser.id) {
          userVote = v.vote;
        }
      });

      runInAction(() => {
        this.votesCache[caseId] = {
          justice: justiceCount,
          mistrial: mistrialCount,
          userVote: userVote,
        };
      });
    } catch (err) {
      console.error("Error loading votes:", err);
    }
  }

  async vote(caseId, type) {
    const currentUser = authStore.user;
    if (!currentUser) {
      alert("You must be logged in to cast a vote!");
      return;
    }

    const current = this.votesCache[caseId] || {
      justice: 0,
      mistrial: 0,
      userVote: null,
    };

    try {
      if (current.userVote === type) {
        const { error } = await supabase
          .from("votes")
          .delete()
          .eq("case_id", caseId)
          .eq("user_id", currentUser.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("votes").upsert(
          {
            case_id: caseId,
            user_id: currentUser.id,
            vote: type,
          },
          { onConflict: "case_id,user_id" },
        );

        if (error) throw error;
      }

      await this.loadVotesForCase(caseId);
    } catch (err) {
      console.error("Failed to process vote:", err);
    }
  }
}

export const caseStore = new CaseStore();
