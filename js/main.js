import { openSettingsModal, closeSettingsModal, toggleApiKeyInput } from "./ui.js";

const openButton = document.getElementById("open-settings")
const closeButton = document.getElementById("close-settings")
const nodeInputs = document.querySelectorAll('input[name="ai-mode"]')
const saveButton = document.getElementById("save-settings")
const apiKeyInput = document.getElementById("api-key")

openButton.addEventListener("click", openSettingsModal)
closeButton.addEventListener("click", closeSettingsModal)

nodeInputs.forEach(input => {
    input.addEventListener("change", () => {
        toggleApiKeyInput(input.value)
    })
})

saveButton.addEventListener("click", () => {
    const selectedMode = document.querySelector('input[name="ai-mode"]:checked')

    sessionStorage.setItem("aiMode", selectedMode.value)
})
const mode = sessionStorage.getItem("aiMode")
if (mode) {
    const radio = document.querySelector(
        `input[name="ai-mode"][value="${mode}"]`
    )
    if (radio) {
        radio.checked = true
        toggleApiKeyInput(mode)
    }
}
const apikey = apiKeyInput.value.trim()