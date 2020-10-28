console.log("app.js loaded")


// document.querySelector('#filter-dropdown').addEventListener('click', () => {
//     document.querySelector('#filter-dropdown').classList.toggle("is-active")
// })


// event listeners for new entry button and modal
document.querySelector('#new-entry').addEventListener('click', () => {
    document.querySelector('#new-entry-modal').classList.add("is-active")
})
document.querySelector('.close-modal').addEventListener('click', () => {
    document.querySelector('#new-entry-modal').classList.remove("is-active")
})

// event listeners for update income button and modal
document.querySelector('#update-income').addEventListener('click', () => {
    document.querySelector('#update-income-modal').classList.add("is-active")
})
document.querySelector('.close-modal').addEventListener('click', () => {
    document.querySelector('#update-income-modal').classList.remove("is-active")
})

