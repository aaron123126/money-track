//server.js

const balanceEl = document.getElementById('balance');
const changeTotalEl = document.getElementById('changeTotal');
const historyListEl = document.getElementById('historyList');
const moneyInput = document.getElementById('moneyInput');
const moneyChart = document.getElementById('moneyChart');

let chart;

const createChart = () => {
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(moneyChart, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Balance',
                data: [],
                borderColor: '#1c3144',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};

const updateChart = () => {
    if (chart) {
        chart.data.labels = history.map((_, index) => index + 1);
        chart.data.datasets[0].data = history.map(item => item.balance);
        chart.update();
    }
};

const changeMoneyBtn = document.getElementById('changeMoneyBtn');
const setMoneyBtn = document.getElementById('setMoneyBtn');
const submitBtn = document.getElementById('submitBtn');
const addMoneyBtn = document.getElementById('addMoneyBtn');
const rmMoneyBtn = document.getElementById('rmMoneyBtn');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

const moneyButtons = document.querySelectorAll('.money-btn');
const backBtns = document.querySelectorAll('.back-btn');
const pages = document.querySelectorAll('.page');

let currentBalance = 0;
let history = [];
let changeAmount = 0;

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
};

const showPage = (pageId) => {
    pages.forEach(page => {
        page.style.display = 'none';
    });
    const activePage = document.getElementById(pageId);
    if (activePage) {
        activePage.style.display = 'block';
    }
};

const updateDisplays = () => {
    balanceEl.textContent = formatCurrency(currentBalance);
    changeTotalEl.textContent = formatCurrency(changeAmount);
    renderHistory();
};

const renderHistory = () => {
    historyListEl.innerHTML = '';
    history.forEach(item => {
        const entry = document.createElement('div');
        entry.textContent = item.text;
        entry.style.color = item.color;
        historyListEl.prepend(entry);
    });
}

const addHistoryEntry = (amount, type) => {
    let text = '';
    let color = '#000000';

    switch (type) {
        case 'Added':
            text = `+ Added ${formatCurrency(amount)} · New Total: ${formatCurrency(currentBalance)}`;
            color = '#3a7f06';
            break;
        case 'Removed':
            text = `- Removed ${formatCurrency(Math.abs(amount))} · New Total: ${formatCurrency(currentBalance)}`;
            color = '#9a2103';
            break;
        case 'Set':
            text = `| Set Money · New Total: ${formatCurrency(currentBalance)}`;
            color = '#b75b00';
            break;
    }

    history.push({ text, color, balance: currentBalance });
    updateChart();
    saveData();
};

const saveData = () => {
    window.electronAPI.saveData({ balance: currentBalance, history: history });
};

changeMoneyBtn.addEventListener('click', () => {
    changeAmount = 0;
    updateDisplays();
    showPage('add-remove-page');
});

setMoneyBtn.addEventListener('click', () => {
    showPage('set-money-page');
});

moneyButtons.forEach(button => {
    button.addEventListener('click', () => {
        changeAmount += parseFloat(button.dataset.value);
        updateDisplays();
    });
});

addMoneyBtn.addEventListener('click', () => {
    if (changeAmount > 0) {
        currentBalance += changeAmount;
        addHistoryEntry(changeAmount, 'Added');
        changeAmount = 0;
        updateDisplays();
        showPage('main-page');
    }
});

rmMoneyBtn.addEventListener('click', () => {
    if (changeAmount > 0) {
        const amountToRemove = -changeAmount;
        currentBalance += amountToRemove;
        addHistoryEntry(amountToRemove, 'Removed');
        changeAmount = 0;
        updateDisplays();
        showPage('main-page');
    }
});

submitBtn.addEventListener('click', () => {
    const value = moneyInput.value;
    if (value !== '' && !isNaN(parseFloat(value))) {
        showPage('confirm-page');
    }
});

yesBtn.addEventListener('click', () => {
    const newValue = parseFloat(moneyInput.value);
    currentBalance = newValue;
    addHistoryEntry(0, 'Set');
    updateDisplays();
    moneyInput.value = '';
    showPage('main-page');
});

noBtn.addEventListener('click', () => {
    showPage('set-money-page');
});

backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetPage = btn.dataset.target || 'main-page';
        showPage(targetPage);
    });
});

window.electronAPI.onDataLoaded((data) => {
    currentBalance = data.balance;
    history = data.history;
    updateDisplays();
    createChart();
    updateChart();
});

showPage('main-page');
