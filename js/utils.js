export function countDone(tasks) {
    return tasks.filter(task => task.status === "Done").length
}

export function progress(tasks) {
    if (tasks.length === 0) return 0

    return Math.round(countDone(tasks) / tasks.length * 100)
}

export function totalHours(tasks) {
    return tasks.reduce((total, task) => {
        return total + Number(task.estimatedTime)
    }, 0)
}