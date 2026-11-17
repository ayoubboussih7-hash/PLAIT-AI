
export function validatePlan(plan, project) {

    if (!plan || !Array.isArray(plan.tasks)) {
        throw new Error("Le plan doit contenir un tableau de tâches")
    }

    if (!project ||
        !Number.isInteger(project.duration) ||
        project.duration < 1 ||
        !Number.isInteger(project.developers) ||
        project.developers < 1) {
        throw new Error("Durée ou équipe invalide")
    }

    if (plan.tasks.length < 8 || plan.tasks.length > 40) {
        throw new Error("Le plan doit contenir entre 8 et 40 tâches")
    }

    const ids = new Set()

    plan.tasks.forEach(task => {

        if (
            !task ||
            typeof task.id !== "string" ||
            !/^TASK-\d{3,}$/.test(task.id) ||
            typeof task.title !== "string" ||
            !task.title.trim() ||
            typeof task.description !== "string" ||
            !task.description.trim() ||
            !Array.isArray(task.userStories) ||
            task.userStories.length === 0 ||
            !task.userStories.every(story =>
                typeof story === "string" && story.trim()
            ) ||
            !Array.isArray(task.acceptanceCriteria) ||
            task.acceptanceCriteria.length === 0 ||
            !task.acceptanceCriteria.every(criterion =>
                typeof criterion === "string" && criterion.trim()
            ) ||
            !["Low", "Medium", "High", "Critical"].includes(task.priority) ||
            !["Low", "Medium", "High"].includes(task.importance) ||
            !["XS", "S", "M", "L", "XL"].includes(task.size) ||
            typeof task.estimatedTime !== "number" ||
            !Number.isFinite(task.estimatedTime) ||
            task.estimatedTime <= 0 ||
            typeof task.deadline !== "string" ||
            task.status !== "To Do" ||
            !Array.isArray(task.dependencies) ||
            !task.dependencies.every(id => typeof id === "string")
        ) {
            throw new Error(
                "Tâche invalide : " + (task?.id || "inconnue")
            )
        }

        if (ids.has(task.id)) {
            throw new Error(
                "Identifiant de tâche dupliqué : " + task.id
            )
        }

        ids.add(task.id)
    })

    let totalHours = 0

    plan.tasks.forEach(task => {

        const match = /^Day ([1-9]\d*)$/.exec(task.deadline)

        if (!match || Number(match[1]) > project.duration) {
            throw new Error("Deadline invalide : " + task.id)
        }

        const hours = task.estimatedTime

        const validSize =
            (task.size === "XS" && hours <= 2) ||
            (task.size === "S" && hours >= 3 && hours <= 4) ||
            (task.size === "M" && hours >= 5 && hours <= 6) ||
            (task.size === "L" && hours >= 7 && hours <= 8) ||
            (task.size === "XL" && hours > 8)

        if (!validSize) {
            throw new Error(
                "Taille incompatible avec les heures : " + task.id
            )
        }

        totalHours += hours
    })

    const capacity = project.duration * project.developers * 6

    if (totalHours > capacity) {
        throw new Error(
            "Le plan dépasse la capacité de l'équipe"
        )
    }

    if (
        typeof plan.totalEstimatedHours !== "number" ||
        !Number.isFinite(plan.totalEstimatedHours) ||
        Math.abs(plan.totalEstimatedHours - totalHours) > 0.001
    ) {
        throw new Error(
            "Le total des heures est incorrect"
        )
    }

    const tasksById = new Map(
        plan.tasks.map(task => [task.id, task])
    )

    const visiting = new Set()
    const visited = new Set()

    function checkDependencies(taskId) {

        if (visiting.has(taskId)) {
            throw new Error(
                "Dépendances circulaires détectées"
            )
        }

        if (visited.has(taskId)) return

        visiting.add(taskId)

        const task = tasksById.get(taskId)

        task.dependencies.forEach(dependencyId => {

            const dependency = tasksById.get(dependencyId)

            if (!dependency || dependencyId === task.id) {
                throw new Error(
                    "Dépendance invalide pour " + task.id
                )
            }

            const taskDay = Number(
                task.deadline.split(" ")[1]
            )

            const dependencyDay = Number(
                dependency.deadline.split(" ")[1]
            )

            if (dependencyDay > taskDay) {
                throw new Error(
                    "Deadline incompatible avec les dépendances : " +
                    task.id
                )
            }

            checkDependencies(dependencyId)
        })

        visiting.delete(taskId)
        visited.add(taskId)
    }

    plan.tasks.forEach(task => {
        checkDependencies(task.id)
    })

    return true
}
