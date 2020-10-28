console.log("charts loaded")

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