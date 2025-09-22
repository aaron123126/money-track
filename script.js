const changeMoneyBtn = document.getElementById('changeMoneyBtn');
const setMoneyBtn = document.getElementById('setMoneyBtn');
const changeMoneyDiv = document.getElementById('changeMoney');
const setMoneyDiv = document.getElementById('setMoney');
const confirmModal = document.getElementById('confirm');
const submitBtn = document.getElementById('submitBtn');
const yesBtn = document.getElementById('yesBtn');
const cancelBtn = document.getElementById('noBtn');
const balanceEl = document.getElementById('balance');
const changeTotalEl = document.getElementById('changeTotal');
const moneyInput = document.getElementById('moneyInput');
const addMoneyBtn = document.getElementById('addMoneyBtn');
const rmMoneyBtn = document.getElementById('rmMoneyBtn');
const historyListEl = document.getElementById('historyList');
const moneyButtons = document.querySelectorAll('.money-btn');

let currentBalance = 0;
let changeAmount = 0;

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
};

const updateDisplays = () => {
    balanceEl.textContent = formatCurrency(currentBalance);
    changeTotalEl.textContent = formatCurrency(changeAmount);
};

const addHistoryEntry = (amount, type) => {
    const entry = document.createElement('div');
    const sign = amount >= 0 ? '+' : '';
    entry.textContent = `${type}: ${sign}${formatCurrency(amount)} | New Balance: ${formatCurrency(currentBalance)}`;
    entry.style.color = amount < 0 ? 'red' : 'green';
    historyListEl.prepend(entry);
};

changeMoneyBtn.addEventListener('click', () => {
    const isHidden = changeMoneyDiv.style.display === 'none' || changeMoneyDiv.style.display === '';
    changeMoneyDiv.style.display = isHidden ? 'block' : 'none';
    setMoneyDiv.style.display = 'none';
    changeAmount = 0;
    updateDisplays();
});

setMoneyBtn.addEventListener('click', () => {
    const isHidden = setMoneyDiv.style.display === 'none' || setMoneyDiv.style.display === '';
    setMoneyDiv.style.display = isHidden ? 'block' : 'none';
    changeMoneyDiv.style.display = 'none';
    confirmModal.style.display = 'none';
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
    }
});

rmMoneyBtn.addEventListener('click', () => {
    if (changeAmount > 0) {
        const amountToRemove = -changeAmount;
        currentBalance += amountToRemove;
        addHistoryEntry(amountToRemove, 'Removed');
        changeAmount = 0;
        updateDisplays();
    }
});

submitBtn.addEventListener('click', () => {
    if (moneyInput.value !== '' && !isNaN(parseFloat(moneyInput.value))) {
        confirmModal.style.display = 'block';
    }
});

yesBtn.addEventListener('click', () => {
    const newValue = parseFloat(moneyInput.value);
    const difference = newValue - currentBalance;
    currentBalance = newValue;
    addHistoryEntry(difference, 'Set');
    updateDisplays();
    confirmModal.style.display = 'none';
    setMoneyDiv.style.display = 'none';
    moneyInput.value = '';
});

cancelBtn.addEventListener('click', () => {
    confirmModal.style.display = 'none';
});

updateDisplays();
