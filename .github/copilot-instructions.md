 - [x] Verify that the copilot-instructions.md file in the .github directory is created.
 - [x] Clarify Project Requirements.
 - [x] Scaffold the Project.
 - [x] Customize the Project.
 - [x] Install Required Extensions.
 - [x] Compile the Project.
 - [x] Create and Run Task.
 - [x] Launch the Project.
 - [x] Ensure Documentation is Complete.
 
 ## Project Context
 
 - This repository is a Hungarian-first web platform for preparing students for the digital culture final exam's Python programming section.
 - The product must support complete beginners and then branch into Kozep and Emelt learning tracks.
 - Practice content should remain original and reworded while matching the reasoning patterns of official exams.
 
 ## Current Stack
 
 - Web app: Next.js App Router with TypeScript and Tailwind CSS.
 - Local orchestration: Docker Compose.
 - Planned data layer: PostgreSQL and Redis.
 - Code evaluation boundary: separate Python FastAPI judge service.
 
 ## Implementation Rules
 
 - Keep the entire platform docker-friendly from the start.
 - Treat deterministic grading as the source of truth. Future AI feedback should only augment it.
 - Prefer Hungarian copy for user-facing pages and developer-visible seeded content unless there is a good reason to switch.
 - Preserve the separation between official archive references and platform-authored practice content.
 - Keep lesson, archive, and roadmap data structured so they can later move from TypeScript constants into content files or a database without reshaping the UI.
 
 ## Verified Commands
 
 - `npm run lint`
 - `npm run typecheck`
 - `npm run build`
 - `npm run dev`
 
 ## Near-Term Priorities
 
 1. Replace the in-memory lesson and archive data with file-backed or database-backed content.
 2. Add authentication, progress tracking, and submission persistence.
 3. Connect the submission route to stored tasks and rubrics instead of a smoke test payload.
 4. Expand the judge into a safer sandbox with richer verdicts and scoring metadata.
- Work through each checklist item systematically.
- Keep communication concise and focused.
- Follow development best practices.
