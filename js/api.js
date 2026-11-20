export async function respons(inputvalue, text) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${inputvalue}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "openai/gpt-oss-20b",
            messages: [{
                role: "user",
                content: text
            }]
        })
    })

    if (!res.ok) {
        throw new Error(`Error API : ${res.status}`)
    }

    const data = await res.json()

    return data.choices[0].message.content
}

export async function demoxport() {
    const res = await fetch("./data/sample-plan.json")

    if (!res.ok) {
        throw new Error("Impossible de charger le plan demo")
    }

    return await res.json()
}