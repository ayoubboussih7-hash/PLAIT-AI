
import {
    initSettingsevent,
    resetoreAisettings,
    initProjectForm,
    setGenerationStatus,
    renderDashboard,
    renderProjectBoard,
    showTaskEditor,
    showMessage,
    askConfirmation,
    navigateToProject,
    getCurrentProjectId
} from "./ui.js"

import {
    saveAiSetting,
    getAimode,
    getApiKey,
    getProjects,
    addProject,
    getProjectById,
    updateProject,
    deleteProject
} from "./storage.js"

import { buildPrompt } from "./prompt.js"
import { loadDemoPlan, generatGeminiplan } from "./api.js"
import { validatePlan } from "./validation.js"

import {
    changeTaskStatus,
    editTask,
    deleteTask
} from "./project.js"

function initSettings() {
    resetoreAisettings(getAimode(), getApiKey())

    initSettingsevent((mode, apiKey) => {
        saveAiSetting(mode, apiKey)
    })
}

function validateProjectForm(project) {
    if (
        project.name.length < 5 ||
        project.description.length < 5 ||
        project.brief.length < 8 ||
        !project.technologies ||
        !["Beginner", "Intermediate", "Advanced"]
            .includes(project.difficulty) ||
        !Number.isInteger(project.duration) ||
        project.duration < 1 ||
        !Number.isInteger(project.developers) ||
        project.developers < 1
    ) {
        throw new Error("Veuillez vérifier les champs du formulaire")
    }
}

function initNewProject() {
    let generating = false

    initProjectForm(async projectData => {
        if (generating) return

        try {
            validateProjectForm(projectData)

            generating = true

            setGenerationStatus(
                "loading",
                "Génération du plan en cours..."
            )

            let plan

            if (getAimode() === "real") {
                const apiKey = getApiKey()

                if (!apiKey) {
                    throw new Error(
                        "Configurez votre clé API Gemini dans les paramètres"
                    )
                }

                const prompt = buildPrompt(projectData)
                plan = await generatGeminiplan(prompt, apiKey)
            } else {
                plan = await loadDemoPlan()
            }

            validatePlan(plan, projectData)

            const project = {
                ...projectData,
                id: crypto.randomUUID(),
                name: projectData.name,
                totalEstimatedHours: plan.totalEstimatedHours,
                tasks: plan.tasks,
                createdAt: new Date().toISOString()
            }

            addProject(project)

            setGenerationStatus(
                "success",
                "Projet généré avec succès !"
            )

            navigateToProject(project.id)

        } catch (error) {
            setGenerationStatus("error", error.message)
            showMessage(error.message)
        } finally {
            generating = false
        }
    })
}

function initDashboard() {
    function refresh() {
        renderDashboard(getProjects(), id => {
            if (!askConfirmation("Supprimer ce projet ?")) return

            deleteProject(id)
            refresh()
        })
    }

    refresh()
}

function initProjectPage() {
    const id = getCurrentProjectId()

    if (!id) {
        showMessage("Identifiant du projet manquant")
        return
    }

    function refresh() {
        const project = getProjectById(id)

        if (!project) {
            showMessage("Projet introuvable")
            return
        }

        renderProjectBoard(
            project,

            (taskId, status) => {
                try {
                    changeTaskStatus(project, taskId, status)
                    updateProject(project)
                } catch (error) {
                    showMessage(error.message)
                }

                refresh()
            },

            taskId => {
                const task = project.tasks.find(item => item.id === taskId)

                showTaskEditor(task, changes => {
                    try {
                        editTask(project, taskId, changes)
                        updateProject(project)
                        refresh()
                        return true
                    } catch (error) {
                        showMessage(error.message)
                        return false
                    }
                })
            },

            taskId => {
                if (!askConfirmation("Supprimer cette tâche ?")) return

                try {
                    deleteTask(project, taskId)
                    updateProject(project)
                    refresh()
                } catch (error) {
                    showMessage(error.message)
                }
            }
        )
    }

    refresh()
}

function initApp() {
    initSettings()

    if (document.getElementById("formproject")) {
        initNewProject()
    }

    if (document.getElementById("projects-list")) {
        initDashboard()
    }

    if (document.getElementById("kanban-board")) {
        initProjectPage()
    }
}

initApp()
