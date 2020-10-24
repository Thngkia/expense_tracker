let newEntryButton = document.querySelector('#new-entry')
let closeModal = document.querySelector('.close-modal')

document.querySelector('#new-entry').addEventListener('click', () => {
    document.querySelector('#new-entry-modal').classList.add("is-active")
})
document.querySelector('.close-modal').addEventListener('click', () => {
    document.querySelector('#new-entry-modal').classList.remove("is-active")
})

