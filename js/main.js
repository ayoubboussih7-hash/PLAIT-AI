const bot = document.getElementById("bot")
const falidate = document.getElementById("falidate")

bot.addEventListener("submit", (e) => {
    e.preventDefault()
    falidate.textContent = "hello"
})