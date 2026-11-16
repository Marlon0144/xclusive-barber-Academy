# Graph Report - xclusive-barber-Academy  (2026-11-16)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 628 nodes · 1535 edges · 24 communities (18 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e75cc4fe`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23

## God Nodes (most connected - your core abstractions)
1. `next` - 71 edges
2. `createClient()` - 53 edges
3. `getServerDictionary` - 52 edges
4. `react` - 39 edges
5. `cn()` - 33 edges
6. `createAdminClient()` - 27 edges
7. `DashboardFooter()` - 26 edges
8. `useLanguage()` - 22 edges
9. `DashboardPageHeader()` - 18 edges
10. `getServerLanguage` - 18 edges

## Surprising Connections (you probably didn't know these)
- `PhoneLeadCaptureForm()` --indirect_call--> `capturePhoneLead()`  [INFERRED]
  components/landing/PhoneLeadCaptureForm.tsx → app/landing/actions.ts
- `FeedbackModalProps` --references--> `Submission`  [EXTRACTED]
  app/dashboard/tracker/FeedbackModal.tsx → types/submissions.ts
- `SubmissionCardProps` --references--> `Submission`  [EXTRACTED]
  app/dashboard/tracker/SubmissionCard.tsx → types/submissions.ts
- `LessonPage()` --calls--> `VideoPlayer()`  [EXTRACTED]
  app/dashboard/courses/[courseId]/[lessonId]/page.tsx → components/courses/VideoPlayer.tsx
- `LessonPage()` --calls--> `DashboardFooter()`  [EXTRACTED]
  app/dashboard/courses/[courseId]/[lessonId]/page.tsx → components/dashboard/DashboardFooter.tsx

## Import Cycles
- None detected.

## Communities (24 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (51): signout(), LessonNavItem, LessonPage(), LessonPageProps, CoursesIndexPage(), DashboardPage(), fetchProgressPageData(), ACTIVE_OFFSETS (+43 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (56): applyAccess(), ApplyState, buildApplySchema(), qualifySchema, QualifyState, submitLeadQualification(), AnswerKey, Answers (+48 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (36): CourseDetailPage(), generateMetadata(), getPlan(), PageProps, toTitleCase(), CoursesIndexPage(), metadata, Grades (+28 more)

### Community 3 - "Community 3"
Cohesion: 0.10
Nodes (34): ApplyForm(), initialState, SubmitButton(), ApplyPage(), metadata, QualifyPage(), LoginPage(), metadata (+26 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (34): ActionLockContext, ActionLockContextValue, ActionLockProvider(), LockedActionForm(), LockedActionFormProps, useActionLock(), assertAdmin(), createInviteCodeAction() (+26 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (38): EditorToolbar(), EditorToolbarProps, RichTextEditor(), RichTextEditorProps, LessonContentProps, eslintConfig, name, private (+30 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (29): ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES, buildSubmissionSchema(), CUT_TYPES_ALLOWED, deleteSubmission(), uploadSubmission(), FeedbackModal(), FeedbackModalProps (+21 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (24): broadcast(), clients, computeAcceptKey(), crypto, debounceTimers, decodeFrame(), encodeFrame(), frameTemplate (+16 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (24): ActionState, createLesson(), createModule(), deleteLesson(), deleteModule(), reorderLessonsInModule(), supabaseAdmin, updateLessonTitle() (+16 more)

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (20): metadata, poppins, RootLayout(), GoogleAnalyticsScript(), GoogleTagManagerNoScript(), GoogleTagManagerScript(), MetaPixelNoScript(), MetaPixelScript() (+12 more)

### Community 10 - "Community 10"
Cohesion: 0.19
Nodes (16): setLanguagePreference(), FloatingLanguageSwitcher(), LanguageSwitcher(), DEFAULT_LANGUAGE, isSupportedLanguage(), LANGUAGE_COOKIE_MAX_AGE, LANGUAGE_COOKIE_NAME, resolveLanguageFromAcceptLanguage() (+8 more)

### Community 11 - "Community 11"
Cohesion: 0.09
Nodes (22): dependencies, class-variance-authority, clsx, isomorphic-dompurify, jsdom, lucide-react, next, openai (+14 more)

### Community 12 - "Community 12"
Cohesion: 0.13
Nodes (19): assertAdmin(), deleteLeadAction(), statusSchema, updateLeadReviewAction(), AdminLeadsPage(), formatAnswerValue(), formatDate(), LeadAnswer (+11 more)

### Community 13 - "Community 13"
Cohesion: 0.15
Nodes (16): QualifyState, dynamic, metadata, PublicQualifyPage(), AnswerKey, Answers, buildSteps(), INITIAL_ANSWERS (+8 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 15 - "Community 15"
Cohesion: 0.25
Nodes (10): DashboardLayout(), metadata, ApplicationSuccessTracker(), clearCookie(), readCookie(), TrackedLinkProps, AnalyticsEventName, AnalyticsEventParams (+2 more)

### Community 16 - "Community 16"
Cohesion: 0.23
Nodes (10): ActionState, updateLessonContent(), Edit2IconDecorator(), EditLessonForm(), LessonData, RichTextEditor, EditLessonPage(), PageProps (+2 more)

### Community 17 - "Community 17"
Cohesion: 0.14
Nodes (14): devDependencies, autoprefixer, eslint, eslint-config-next, postcss, tailwindcss, @tailwindcss/postcss, @tailwindcss/typography (+6 more)

## Knowledge Gaps
- **15 isolated node(s):** `autoprefixer`, `jsdom`, `postcss`, `tailwindcss`, `@tailwindcss/postcss` (+10 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 247 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Community 2` to `Community 0`, `Community 1`, `Community 3`, `Community 4`, `Community 5`, `Community 6`, `Community 8`, `Community 9`, `Community 10`, `Community 12`, `Community 13`, `Community 15`, `Community 16`?**
  _High betweenness centrality (0.323) - this node is a cross-community bridge._
- **What connects `autoprefixer`, `jsdom`, `postcss` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.061569416498993966 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 5`, `Community 6`, `Community 8`, `Community 9`, `Community 10`, `Community 13`, `Community 15`, `Community 16`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05110809588421529 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `Community 11` to `Community 5`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.09000584453535944 - nodes in this community are weakly interconnected._