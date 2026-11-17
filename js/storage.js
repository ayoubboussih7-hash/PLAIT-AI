
const PROJECTS_KEY = "planitProjects"



export function saveAiSetting(mode, apiKey) {
    sessionStorage.setItem("aiMode", mode)

    if (mode === "real") {
        sessionStorage.setItem("apiKey", apiKey)
    } else {
        sessionStorage.removeItem("apiKey")
    }
}

export function getAimode() {
    return sessionStorage.getItem("aiMode") || "demo"
}

export function getApiKey() {
    return sessionStorage.getItem("apiKey") || ""
}



export function getProjects() {
    const data = localStorage.getItem(PROJECTS_KEY)

    if (!data) {
        return []
    }

    try {
        const projects = JSON.parse(data)
        return Array.isArray(projects) ? projects : []
    } catch {
        return []
    }
}

export function saveProjects(projects) {
    localStorage.setItem(
        PROJECTS_KEY,
        JSON.stringify(projects)
    )
}

export function addProject(project) {
    const projects = getProjects()

    projects.push(project)

    saveProjects(projects)

    return project
}

export function getProjectById(id) {
    const projects = getProjects()

    return projects.find(project => project.id === id) || null
}

export function updateProject(updatedProject) {
    const projects = getProjects()

    const index = projects.findIndex(
        project => project.id === updatedProject.id
    )

    if (index === -1) {
        throw new Error("Projet introuvable")
    }

    projects[index] = updatedProject

    saveProjects(projects)

    return updatedProject
}

export function deleteProject(id) {
    const projects = getProjects()

    const filteredProjects = projects.filter(
        project => project.id !== id
    )

    saveProjects(filteredProjects)

    return filteredProjects.length < projects.length
}
