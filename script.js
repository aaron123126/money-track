// Element Selectors
const balanceEl = document.getElementById('balance');
const changeTotalEl = document.getElementById('changeTotal');
const historyListEl = document.getElementById('historyList');
const moneyInput = document.getElementById('moneyInput');

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

// State
let currentBalance = 0;
let changeAmount = 0;

// Utility Functions
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
};

const addHistoryEntry = (amount, type) => {
    const entry = document.createElement('div');
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

    entry.textContent = text;
    entry.style.color = color;
    historyListEl.prepend(entry);
};

// Event Listeners
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

// Initial Setup
updateDisplays();
showPage('main-page');
