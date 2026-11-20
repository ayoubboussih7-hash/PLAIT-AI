export function parsePlan(result) {
    if (typeof result === "string") {

        result = result.replace(/```json/g, "")
        result = result.replace(/```/g, "")
        result = JSON.parse(result)
    }

    if (!result || !Array.isArray(result.tasks)) {
        throw new Error("Plan invalide")
    }

    if (result.tasks.length === 0) {
        throw new Error("Aucune tache trouvee")
    }

    result.tasks.forEach(task => {
        if (!task.id || !task.title || !task.description) {
            throw new Error("Tache invalide")
        }

        if (!["To Do", "In Progress", "Done"].includes(task.status)) {
            throw new Error("Status invalide")
        }

        if (!Array.isArray(task.dependencies)) {
            throw new Error("Dependances invalides")
        }

        if (!Array.isArray(task.userStories) ||
            !Array.isArray(task.acceptanceCriteria)) {
            throw new Error("Structure invalide")
        }
    })

    return result
}