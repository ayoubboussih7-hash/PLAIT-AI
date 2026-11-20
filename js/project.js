import { projects, save } from "./state.js"

export function addProject(project) {
    projects.push(project)
    save()
}

export function getProject(id) {
    return projects.find(project => project.id === id)
}

export function deleteProject(id) {
    const index = projects.findIndex(project => project.id === id)

    if (index !== -1) {
        projects.splice(index, 1)
        save()
    }
}

export function updateTask(project, taskID, newDate) {
    const task = project.tasks.find(t => t.id === taskID)

    if (!task) return

    if (newDate.status === "Done") {
        const blocked = task.dependencies.some(id => {
            const dependency = project.tasks.find(t => t.id === id)

            return !dependency || dependency.status !== "Done"
        })

        if (blocked) {
            throw new Error("Terminez les dependances avant cette tache")
        }
    }

    if (task.status === "Done" && newDate.status !== "Done") {
        const used = project.tasks.some(t => {
            return t.status === "Done" && t.dependencies.includes(taskID)
        })

        if (used) {
            throw new Error("Une tache terminee depend de cette tache")
        }
    }

    Object.assign(task, newDate)
    save()
}

export function deleteTask(project, taskId) {
    project.tasks = project.tasks.filter(task => task.id !== taskId)

    project.tasks.forEach(task => {
        task.dependencies = task.dependencies.filter(id => id !== taskId)
    })

    save()
}