import OpenAI from 'openai'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { type Language } from '@/lib/i18n/config'

// Inicializamos el cliente. 
// Next.js automáticamente carga las variables de entorno en el servidor.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface Scores {
  fade: number
  cleanliness: number
  technique: number
  symmetry: number
}

function buildPrompt(language: Language, cutType: string, scores: Scores) {
  if (language === 'en') {
    return `
      You are an expert instructor at Xclusive Barber Academy.
      Evaluate the student's "${cutType}" cut based on these scores (0-10):
      - Fade: ${scores.fade}
      - Cleanliness: ${scores.cleanliness}
      - Technique: ${scores.technique}
      - Symmetry: ${scores.symmetry}

      Instructions:
      1. Be empathetic but educational. Use a professional tone.
      2. Praise the highest score.
      3. Give one specific and concise technical tip to improve the lowest score.
      4. Maximum 50 words.
      5. Answer directly, no generic greetings.
    `
  }

  return `
      Eres un instructor experto de la Xclusive Barber Academy.
      Evalúa el corte "${cutType}" de un estudiante basado en estas notas (0-10):
      - Fade (Desvanecido): ${scores.fade}
      - Limpieza: ${scores.cleanliness}
      - Técnica: ${scores.technique}
      - Simetría: ${scores.symmetry}

      Instrucciones:
      1. Sé empático pero educativo. Usa tono profesional ("Barbero a Barbero").
      2. Felicita por el puntaje más alto.
      3. Da un consejo técnico específico y breve para mejorar el puntaje más bajo.
      4. Máximo 50 palabras.
      5. Responde directamente, sin saludos genéricos.
    `
}

export async function generateAIFeedback(
  cutType: string,
  scores: Scores,
  language: Language = 'es',
) {
  const text = getDictionary(language).actions.openai

  try {
    // 1. Construimos un prompt eficiente para ahorrar tokens (dinero)
    // Le decimos que actúe como un instructor experto pero conciso.
    const prompt = buildPrompt(language, cutType, scores)

    // 2. Llamada a la API (Modelo gpt-4o-mini = Calidad/Precio imbatible)
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-4o-mini",
      temperature: 0.7, // Creatividad balanceada
      max_tokens: 100,  // Límite duro para evitar costos extra
    })

    return completion.choices[0].message.content || text.fallbackShort

  } catch (error) {
    console.error("Error generando feedback IA:", error)
    return text.fallbackDetailed
  }
}