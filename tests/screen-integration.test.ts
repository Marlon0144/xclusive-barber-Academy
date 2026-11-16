// @ts-nocheck
/**
 * Pruebas de integración de pantalla (estáticas) — REQ-FUNC-001..010, REQ-INT-00x.
 *
 * El contenedor de pruebas NO compila la app Next.js completa (no instala
 * React/Next/Supabase), por lo que estas pruebas leen el código fuente de
 * `app/`, `components/` y `utils/` y verifican que los consumidores de UI estén
 * cableados al diccionario i18n y a las columnas `_en` (REQ-INT-003/004) según
 * la SRS. Esto da cobertura de "screen integration" sin arrancar el framework.
 *
 * Nota: @ts-nocheck desactiva el chequeo de tipos en este archivo ya que
 * usa `node:fs` sin @types/node instalado en el contenedor.
 */
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()

function read(relativePath: string): string {
  return readFileSync(join(root, relativePath), 'utf8')
}

function assertContains(file: string, needles: string[], label: string): void {
  for (const needle of needles) {
    expect(file, `${label} debe contener ${JSON.stringify(needle)}`).toContain(needle)
  }
}

describe('integración de pantallas — lección (REQ-FUNC-003, REQ-INT-003)', () => {
  const lessonPage = read('app/dashboard/courses/[courseId]/[lessonId]/page.tsx')

  it('usa diccionario del servidor y resuelve el contenido con pick()/_en', () => {
    assertContains(lessonPage, [
      "getServerDictionary",
      "getServerLanguage",
      "pick(language",
      "lessonDict.microOptional",
      "lessonDict.audiovisualUnit",
      "lessonDict.noDescription",
      "lessonDict.visualReferences",
      "lessonDict.nextLesson",
      "lessonDict.previousLesson",
      "lessonDict.endOfModule",
    ], 'lesson page')
  })

  it('el título de la lección usa el fallback es/en (REQ-REL-001)', () => {
    expect(lessonPage).toContain('lesson.title_en')
    expect(lessonPage).toContain('lesson.title')
  })

  it('los selects de navegación incluyen columnas _en', () => {
    expect(lessonPage).toContain('title_en')
  })
})

describe('integración de pantallas — sidebar y video (REQ-FUNC-003)', () => {
  it('CourseSidebar es RSC localizado y fetcha title_en', () => {
    const sidebar = read('components/courses/CourseSidebar.tsx')
    assertContains(sidebar, [
      "getServerDictionary",
      "getServerLanguage",
      "pick(",
      "title_en",
      "sidebarDict.backToCourses",
      "sidebarDict.loading",
    ], 'CourseSidebar')
  })

  it('VideoPlayer localiza sus estados con useLanguage', () => {
    const player = read('components/courses/VideoPlayer.tsx')
    assertContains(player, [
      "useLanguage",
      "videoDict.invalidUrl",
      "videoDict.unavailable",
      "videoDict.completed",
    ], 'VideoPlayer')
  })
})

describe('integración de pantallas — progreso profesional (REQ-FUNC-010)', () => {
  const progressPage = read('app/dashboard/progreso_profesional/page.tsx')

  it('conecta progress-localization y el diccionario del servidor', () => {
    assertContains(progressPage, [
      "getServerDictionary",
      "getServerLanguage",
      "progress-localization",
      "getCompetencyLabels",
      "getProfessionalLevels",
      "progressDict.ctaButton",
      "progressDict.heroSubtitle",
    ], 'progress page')
  })

  it('timeline y estados se derivan de etiquetas localizadas', () => {
    assertContains(progressPage, [
      "toTimelineLines",
      "competencyStatus",
      "progressDict.statuses",
      "requiresModules",
      "missingModules",
    ], 'progress page')
  })
})

describe('integración de pantallas — tracker (REQ-FUNC-004)', () => {
  it('la página del tracker localiza cabecera, sección y vacío', () => {
    const page = read('app/dashboard/tracker/page.tsx')
    assertContains(page, [
      "useLanguage",
      "trackerDict.headerTitle",
      "trackerDict.title",
      "trackerDict.sectionTitle",
      "trackerDict.empty",
    ], 'tracker page')
  })

  it('SubmissionForm localiza el formulario y los tipos de corte', () => {
    const form = read('app/dashboard/tracker/SubmissionForm.tsx')
    assertContains(form, [
      "useLanguage",
      "formDict.submit",
      "formDict.submitting",
      "formDict.cutTypes",
      "formDict.errorUpload",
    ], 'SubmissionForm')
  })

  it('SubmissionCard y FeedbackModal localizan estados y puntuaciones', () => {
    const card = read('app/dashboard/tracker/SubmissionCard.tsx')
    const modal = read('app/dashboard/tracker/FeedbackModal.tsx')
    assertContains(card, ["useLanguage", "cardDict.inReview", "cardDict.feedback"], 'SubmissionCard')
    assertContains(modal, ["useLanguage", "modalDict.scores", "modalDict.noFeedback"], 'FeedbackModal')
  })
})

