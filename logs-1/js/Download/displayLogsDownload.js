// БЕЗ API (STATIC)


/*
document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const tcuNumber = urlParams.get('tcuNumber');

    if (!tcuNumber) {
        alert('Error: No TCU PCBA Number provided in URL.');
        return;
    }
    try {
        const response = await fetch('../data/Download.json');
        if (!response.ok) {
            throw new Error(`Error loading the log data. ${response.statusText}`);
        }
        const dataArray = await response.json();
        const sampleData = dataArray.find(item => item.TcuPCBANumber.replace(/\r$/, '') === tcuNumber);
        if (!sampleData) {
            throw new Error(`No log data found for TCU PCBA Number: ${tcuNumber}`);
        }

        const {logInfo} = processLogData(sampleData);
        displayLogInfo(logInfo);
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading the log data: ' + error.message);
    }
});

function displayLogInfo(info) {
    const container = document.getElementById('log-info');

    container.innerHTML = `
        <h2>Test Station Information</h2>
        <div class="log-info-grid">
            <div class="info-card">
                <h3>Test Station</h3>
                <p>${info.testStation}</p>
            </div>
            <div class="info-card">
                <h3>Flash Entity Type</h3>
                <p>${info.flashEntityType}</p>
            </div>
            <div class="info-card">
                <h3>TCU PCBA Number</h3>
                <p>${info.tcuPCBA}</p>
            </div>
            <div class="info-card">
                <h3>Flash State</h3>
                <p>${info.flashState}</p>
            </div>
            <div class="info-card">
                <h3>Part Number</h3>
                <p>${info.partNumber}</p>
            </div>
            <div class="info-card">
                <h3>Product Line</h3>
                <p>${info.productLine}</p>
            </div>
            <div class="info-card">
                <h3>Tool Version</h3>
                <p>${info.toolVersion}</p>
            </div>
            <div class="info-card">
                <h3>Finish Time</h3>
                <p>${formatDateTime(info.finishTime)}</p>
            </div>
        </div>
    `;
}

*/

document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const tcuNumber = urlParams.get('tcuNumber');

    if (!tcuNumber) {
        alert('Error: No TCU PCBA Number provided in URL.');
        return;
    }

    try {
        // Отправляем запрос к API вместо чтения локального файла
        const response = await fetch(`http://10.0.15.206:8080/api/v1/download?pcbanumber=${encodeURIComponent(tcuNumber)}`);
        if (!response.ok) {
            throw new Error(`Error loading the log data. ${response.statusText}`);
        }
        const sampleData = await response.json();

        if (!sampleData) {
            throw new Error(`No log data found for TCU PCBA Number: ${tcuNumber}`);
        }

        const {logInfo} = processLogData(sampleData);
        displayLogInfo(logInfo);
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading the log data: ' + error.message);
    }
});

function displayLogInfo(info) {
    const container = document.getElementById('log-info');

    container.innerHTML = `
        <h2>Test Station Information</h2>
        <div class="log-info-grid">
            <div class="info-card">
                <h3>Test Station</h3>
                <p>${info.testStation}</p>
            </div>
            <div class="info-card">
                <h3>Flash Entity Type</h3>
                <p>${info.flashEntityType}</p>
            </div>
            <div class="info-card">
                <h3>TCU PCBA Number</h3>
                <p>${info.tcuPCBA}</p>
            </div>
            <div class="info-card">
                <h3>Flash State</h3>
                <p>${info.flashState}</p>
            </div>
            <div class="info-card">
                <h3>Part Number</h3>
                <p>${info.partNumber}</p>
            </div>
            <div class="info-card">
                <h3>Product Line</h3>
                <p>${info.productLine}</p>
            </div>
            <div class="info-card">
                <h3>Tool Version</h3>
                <p>${info.toolVersion}</p>
            </div>
            <div class="info-card">
                <h3>Finish Time</h3>
                <p>${formatDateTime(info.finishTime)}</p>
            </div>
        </div>
    `;
}