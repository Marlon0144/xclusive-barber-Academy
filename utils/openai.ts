import OpenAI from 'openai'

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

export async function generateAIFeedback(cutType: string, scores: Scores) {
  try {
    // 1. Construimos un prompt eficiente para ahorrar tokens (dinero)
    // Le decimos que actúe como un instructor experto pero conciso.
    const prompt = `
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
      4. Máximo 50 palabras. (Importante para ahorrar tokens).
      5. Responde directamente, sin saludos genéricos.
    `

    // 2. Llamada a la API (Modelo gpt-4o-mini = Calidad/Precio imbatible)
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-4o-mini",
      temperature: 0.7, // Creatividad balanceada
      max_tokens: 100,  // Límite duro para evitar costos extra
    })

    return completion.choices[0].message.content || "Sigue practicando, buen trabajo."

  } catch (error) {
    console.error("Error generando feedback IA:", error)
    return "Excelente esfuerzo. Revisa los detalles de simetría y limpieza para la próxima." // Fallback gratuito
  }
}