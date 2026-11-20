import {
    initSettings,
    initForm,
    renderDashboard,
    renderBoard
} from "./ui.js"

import { respons, demoxport } from "./api.js"
import { prompte } from "./prompt.js"
import { parsePlan } from "./validation.js"
import { addProject, getProject } from "./project.js"

initSettings()

initForm(async(info) => {

    const mode = sessionStorage.getItem("aiMode") || "demo"
    let result
    if (mode === "demo") {

        result = await demoxport()

    } else {

        const apiKey = sessionStorage.getItem("apiKey")

        if (!apiKey) {
            throw new Error("API Key obligatoire")
        }

        const prompt = prompte(
            info.name,
            info.duration,
            info.tem,
            info.Technologies,
            info.level,
            info.description,
            info.brife
        )

        result = await respons(apiKey, prompt)
    }

    const plan = parsePlan(result)

    const project = {
        id: Date.now().toString(),
        name: info.name,
        description: info.description,
        duration: info.duration,
        tem: info.tem,
        Technologies: info.Technologies,
        level: info.level,
        brife: info.brife,
        tasks: plan.tasks
    }

    addProject(project)

    window.location.href = `project.html?id=${project.id}`
})

renderDashboard()

const params = new URLSearchParams(window.location.search)
const id = params.get("id")

if (id) {
    const project = getProject(id)

    renderBoard(project)
}