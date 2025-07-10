let selectedTcuNumber = null;
let activeCard = null;

// БЕЗ API (STATIC)


/*document.addEventListener('DOMContentLoaded', async function () {
    const grid = document.getElementById('log-info-grid');
    const searcherInput = document.getElementById('tcu-number-searcher');

    try {
        const response = await fetch('../data/tcuNumbers.json');
        if (!response.ok) throw new Error('Error loading the list of numbers.');
        const tcuNumbers = await response.json();

        tcuNumbers.forEach(tcuNumber => {
            const card = document.createElement('div');
            card.className = 'info-card hover-effect';
            card.innerHTML = `
                <h3>TCU PCBA Number</h3>
                <p>${tcuNumber}</p>
                <div class="card-buttons" style="display: none;">
                    <button onclick="redirectToPage('download.html', '${tcuNumber}')">Download</button>
                    <button onclick="redirectToPage('pcba.html', '${tcuNumber}')">PCBA</button>
                    <button onclick="redirectToPage('final.html', '${tcuNumber}')">Final</button>
                </div>
            `;*/

document.addEventListener('DOMContentLoaded', async function () {
    const grid = document.getElementById('log-info-grid');
    const searcherInput = document.getElementById('tcu-number-searcher');

    try {
        const response = await fetch('http://10.0.15.206:8080/api/v1/pcbanumbers');
        if (!response.ok) throw new Error('Error loading the list of numbers from API.');
        const data = await response.json();
        const tcuNumbers = data.PCBANumbers;

        tcuNumbers.forEach(tcuNumber => {
            const card = document.createElement('div');
            card.className = 'info-card hover-effect';
            card.innerHTML = `
                <h3>TCU PCBA Number</h3>
                <p>${tcuNumber}</p>
                <div class="card-buttons" style="display: none;">
                    <button onclick="redirectToPage('download.html', '${tcuNumber}')">Download</button>
                    <button onclick="redirectToPage('pcba.html', '${tcuNumber}')">PCBA</button>
                    <button onclick="redirectToPage('final.html', '${tcuNumber}')">Final</button>
                </div>
            `;
            card.addEventListener('click', (event) => {
                event.stopPropagation();
                if (activeCard && activeCard !== card) {
                    activeCard.querySelector('.card-buttons').style.display = 'none';
                }
                selectedTcuNumber = tcuNumber;
                activeCard = card;
                card.querySelector('.card-buttons').style.display = 'flex';
            });
            grid.appendChild(card);
        });

        document.addEventListener('click', (event) => {
            if (!event.target.closest('.info-card')) {
                if (activeCard) {
                    activeCard.querySelector('.card-buttons').style.display = 'none';
                    activeCard = null;
                    selectedTcuNumber = null;
                }
            }
        });

        searcherInput.addEventListener('input', function () {
            const filterValue = searcherInput.value.trim().toLowerCase();
            const cardElements = grid.querySelectorAll('.info-card');

            cardElements.forEach(cardElement => {
                const cardNumber = cardElement.querySelector('p').textContent.trim().toLowerCase();
                cardElement.style.display = cardNumber.includes(filterValue) ? '' : 'none';
            });
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading the list of numbers: ' + error.message);
    }
});

function redirectToPage(page, tcuNumber) {
    if (!tcuNumber) {
        alert('Error: Please choose a TCU PCBA number.');
        return;
    }
    console.log('Redirecting to:', page, 'with TCU Number:', tcuNumber);
    window.location.href = `${page}?tcuNumber=${encodeURIComponent(tcuNumber)}`;
}