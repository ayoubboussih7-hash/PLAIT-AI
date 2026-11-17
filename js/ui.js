export function openSettingsModal() {
    const modal = document.querySelector("#settings-modal")
    modal.classList.remove("hidden")
    modal.classList.add("flex")
}
export function closeSettingsModal() {
    const modal = document.querySelector("#settings-modal")
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