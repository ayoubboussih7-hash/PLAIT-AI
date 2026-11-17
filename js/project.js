
export function canCompleteTask(task, tasks) {
    return task.dependencies.every(id => {
        const dependency = tasks.find(item => item.id === id)
        return dependency?.status === "Done"
    })
}

export function changeTaskStatus(project, taskId, status) {
    const task = project.tasks.find(item => item.id === taskId)

    if (!task) {
        throw new Error("Tâche introuvable")
    }

    if (!["To Do", "In Progress", "Done"].includes(status)) {
        throw new Error("Statut invalide")
    }

    if (status === "Done" && !canCompleteTask(task, project.tasks)) {
        throw new Error("Terminez d'abord les dépendances")
    }

    task.status = status
    return project
}

export function editTask(project, taskId, changes) {
    const task = project.tasks.find(item => item.id === taskId)

    if (!task) {
        throw new Error("Tâche introuvable")
    }

    const allowedSizes = ["XS", "S", "M", "L", "XL"]
    const allowedPriorities = ["Low", "Medium", "High", "Critical"]

    if (!changes.title?.trim() || !changes.description?.trim()) {
        throw new Error("Titre et description obligatoires")
    }

    if (!allowedPriorities.includes(changes.priority)) {
        throw new Error("Priorité invalide")
    }

    if (!allowedSizes.includes(changes.size)) {
        throw new Error("Taille invalide")
    }

    const match = /^Day ([1-9]\d*)$/.exec(changes.deadline)

    if (!match || Number(match[1]) > project.duration) {
        throw new Error("Deadline invalide")
    }

    if (changes.status === "Done" &&
        !canCompleteTask(task, project.tasks)) {
        throw new Error("Terminez d'abord les dépendances")
    }

    const previous = { ...task }

    Object.assign(task, changes)

    const taskDay = Number(task.deadline.split(" ")[1])

    const dependenciesValid = task.dependencies.every(id => {
        const dependency = project.tasks.find(item => item.id === id)
        return dependency &&
            Number(dependency.deadline.split(" ")[1]) <= taskDay
    })

    const dependentsValid = project.tasks.every(other => {
        if (!other.dependencies.includes(task.id)) return true
        return Number(other.deadline.split(" ")[1]) >= taskDay
    })

    if (!dependenciesValid || !dependentsValid) {
        Object.assign(task, previous)
        throw new Error("Deadline incompatible avec les dépendances")
    }

    return project
}

export function deleteTask(project, taskId) {
    const exists = project.tasks.some(task => task.id === taskId)

    if (!exists) {
        throw new Error("Tâche introuvable")
    }

    project.tasks = project.tasks.filter(task => task.id !== taskId)

    project.tasks.forEach(task => {
        task.dependencies = task.dependencies.filter(id => id !== taskId)
    })

    project.totalEstimatedHours = project.tasks.reduce(
        (sum, task) => sum + task.estimatedTime, 0
    )

    return project
}
