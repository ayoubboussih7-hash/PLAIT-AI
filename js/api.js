
export async function loadDemoPlan() {
    const response = await fetch("./data/sample-plan.json")

    if (!response.ok) {
        throw new Error("Erreur lors du chargement du plan demo")
    }

    const data = await response.json()
    return data
}

export async function generatGeminiplan(prompt, apiKey) {
    const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        }
    )

    if (!response.ok) {
        throw new Error(`Erreur Gemini API : ${response.status}`)
    }

    const data = await response.json()

    const text = data.candidates?.[0]?.content?.parts
        ?.filter(part => typeof part.text === "string")
        .map(part => part.text)
        .join("")

    if (!text) {
    throw new Error("Gemini n'a pas retourné de plan")
     }

     const cleanedText = text
       .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")

try {
    return JSON.parse(cleanedText)
} catch {
    throw new Error("Le plan généré contient un JSON invalide")
}
}