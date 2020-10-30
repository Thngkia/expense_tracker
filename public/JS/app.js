console.log("app.js loaded")





// event listeners for new entry button and modal
document.querySelector('#new-entry').addEventListener('click', () => {
    document.querySelector('#new-entry-modal').classList.add("is-active")
})
document.querySelector('.close-entry-modal').addEventListener('click', () => {
    document.querySelector('#new-entry-modal').classList.remove("is-active")
})

// event listeners for update income button and modal
document.querySelector('#update-income').addEventListener('click', () => {
    document.querySelector('#update-income-modal').classList.add("is-active")
})
document.querySelector('.close-income-modal').addEventListener('click', () => {
    document.querySelector('#update-income-modal').classList.remove("is-active")
})

