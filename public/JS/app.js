console.log("app.js loaded")

document.querySelector('#new-entry').addEventListener('click', () => {
    document.querySelector('#new-entry-modal').classList.add("is-active")
})
document.querySelector('.close-modal').addEventListener('click', () => {
    document.querySelector('#new-entry-modal').classList.remove("is-active")
})

let needsValue = document.getElementById('needsValue').innerHTML
let wantsValue = document.getElementById('wantsValue').innerHTML
let savingsValue = document.getElementById('savingsValue').innerHTML
var ctx = document.getElementById('overallChart');
var myPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
        datasets: [{
            data: [needsValue, wantsValue, savingsValue],
            backgroundColor: [
                'hsl(171, 100%, 41%)',
                'hsl(204, 86%, 53%)',
                'hsl(348, 100%, 61%)'
            ]
        }],
    
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Needs',
            'Wants',
            'Savings'
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

// let newEntryButton = document.querySelector('#new-entry-modal')
// let closeModal = document.querySelector('.close-modal')



