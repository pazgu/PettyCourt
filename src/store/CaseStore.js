// MobX state domain orchestrating fetched case catalogs, active filters,
// case insertions, and synchronous rating mutations.

import { makeAutoObservable } from "mobx";

class CaseStore {
  title = "";
  category = "";
  complaint = "";
  defense = "";

  isSubmitting = false;
  error = {};

  constructor() {
    makeAutoObservable(this);
  }

  setField(field, value) {
    this[field] = value;
  }

  resetForm() {
    this.title = "";
    this.category = "";
    this.complaint = "";
    this.defense = "";
    this.error = {};
    this.isSubmitting = false;
  }

  async submitCase() {
    this.error = {};
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
    this.error = null;

    try {
      const caseData = {
        title: this.title,
        category: this.category,
        complaint: this.complaint,
        defense: this.defense,
      };

      console.log("Sending case to server...", caseData);

      // to be replaced with axios.post('/api/cases', caseData)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      console.log("Case successfully created!");
      this.resetForm();
      return true;
    } catch (err) {
      console.error("Failed to submit case:", err);
      this.error.submit = "Something went wrong. Please try again.";
      return false;
    } finally {
      this.isSubmitting = false;
    }
  }
}

export const caseStore = new CaseStore();
