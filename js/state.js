import { loadProjects, saveProjects } from "./storage.js"

export const projects = loadProjects()

export function save() {
    saveProjects(projects)
}