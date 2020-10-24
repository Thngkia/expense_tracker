console.log("app.js loaded")

var ctx = document.getElementById('expenseChart');
var myPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
        datasets: [{
            data: [10, 20, 30],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)'
            ]
        }],
    
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Expense',
            'Savings',
            'Investments'
        ]
        
    }
});

var incomeChart = document.getElementById('incomeChart');
var myincomeChart = new Chart(incomeChart, {
    type: 'pie',
    data: {
        datasets: [{
            data: [100, 20, 30],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)'
            ]
        }],
    
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Expense',
            'Savings',
            'Investments'
        ]
        
    }
});

let newEntryButton = document.querySelector('#new-entry')
let closeModal = document.querySelector('.close-modal')

document.querySelector('#new-entry').addEventListener('click', () => {
    document.querySelector('#new-entry-modal').classList.add("is-active")
})
document.querySelector('.close-modal').addEventListener('click', () => {
    document.querySelector('#new-entry-modal').classList.remove("is-active")
})

