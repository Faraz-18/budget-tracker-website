// Array to hold all transactions
let transactions = [];
let income = 0;
let expenses = 0;
let balance = 0;

// Select the necessary DOM elements
const transactionList = document.getElementById("transaction-list");
const totalIncomeEl = document.getElementById("total-income");
const totalExpensesEl = document.getElementById("total-expenses");
const balanceAmount = document.getElementById("balance-amount");

// Add event listener for the form submission
document.getElementById("transaction-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const date = document.getElementById("date").value;

    // Create a transaction object
    const transaction = {
        description,
        amount,
        type,
        date,
        visible: true
    };


    transactions.push(transaction);

    updateDisplay();

    document.getElementById("transaction-form").reset();
});


function updateDisplay() {
  
    transactionList.innerHTML = "";

    income = 0;
    expenses = 0;

   
    transactions.forEach(transaction => {
        if (transaction.visible) {
            const transactionItem = document.createElement("li");
            transactionItem.textContent = `${transaction.description}: $${transaction.amount.toFixed(2)} (${transaction.type}) on ${transaction.date}`;

            if (transaction.type === 'income') {
                transactionItem.classList.add("income");
                income += transaction.amount;
            } else {
                transactionItem.classList.add("expense");
                expenses += transaction.amount;
            }


            transactionList.appendChild(transactionItem);
        }
    });


    balance = income - expenses;
    totalIncomeEl.textContent = `$${income.toFixed(2)}`;
    totalExpensesEl.textContent = `$${expenses.toFixed(2)}`;
    balanceAmount.textContent = `$${balance.toFixed(2)}`;
}


function filterTransactions(type) {
    if (type === 'all') {
        transactions.forEach(transaction => transaction.visible = true);
    } else {
        transactions.forEach(transaction => transaction.visible = transaction.type === type);
    }
    updateDisplay();
}

function fetchAccountData() {
    fetch('/account')
        .then(response => response.json())
        .then(data => {
            document.getElementById('total-income').textContent = `$${data.salary.toFixed(2)}`;
            document.getElementById('total-expenses').textContent = `$0.00`; // Expense reset
            document.getElementById('balance-amount').textContent = `$${data.current_balance.toFixed(2)}`;
        })
        .catch(error => console.error('Error fetching account data:', error));
}


function fetchTransactions() {
    fetch('/transactions')
        .then(response => response.json())
        .then(transactions => {
         
            updateDisplay(transactions);
        });
}


document.getElementById("transaction-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const date = document.getElementById("date").value;

    
    const transaction = { description, amount, type, date };

   
    fetch('/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
    })
    .then(response => {
        if (response.ok) {
            fetchTransactions(); 
            fetchAccountData(); 
        }
    })
    .catch(error => console.error('Error adding transaction:', error));
});


function resetMonth() {
    fetch('/reset-month', { method: 'POST' })
        .then(response => {
            if (response.ok) {
                fetchAccountData(); 
            }
        })
        .catch(error => console.error('Error resetting month:', error));
}


fetchAccountData();
fetchTransactions();

document.getElementById('reset-month-btn').addEventListener('click', resetMonth);
