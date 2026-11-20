import { projects } from "./state.js"

import {
    deleteProject,
    deleteTask,
    updateTask
} from "./project.js"

import {
    progress,
    countDone,
    totalHours
} from "./utils.js"


export function openSettingsModal() {
    const modal = document.getElementById("settings-modal")

    modal.classList.remove("hidden")
    modal.classList.add("flex")
}

export function closeSettingsModal() {
    const modal = document.getElementById("settings-modal")

    modal.classList.add("hidden")
    modal.classList.remove("flex")
}

export function toggleApiKeyInput(mode) {
    const api = document.getElementById("api-key-container")

    if (mode === "real") {
        api.classList.remove("hidden")
    } else {
        api.classList.add("hidden")
    }
}


export function initSettings() {

    const openButton = document.getElementById("open-settings")
    const closeButton = document.getElementById("close-settings")
    const saveButton = document.getElementById("save-settings")
    const apiKeyInput = document.getElementById("api-key")
    const nodeInputs = document.querySelectorAll('input[name="ai-mode"]')

    if (!openButton || !closeButton || !saveButton) return

    openButton.addEventListener("click", openSettingsModal)
    closeButton.addEventListener("click", closeSettingsModal)

    const mode = sessionStorage.getItem("aiMode") || "demo"

    apiKeyInput.value = sessionStorage.getItem("apiKey") || ""

    nodeInputs.forEach(input => {

        input.checked = input.value === mode

        input.addEventListener("change", () => {
            toggleApiKeyInput(input.value)
        })
    })

    toggleApiKeyInput(mode)

    saveButton.addEventListener("click", () => {

        const selectedMode = document.querySelector(
            'input[name="ai-mode"]:checked'
        )

        sessionStorage.setItem("aiMode", selectedMode.value)

        if (selectedMode.value === "real") {
            sessionStorage.setItem("apiKey", apiKeyInput.value.trim())
        } else {
            sessionStorage.removeItem("apiKey")
        }

        closeSettingsModal()
    })
}
export function initForm(generate) {

    const form = document.getElementById("formproject")

    if (!form) return

    const name = document.getElementById("idnomep")
    const duration = document.getElementById("idduree")
    const tem = document.getElementById("idnumdev")
    const Technologies = document.getElementById("idtechnologies")
    const level = document.getElementById("selectniveau")
    const description = document.getElementById("iddescription")
    const brife = document.getElementById("idbrief")

    const bot = document.getElementById("bot")
    const message = document.getElementById("message-error")

    let loading = false

    const inputs = [
        name,
        duration,
        tem,
        Technologies,
        level,
        description,
        brife
    ]

    function validate() {

        let valid = true

        inputs.forEach(input => {

            if (input.value.trim() === "" || !input.checkValidity()) {
                valid = false
            }
        })

        if (!/^[1-9]\d*$/.test(duration.value)) {
            valid = false
        }

        if (!/^[1-9]\d*$/.test(tem.value)) {
            valid = false
        }

        bot.disabled = !valid || loading

        return valid
    }

    form.addEventListener("input", validate)
    form.addEventListener("change", validate)

    validate()

    form.addEventListener("submit", async(e) => {

        e.preventDefault()

        if (loading || !validate()) return

        loading = true
        bot.disabled = true

        message.classList.remove("hidden")
        message.textContent = "Génération du plan en cours..."
        message.className = "text-violet-600 font-bold"

        try {

            const info = {
                name: name.value,
                duration: Number(duration.value),
                tem: Number(tem.value),
                Technologies: Technologies.value,
                level: level.value,
                description: description.value,
                brife: brife.value
            }

            await generate(info)

        } catch (error) {

            message.className = "text-red-600 font-bold"
            message.textContent = error.message

        } finally {

            loading = false
            validate()
        }
    })
}
export function renderDashboard() {

    const container = document.getElementById("projectcontaner")

    if (!container) return

    const totalprojer = document.getElementById("totalprojer")
    const totaltaches = document.getElementById("totaltaches")
    const totalterminer = document.getElementById("totalterminer")
    const totalavance = document.getElementById("totalavance")
    const projectcount = document.getElementById("projectcount")
    const emptyState = document.getElementById("emptyState")

    container.innerHTML = ""

    let allTasks = []

    projects.forEach(project => {
        allTasks.push(...project.tasks)
    })

    totalprojer.textContent = projects.length
    totaltaches.textContent = allTasks.length
    totalterminer.textContent = countDone(allTasks)
    totalavance.textContent = progress(allTasks) + "%"

    projectcount.textContent = projects.length + " projets"

    if (projects.length === 0) {
        emptyState.classList.remove("hidden")
    } else {
        emptyState.classList.add("hidden")
    }

    projects.forEach(project => {

        const card = document.createElement("div")

        card.className = "bg-white border border-gray-200 rounded-xl shadow-sm p-5 space-y-4"

        card.innerHTML = `
            <h2 class="font-bold text-xl text-[#7C3AED]"></h2>

            <p class="description text-gray-500"></p>

            <div class="flex flex-wrap justify-between text-sm">
                <p>Tâches : ${project.tasks.length}</p>
                <p>Terminées : ${countDone(project.tasks)}</p>
                <p>Restantes : ${project.tasks.length - countDone(project.tasks)}</p>
            </div>

            <div class="flex justify-between">
                <p>Progression</p>
                <p>${progress(project.tasks)}%</p>
            </div>

            <div class="bg-violet-100 rounded-full h-2">
                <div class="bg-[#7C3AED] rounded-full h-2"
                    style="width: ${progress(project.tasks)}%">
                </div>
            </div>

            <div class="flex justify-between items-center">

                <a class="board bg-[#7C3AED] text-white px-4 py-2 rounded-lg">
                    Task Board
                </a>

                <button class="delete text-red-600 font-bold">
                    Supprimer
                </button>

            </div>
        `

        card.querySelector("h2").textContent = project.name

        card.querySelector(".description").textContent = project.description

        card.querySelector(".board").href =
            `project.html?id=${project.id}`

        container.appendChild(card)

        const deleteButton = card.querySelector(".delete")

        deleteButton.addEventListener("click", () => {

            if (confirm("Supprimer ce projet ?")) {

                deleteProject(project.id)

                renderDashboard()
            }
        })
    })
}
export function renderBoard(project) {

    const title = document.getElementById("project-name")

    if (!title) return

    if (!project) {
        title.textContent = "Projet introuvable"
        return
    }

    const info = document.getElementById("project-info")
    const progressText = document.getElementById("progress-text")
    const progressBar = document.getElementById("progress-bar")

    const todo = document.getElementById("todo")
    const inprogress = document.getElementById("inprogress")
    const done = document.getElementById("done")

    title.textContent = project.name

    info.textContent = `
        Durée : ${project.duration} jours |
        Équipe : ${project.tem} développeurs |
        Heures : ${totalHours(project.tasks)}h /
        ${project.duration * project.tem * 6}h
    `

    progressText.textContent = progress(project.tasks) + "%"

    progressBar.style.width = progress(project.tasks) + "%"

    todo.innerHTML = ""
    inprogress.innerHTML = ""
    done.innerHTML = ""

    project.tasks.forEach(task => {

        const card = document.createElement("div")

        card.className = "bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:border-violet-500 space-y-3"

        card.innerHTML = `
            <p class="task-id text-gray-500 text-xs"></p>
            <h3 class="font-bold"></h3>

            <div class="flex gap-2">

                <span class="priority bg-violet-100 text-violet-700 px-2 py-1 text-xs rounded"></span>

                <span class="size bg-gray-100 px-2 py-1 text-xs rounded"></span>

            </div>

            <p class="time text-gray-500 text-sm"></p>
            <p class="dependencies text-gray-500 text-xs"></p>

            <button class="text-[#7C3AED] font-bold text-sm">
                Voir les détails
            </button>
        `

        card.querySelector(".task-id").textContent = task.id
        card.querySelector("h3").textContent = task.title

        card.querySelector(".priority").textContent = task.priority
        card.querySelector(".size").textContent = task.size || ""

        card.querySelector(".time").textContent =
            `${task.estimatedTime}h | ${task.deadline}`

        card.querySelector(".dependencies").textContent =
            "Dépendances : " + (task.dependencies.join(", ") || "Aucune")

        if (task.status === "To Do") {
            todo.appendChild(card)
        }

        if (task.status === "In Progress") {
            inprogress.appendChild(card)
        }

        if (task.status === "Done") {
            done.appendChild(card)
        }

        card.addEventListener("click", () => {
            openTaskModal(project, task)
        })
    })
}


