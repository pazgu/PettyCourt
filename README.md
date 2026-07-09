# ⚖️ Objection! - Digital Small-Claims Court

**Objection!** is a community platform designed to resolve life's pettiest, everyday disputes using AI and community democracy. Whether it's a roommate who ate your leftovers or a friend who is always late, users can lay out the drama, and our AI Judge will deliver a formal, highly dramatic, and witty legal verdict. 

The community browses the court archive, leaves comments, and votes on whether justice was truly served. It’s part entertainment, part conflict resolution, and 100% morally binding.

---

## 🚀 Tech Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend/Database:** Supabase (PostgreSQL)
- **AI Engine:** Google Gemini AI (via Supabase Edge Functions)
- **Authentication:** Supabase Auth

---

## 🗺️ Core User Flow

1. **File a Case:** A registered user (Plaintiff) submits a case title, selects a category, and writes both the **Complaint** and the **Defense** argument on behalf of the situation.
2. **AI Judgment:** Once submitted, the app triggers a secure Supabase Edge Function that sends both arguments to Gemini AI.
3. **The Verdict:** The AI generates a theatrical court ruling, parses the ultimate winner (`plaintiff`, `defendant`, or `split`), and updates the database.
4. **Community Vote:** The case goes public. Registered users and guests can view the case, read the verdict, and vote "Justice Served" or "Mistrial!".

---

## 📊 Database Schema (Supabase)

The database consists of the following core tables:
- `profiles`: Stores authenticated user details and unique usernames.
- `cases`: Manages case details, categories, complaints, defenses, and status.
- `verdicts`: Stores the AI-generated legal reasoning and the parsed winner.
- `votes`: Tracks community votes (Composite PK ensures 1 vote per user per case).

---

## 🔒 Environment Variables (`.env`)

⚠️ **DO NOT upload your `.env` file to GitHub.** 

Create a `.env` file in your root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
