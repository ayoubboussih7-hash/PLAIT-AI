
export function openSettingsModal() {
    const modal = document.getElementById("settings-modal")
    if (!modal) return

    modal.classList.remove("hidden")
    modal.classList.add("flex")
}

export function closeSettingsModal() {
    const modal = document.getElementById("settings-modal")
    if (!modal) return

    modal.classList.add("hidden")
    modal.classList.remove("flex")
}

export function toggleApiKeyInput(mode) {
    const container = document.getElementById("api-key-container")
    if (!container) return

    container.classList.toggle("hidden", mode !== "real")
}

export function getAisettingsForm() {
    const selected = document.querySelector(
        'input[name="ai-mode"]:checked'
    )

    return {
        mode: selected?.value || "demo",
        apiKey: document.getElementById("api-key")?.value.trim() || ""
    }
}

export function resetoreAisettings(mode, apiKey) {
    const radio = document.querySelector(
        `input[name="ai-mode"][value="${mode}"]`
    )

    if (radio) radio.checked = true

    const input = document.getElementById("api-key")
    if (input) input.value = apiKey

    toggleApiKeyInput(mode)
}

export function initSettingsevent(onSave) {
    document.getElementById("open-settings")
        ?.addEventListener("click", openSettingsModal)

    document.getElementById("close-settings")
        ?.addEventListener("click", closeSettingsModal)

    document.querySelectorAll('input[name="ai-mode"]')
        .forEach(input => {
            input.addEventListener("change", () => {
                toggleApiKeyInput(input.value)
            })
        })

    document.getElementById("save-settings")
        ?.addEventListener("click", () => {
            const settings = getAisettingsForm()

            if (settings.mode === "real" && !settings.apiKey) {
                alert("Veuillez saisir votre clé API Gemini")
                return
            }

            onSave(settings.mode, settings.apiKey)
            closeSettingsModal()
        })
}

export function getProjectFormData() {
    return {
        name: document.getElementById("idnomep").value.trim(),
        description: document.getElementById("iddescription").value.trim(),
        brief: document.getElementById("idbrief").value.trim(),
        duration: Number(document.getElementById("idduree").value),
        developers: Number(document.getElementById("idnumdev").value),
        technologies: document.getElementById("idtechnologies").value.trim(),
        difficulty: document.getElementById("selectniveau").value
    }
}

export function initProjectForm(onSubmit) {
    const form = document.getElementById("formproject")
    if (!form) return

    form.addEventListener("submit", async event => {
        event.preventDefault()

        if (!form.checkValidity()) {
            form.reportValidity()
            return
        }

        await onSubmit(getProjectFormData())
    })
}

export function setGenerationStatus(status, message) {
    const panel = document.getElementById("generationstatu")
    const button = document.getElementById("bot")

    if (panel) {
        panel.classList.remove("hidden")
        panel.textContent = message
        panel.setAttribute("role", "status")
    }

    if (button) {
        button.disabled = status === "loading"
        button.textContent = status === "loading"
            ? "Génération en cours..."
            : "Générer le plan de développement"
    }
}

export function renderDashboard(projects, onDelete) {
    const container = document.getElementById("projects-list")
    if (!container) return

    container.replaceChildren()

    if (projects.length === 0) {
        const empty = document.createElement("p")
        empty.className = "text-center text-gray-400 py-16"
        empty.textContent =
            "Aucun projet pour le moment, créez-en un pour générer votre premier plan."
        container.append(empty)
        return
    }

    projects.forEach(project => {
        const tasks = project.tasks || []
        const done = tasks.filter(task => task.status === "Done").length
        const progress = tasks.length
            ? Math.round(done / tasks.length * 100)
            : 0

        const card = document.createElement("article")
        card.className =
            "rounded-xl border border-gray-700 bg-gray-900 p-6 space-y-4"

        const title = document.createElement("h3")
        title.className = "text-xl font-bold text-white"
        title.textContent = project.name

        const description = document.createElement("p")
        description.className = "text-gray-400"
        description.textContent = project.description

        const stats = document.createElement("p")
        stats.className = "text-sm text-gray-300"
        stats.textContent =
            `${tasks.length} tâches · ${done} terminées · ${progress}%`

        const bar = document.createElement("div")
        bar.className = "h-2 rounded-full bg-gray-700 overflow-hidden"

        const fill = document.createElement("div")
        fill.className = "h-full bg-emerald-500"
        fill.style.width = `${progress}%`
        bar.append(fill)

        const link = document.createElement("a")
        link.href = `./project.html?id=${encodeURIComponent(project.id)}`
        link.className = "text-blue-400 hover:underline"
        link.textContent = "Voir le projet"

        const remove = document.createElement("button")
        remove.type = "button"
        remove.className = "text-red-400 hover:underline"
        remove.textContent = "Supprimer"
        remove.addEventListener("click", () => onDelete(project.id))

        const actions = document.createElement("div")
        actions.className = "flex justify-between"
        actions.append(link, remove)

        card.append(title, description, stats, bar, actions)
        container.append(card)
    })
}