function openTaskModal(project, task) {

    const modal = document.getElementById("task-modal")

    const id = document.getElementById("task-id")
    const title = document.getElementById("task-title")
    const description = document.getElementById("task-description")
    const detail = document.getElementById("task-detail")
    const priority = document.getElementById("task-priority")
    const size = document.getElementById("task-size")
    const deadline = document.getElementById("task-deadline")
    const status = document.getElementById("task-status")
    const errorMessage = document.getElementById("task-error")

    const closeButton = document.getElementById("task-close")
    const saveButton = document.getElementById("task-save")
    const deleteButton = document.getElementById("task-delete")

    id.textContent = task.id

    title.value = task.title
    description.value = task.description
    priority.value = task.priority
    size.value = task.size || "M"
    deadline.value = task.deadline
    status.value = task.status

    detail.textContent = `
User Stories :
${task.userStories.join("\n")}

Acceptance Criteria :
${task.acceptanceCriteria.join("\n")}

Importance : ${task.importance}

Temps estimé : ${task.estimatedTime}h

Dépendances :
${task.dependencies.join(", ") || "Aucune"}
    `

    errorMessage.textContent = ""

    modal.classList.remove("hidden")
    modal.classList.add("flex")

    function closeModal() {

        modal.classList.add("hidden")
        modal.classList.remove("flex")
    }

    closeButton.onclick = closeModal

    saveButton.onclick = () => {

        try {

            if (!title.value.trim() || !description.value.trim()) {
                throw new Error("Champs obligatoires")
            }

            if (!/^Day [1-9]\d*$/.test(deadline.value)) {
                throw new Error("Deadline invalide")
            }

            if (Number(deadline.value.slice(4)) > project.duration) {
                throw new Error("Deadline supérieure à la durée du projet")
            }

            const newData = {
                title: title.value,
                description: description.value,
                priority: priority.value,
                size: size.value,
                deadline: deadline.value,
                status: status.value
            }

            updateTask(project, task.id, newData)

            closeModal()

            renderBoard(project)

        } catch (error) {

            errorMessage.textContent = error.message
        }
    }

    deleteButton.onclick = () => {

        if (confirm("Supprimer cette tâche ?")) {

            deleteTask(project, task.id)

            closeModal()

            renderBoard(project)
        }
    }
}