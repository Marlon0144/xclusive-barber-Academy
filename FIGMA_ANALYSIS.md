# Analysis of Figma Node 136-377

## 1. Mobile vs Desktop Confirmation
Based on the user's observation that the Figma node has a width of ~400px, it is confirmed to be a **Mobile View**.
Since no explicit Desktop view node was provided or found in the immediate context for this specific dashboard section, the strategy is to **adapt this mobile design to desktop** using a responsive grid system, which is already partially implemented in `app/dashboard/page.tsx` using `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.

## 2. Content Mapping Strategy

We will map the Figma text sections to the existing logical routes in the application.

| Figma Text (Mobile Design) | Existing Application Logic | Route | Description |
| :--- | :--- | :--- | :--- |
| **PROGRAMA DE FORMACIÓN** | **Aprender** (Courses) | `/dashboard/courses` | The core content. Access to modules and lessons. |
| **SEGUIMIENTO Y EVALUACIÓN** | **Practicar** (Tracker) | `/dashboard/tracker` | Where students upload work for feedback ("Evaluación" of their work). |
| **PROGRESO PROFESIONAL** | *New / Modified* | `/dashboard/progress` (Future) or stays in Tracker | Likely a stats view. For now, it maps best to the **Tracker** stats or could be a rename of "Practicar" if "Seguimiento" covers uploads. **Recommendation:** Merge into Tracker context or rename "Practicar" to "Progreso". |
| **LA ACADEMIA** | *New Section* | `/dashboard/academy` or Community | Info about the school, community, or settings. If not implemented, we can keep it as a placeholder or map to "Settings" / "Profile". |

**Refined Mapping for Implementation:**

1.  **PROGRAMA DE FORMACIÓN** → replaces **"Aprender"** label.
2.  **SEGUIMIENTO Y EVALUACIÓN** → replaces **"Practicar"** label. (Reasoning: Tracker is where evaluation happens).
3.  **PROGRESO PROFESIONAL** → Could be the **Grading** section for Admins, OR a personal progress view for Students. **Assumption:** If this is a student view, this might be their profile/stats.
4.  **LA ACADEMIA** → Generic info/Home.

## 3. Recommended Action Plan

1.  **Update Dashboard Labels**: Rename the cards in `app/dashboard/page.tsx` to match Figma's "Premium" nomenclature.
    *   "Aprender" -> "Programa de Formación"
    *   "Practicar" -> "Seguimiento y Evaluación" (Or "Zona de Práctica" if "Seguimiento" implies passive tracking).
2.  **Responsive Grid**: Ensure the `grid-cols-1 md:grid-cols-2` layout handles the cards gracefully, expanding from the ~400px mobile width to full cards on desktop.
3.  **Visual Polish**: Apply the "Gold/Dark" theme strictly to these cards to match the mobile fidelity.