describe('integración de pantallas — grading (REQ-FUNC-005)', () => {
  it('la página de grading usa diccionario del servidor y restringe acceso', () => {
    const page = read('app/dashboard/grading/page.tsx')
    assertContains(page, [
      "getServerDictionary",
      "gradingDict.restrictedTitle",
      "gradingDict.pageTitle",
      "gradingDict.emptyTitle",
    ], 'grading page')
  })

  it('GradingCard localiza criterios y botones', () => {
    const card = read('app/dashboard/grading/GradingCard.tsx')
    assertContains(card, [
      "useLanguage",
      "gradingDict.criteria",
      "gradingDict.save",
      "gradingDict.saving",
    ], 'GradingCard')
  })
})

describe('integración de pantallas — admin cursos (REQ-FUNC-006..008, REQ-SEC-001)', () => {
  it('las actions de cursos aplican auth+Zod y escritura de columnas _en', () => {
    const actions = read('app/dashboard/admin/courses/actions.ts')
    assertContains(actions, [
      "from 'zod'",
      "assertAdmin",
      "createAdminClient",
      "createClient",
      "title_en",
      "description_en",
    ], 'admin courses actions')
  })

  it('la página de cursos fetchea _en y localiza la cabecera', () => {
    const page = read('app/dashboard/admin/courses/page.tsx')
    assertContains(page, [
      "getServerDictionary",
      "adminDict.courseManagement",
      "title_en",
      "description_en",
    ], 'admin courses page')
  })

  it('AdminCourseList permite editar título EN y usa competencias localizadas', () => {
    const list = read('app/dashboard/admin/courses/AdminCourseList.tsx')
    assertContains(list, [
      "useLanguage",
      "adminDict.titleEnPlaceholder",
      "handleRenameModuleEn",
      "handleRenameLessonEn",
      "competencyLabels",
    ], 'AdminCourseList')
  })
})

describe('integración de pantallas — admin lecciones (REQ-FUNC-008, REQ-SEC-001)', () => {
  it('las actions de edición aplican auth+Zod y escriben title_en', () => {
    const actions = read(
      'app/dashboard/admin/lessons/[lessonId]/edit/actions.ts',
    )
    assertContains(actions, [
      "from 'zod'",
      "assertAdmin",
      "createAdminClient",
      "title_en",
    ], 'admin lesson edit actions')
  })

  it('la página de edición fetchea title_en y el form lo edita', () => {
    const page = read('app/dashboard/admin/lessons/[lessonId]/edit/page.tsx')
    const form = read('app/dashboard/admin/lessons/[lessonId]/edit/EditLessonForm.tsx')
    expect(page).toContain('title_en')
    assertContains(form, [
      "useLanguage",
      "editDict.titleEnSection",
      "editDict.saved",
      "title_en",
    ], 'EditLessonForm')
  })

  it('EditorToolbar localiza sus controles', () => {
    const toolbar = read('components/admin/EditorToolbar.tsx')
    assertContains(toolbar, [
      "useLanguage",
      "tb.youtubePrompt",
      "tb.insertImage",
    ], 'EditorToolbar')
  })
})

describe('integración de pantallas — hub y chrome (REQ-FUNC-001, REQ-FUNC-006)', () => {
  it('el hub del dashboard localiza las tarjetas', () => {
    const page = read('app/dashboard/page.tsx')
    assertContains(page, [
      "getServerDictionary",
      "hub.trainingProgram",
      "hub.progress",
    ], 'dashboard hub page')
  })

  it('DashboardCard y AdminToolsMenu localizan badges y menú', () => {
    const card = read('components/dashboard/DashboardCard.tsx')
    const menu = read('components/dashboard/AdminToolsMenu.tsx')
    assertContains(card, ["useLanguage", "adminMenu"], 'DashboardCard')
    assertContains(menu, ["useLanguage", "adminMenu"], 'AdminToolsMenu')
  })

  it('DashboardHeader y DashboardFooter son RSC localizados', () => {
    const header = read('components/dashboard/DashboardHeader.tsx')
    const footer = read('components/dashboard/DashboardFooter.tsx')
    assertContains(header, ["getServerDictionary", "dict.dashboard.header"], 'DashboardHeader')
    assertContains(footer, ["getServerDictionary", "footerDict"], 'DashboardFooter')
  })
})

describe('cache-helpers — selects con columnas _en (REQ-INT-003/004)', () => {
  it('getLessonById pide todas las columnas (incluye *_en)', () => {
    const helpers = read('utils/cache-helpers.ts')
    expect(helpers).toContain("select('*')")
  })
})