export function renderProjectBoard(project, onStatusChange, onEdit, onDelete) {
    const summary = document.getElementById("project-summary")
    const board = document.getElementById("kanban-board")
    if (!summary || !board) return

    summary.replaceChildren()
    board.replaceChildren()

    const title = document.createElement("h1")
    title.className = "text-3xl font-bold"
    title.textContent = project.name

    const done = project.tasks.filter(t => t.status === "Done").length
    const progress = project.tasks.length
        ? Math.round(done / project.tasks.length * 100)
        : 0

    const info = document.createElement("p")
    info.className = "text-gray-400 mt-3"
    info.textContent =
        `${project.duration} jours · ${project.developers} développeur(s) · ` +
        `${project.totalEstimatedHours}h estimées · ` +
        `${project.duration * project.developers * 6}h disponibles · ` +
        `${progress}% terminé`

    summary.append(title, info)

    ;["To Do", "In Progress", "Done"].forEach(status => {
        const column = document.createElement("section")
        column.className =
            "rounded-xl bg-gray-900 border border-gray-700 p-4 space-y-4"

        const heading = document.createElement("h2")
        heading.className = "font-bold text-xl"
        heading.textContent = status

        column.append(heading)

        project.tasks
            .filter(task => task.status === status)
            .forEach(task => {
                const card = document.createElement("article")
                card.className =
                    "rounded-lg bg-gray-800 p-4 space-y-3"

                const name = document.createElement("h3")
                name.className = "font-semibold"
                name.textContent = `${task.id} — ${task.title}`

                const details = document.createElement("p")
                details.className = "text-sm text-gray-400"
                details.textContent =
                    `${task.priority} · ${task.size} · ` +
                    `${task.estimatedTime}h · ${task.deadline}`

                const select = document.createElement("select")
                select.className = "w-full bg-gray-700 p-2 rounded"

                ;["To Do", "In Progress", "Done"].forEach(value => {
                    const option = document.createElement("option")
                    option.value = value
                    option.textContent = value
                    option.selected = task.status === value
                    select.append(option)
                })

                select.addEventListener("change", () => {
                    onStatusChange(task.id, select.value)
                })

                const edit = document.createElement("button")
                edit.className = "text-blue-400 mr-4"
                edit.textContent = "Détails / Modifier"
                edit.addEventListener("click", () => onEdit(task.id))

                const remove = document.createElement("button")
                remove.className = "text-red-400"
                remove.textContent = "Supprimer"
                remove.addEventListener("click", () => onDelete(task.id))

                card.append(name, details, select, edit, remove)
                column.append(card)
            })

        board.append(column)
    })
}

export function showTaskEditor(task, onSave) {
    const existing = document.getElementById("task-editor")
    existing?.remove()

    const overlay = document.createElement("div")
    overlay.id = "task-editor"
    overlay.className =
        "fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"

    const form = document.createElement("form")
    form.className =
        "bg-gray-900 text-white rounded-xl p-6 w-full max-w-xl " +
        "max-h-[90vh] overflow-y-auto space-y-4"

    const heading = document.createElement("h2")
    heading.className = "text-xl font-bold"
    heading.textContent = `Modifier ${task.id}`

    const fields = {}

    function addField(labelText, key, value, options = null) {
        const wrapper = document.createElement("label")
        wrapper.className = "block space-y-1"

        const label = document.createElement("span")
        label.className = "block text-sm"
        label.textContent = labelText

        let input

        if (options) {
            input = document.createElement("select")
            options.forEach(optionValue => {
                const option = document.createElement("option")
                option.value = optionValue
                option.textContent = optionValue
                input.append(option)
            })
        } else if (key === "description") {
            input = document.createElement("textarea")
            input.rows = 4
        } else {
            input = document.createElement("input")
            input.type = "text"
        }

        input.className = "w-full rounded bg-gray-800 p-3"
        input.value = value
        input.required = true
        fields[key] = input

        wrapper.append(label, input)
        form.append(wrapper)
    }

    form.append(heading)

    const details = document.createElement("p")
    details.className = "text-sm text-gray-400"
    details.textContent =
        "User Stories : " + task.userStories.join(" | ") +
        "\nCritères : " + task.acceptanceCriteria.join(" | ") +
        "\nDépendances : " + (task.dependencies.join(", ") || "Aucune")
    details.style.whiteSpace = "pre-wrap"
    form.append(details)

    addField("Titre", "title", task.title)
    addField("Description", "description", task.description)
    addField("Priorité", "priority", task.priority,
        ["Low", "Medium", "High", "Critical"])
    addField("Taille", "size", task.size,
        ["XS", "S", "M", "L", "XL"])
    addField("Deadline", "deadline", task.deadline)
    addField("Statut", "status", task.status,
        ["To Do", "In Progress", "Done"])

    const save = document.createElement("button")
    save.type = "submit"
    save.className = "bg-blue-600 px-5 py-2 rounded"
    save.textContent = "Enregistrer"

    const cancel = document.createElement("button")
    cancel.type = "button"
    cancel.className = "ml-4 text-gray-300"
    cancel.textContent = "Annuler"
    cancel.addEventListener("click", () => overlay.remove())

    form.append(save, cancel)

    form.addEventListener("submit", event => {
        event.preventDefault()

        const changes = Object.fromEntries(
            Object.entries(fields).map(([key, input]) => [
                key, input.value.trim()
            ])
        )

        if (onSave(changes)) {
            overlay.remove()
        }
    })

    overlay.append(form)
    document.body.append(overlay)
}

export function showMessage(message) {
    alert(message)
}

export function askConfirmation(message) {
    return confirm(message)
}

export function navigateToProject(id) {
    window.location.href =
        `./project.html?id=${encodeURIComponent(id)}`
}

export function getCurrentProjectId() {
    return new URLSearchParams(window.location.search).get("id")
}
