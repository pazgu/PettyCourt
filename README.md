# ⚖️ Objection! - Digital Small-Claims Court

**Objection!** is a community platform designed to resolve life's pettiest, everyday disputes using AI and community democracy. Whether it's a roommate who ate your leftovers or a friend who is always late, users can lay out the drama, and our AI Judge will deliver a formal, highly dramatic, and witty legal verdict[cite: 1]. 

The community browses the court archive, leaves comments, and votes on whether justice was truly served[cite: 1]. It’s part entertainment, part conflict resolution, and 100% morally binding[cite: 1].

---

## 🚀 Tech Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend/Database:** Supabase (PostgreSQL)[cite: 1]
- **AI Engine:** Google Gemini AI (via Supabase Edge Functions)[cite: 1]
- **Authentication:** Supabase Auth[cite: 1]

---

## 🗺️ Core User Flow

1. **File a Case:** A registered user (Plaintiff) submits a case title, selects a category, and writes both the **Complaint** and the **Defense** argument on behalf of the situation[cite: 1].
2. **AI Judgment:** Once submitted, the app triggers a secure Supabase Edge Function that sends both arguments to Gemini AI[cite: 1].
3. **The Verdict:** The AI generates a theatrical court ruling, parses the ultimate winner (`plaintiff`, `defendant`, or `split`), and updates the database[cite: 1].
4. **Community Vote:** The case goes public[cite: 1]. Registered users and guests can view the case, read the verdict, and vote "Justice Served" or "Mistrial!"[cite: 1].

---

## 📊 Database Schema (Supabase)

The database consists of the following core tables[cite: 1]:
- `profiles`: Stores authenticated user details and unique usernames[cite: 1].
- `cases`: Manages case details, categories, complaints, defenses, and status[cite: 1].
- `verdicts`: Stores the AI-generated legal reasoning and the parsed winner[cite: 1].
- `votes`: Tracks community votes (Composite PK ensures 1 vote per user per case)[cite: 1].

---

## 🔒 Environment Variables (`.env`)

⚠️ **DO NOT upload your `.env` file to GitHub.** 

Create a `.env` file in your root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
