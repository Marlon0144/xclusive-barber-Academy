import { describe, expect, it } from 'vitest'
import { dictionaries, getDictionary } from '@/lib/i18n/dictionaries'

type UnknownRecord = Record<string, unknown>

function shapeOf(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(shapeOf)
  }
  if (value !== null && typeof value === 'object') {
    const keyed = value as UnknownRecord
    return Object.fromEntries(
      Object.keys(keyed).map((k) => [k, shapeOf(keyed[k])]),
    )
  }
  return typeof value
}

function expectFlatKeysMatch(es: unknown, en: unknown, path: string): void {
  const sEs = shapeOf(es)
  const sEn = shapeOf(en)

  if (sEs !== null && typeof sEs === 'object' && sEn !== null && typeof sEn === 'object') {
    const keysEs = Object.keys(sEs as UnknownRecord).sort()
    const keysEn = Object.keys(sEn as UnknownRecord).sort()
    expect(keysEs, `claves es/en difieren en ${path}`).toEqual(keysEn)
    for (const k of keysEs) {
      expectFlatKeysMatch(
        (sEs as UnknownRecord)[k],
        (sEn as UnknownRecord)[k],
        `${path}.${k}`,
      )
    }
  } else {
    expect(sEs, `tipo difiere en ${path}`).toBe(sEn)
  }
}

describe('diccionario — paridad es/en y contrato (REQ-INT-001)', () => {
  it('las ramas es y en tienen exactamente la misma forma (sin drift de claves)', () => {
    expectFlatKeysMatch(dictionaries.es, dictionaries.en, '<root>')
  })

  it('el hub del dashboard declara las 4 tarjetas + adminPanel (REQ-FUNC-001)', () => {
    const hub = getDictionary('es').dashboard.hub
    expect(Object.keys(hub)).toEqual([
      'trainingProgram',
      'tracking',
      'progress',
      'academy',
      'adminPanel',
    ])
  })

  it('coursesList expone las cadenas de REQ-FUNC-002', () => {
    const cl = getDictionary('es').dashboard.coursesList
    for (const key of [
      'heading',
      'subtitle',
      'module',
      'status',
      'inProgress',
      'locked',
      'empty',
      'cta',
    ]) {
      expect(typeof cl[key as keyof typeof cl]).toBe('string')
    }
    expect(getDictionary('es').dashboard.coursesList.module).toContain('{{n}}')
  })

  it('lesson expone las cadenas de REQ-FUNC-003', () => {
    const lesson = getDictionary('en').dashboard.lesson
    for (const key of [
      'lessons',
      'microOptional',
      'audiovisualUnit',
      'noDescription',
      'visualReferences',
      'nextLesson',
      'previousLesson',
      'endOfModule',
      'back',
    ]) {
      const value = lesson[key as keyof typeof lesson]
      expect(typeof value).toBe('string')
      expect((value as string).length).toBeGreaterThan(0)
    }
  })

  it('progress localiza estados, nextLevel, requires, remaining (REQ-FUNC-010)', () => {
    const p = getDictionary('en').dashboard.progress
    expect(p.statuses.completed).toBe('Completed')
    expect(p.statuses.notStarted).toBe('Not Started')
    expect(p.nextLevel).toBeTruthy()
    expect(p.requires).toBeTruthy()
    expect(p.remaining).toBeTruthy()
  })

  it('getDictionary devuelve una forma única y estable para es y en', () => {
    const es = getDictionary('es')
    const en = getDictionary('en')
    expect(es.dashboard.competencyLabels.atencion_cliente).toBe('Atención al Cliente')
    expect(en.dashboard.competencyLabels.atencion_cliente).toBe('Customer Service')
    // Los porcentajes no residen en el diccionario (REQ-FUNC-010): la UI usa progress-localization.
  })

  it('admite iteración con valores como string', () => {
    const d = getDictionary('es')
    expect(typeof d.dashboard.professionalLevels.profesional.label).toBe('string')
    expect(typeof d.languageSwitcher.saving).toBe('string')
  })

  it('lesson incluye sub-secciones sidebar y video (REQ-FUNC-003)', () => {
    const lesson = getDictionary('es').dashboard.lesson
    expect(lesson.sidebar.backToCourses).toBeTruthy()
    expect(lesson.sidebar.yourProgress).toBeTruthy()
    expect(lesson.video.invalidUrl).toBeTruthy()
    expect(lesson.video.completed).toContain('✓')
  })

  it('tracker expone form/card/feedbackModal (REQ-FUNC-004)', () => {
    const t = getDictionary('es').dashboard.tracker
    expect(t.headerTitle).toBeTruthy()
    expect(t.form.title).toBeTruthy()
    expect(t.form.cutTypes).toHaveProperty('lowFade')
    expect(t.card.practice).toContain('{{n}}')
    expect(t.feedbackModal.scores).toBeTruthy()
  })

  it('grading expone criterios y estados (REQ-FUNC-005)', () => {
    const g = getDictionary('es').dashboard.grading
    expect(g.restrictedTitle).toBeTruthy()
    expect(g.criteria.fade).toBeTruthy()
    expect(g.saving).toBeTruthy()
  })

  it('admin expone CRUD localizado y prompts _en (REQ-FUNC-006..008)', () => {
    const a = getDictionary('es').dashboard.admin
    expect(a.createModule).toBeTruthy()
    expect(a.titleEnPlaceholder).toBeTruthy()
    expect(a.prompts.newModuleEn).toContain('inglés')
    expect(a.editLesson.titleEnSection).toBeTruthy()
    expect(getDictionary('en').dashboard.admin.editLesson.titleEnSection).toBeTruthy()
  })

  it('progress localiza heroTitle y cta (REQ-FUNC-010)', () => {
    const p = getDictionary('es').dashboard.progress
    expect(p.heroTitle).toContain('\n')
    expect(p.ctaButton).toBeTruthy()
    expect(p.photoAlt).toBeTruthy()
  })
})
