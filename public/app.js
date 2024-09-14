// Function to fetch crypto data
async function fetchCryptoData() {
    try {
        const response = await fetch('/api/cryptos');
        const data = await response.json();
        const tableBody = document.querySelector('#cryptoTable tbody');


        tableBody.innerHTML = '';

        data.forEach((crypto, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${crypto.name}</td>
                <td>₹ ${crypto.last}</td>
                <td>₹ ${crypto.buy} / ₹ ${crypto.sell}</td>
                <td>${crypto.volume}</td>
                <td>${crypto.base_unit}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching crypto data', error);
        const tableBody = document.querySelector('#cryptoTable tbody');
        tableBody.innerHTML = '<tr><td colspan="6">Error fetching data. Please try again later.</td></tr>';
    }
}

// Fetch and display crypto data on page load
document.addEventListener('DOMContentLoaded', fetchCryptoData);

// Timer functionality
let timerValue = 60;
const timerDisplay = document.getElementById('timerDisplay');

function updateTimer() {
    if (timerValue <= 0) {
        fetchCryptoData(); 
        timerValue = 60; 
    }
    timerDisplay.textContent = timerValue;
    timerValue--;
}

setInterval(updateTimer, 1000); 


const themeToggleButton = document.getElementById('themeToggle');

themeToggleButton.addEventListener('click', () => {

    document.body.classList.toggle('light-mode');
    document.querySelector('header').classList.toggle('light-mode');
    document.querySelectorAll('.currency-list button, .crypto-list button, .buy-btc button').forEach(btn => btn.classList.toggle('light-mode'));
    document.querySelector('.connect button').classList.toggle('light-mode');
    themeToggleButton.classList.toggle('light-mode');
    document.querySelector('table').classList.toggle('light-mode');

    if (!themeToggleButton.classList.contains('move-right') && !themeToggleButton.classList.contains('move-left')) {
        themeToggleButton.classList.add('move-right');
    } else if (themeToggleButton.classList.contains('move-right')) {
        themeToggleButton.classList.remove('move-right');
        themeToggleButton.classList.add('move-left');
    } else if (themeToggleButton.classList.contains('move-left')) {
        themeToggleButton.classList.remove('move-left');
    }
});
