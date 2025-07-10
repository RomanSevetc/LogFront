// БЕЗ API (STATIC)


/*document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const tcuNumber = urlParams.get('tcuNumber');

    if (!tcuNumber) {
        alert('Error: No TCU PCBA Number provided in URL.');
        return;
    }
    try {
        const response = await fetch('../data/Final.json');
        if (!response.ok) {
            throw new Error(`Error loading the Final log data. ${response.statusText}`);
        }

        const dataArray = await response.json();
        const sampleData = dataArray.find(item => item.TcuPCBANumber.replace(/\r$/, '') === tcuNumber);
        if (!sampleData) {
            throw new Error(`No log data found for TCU PCBA Number: ${tcuNumber}`);
        }

        const { logInfo, testSteps, logisticData } = processLogData(sampleData);
        displayLogInfo(logInfo);
        displayTestSteps(testSteps);
        displayLogisticData(logisticData);
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading the Final log data: ' + error.message);
    }
});*/

document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const tcuNumber = urlParams.get('tcuNumber');

    if (!tcuNumber) {
        alert('Error: No TCU PCBA Number provided in URL.');
        return;
    }
    try {
        const response = await fetch(`http://10.0.15.206:8080/api/v1/final?pcbanumber=${encodeURIComponent(tcuNumber)}`);
        if (!response.ok) {
            throw new Error(`Error loading the PCBA log data. ${response.statusText}`);
        }

        const dataArray = await response.json();
        const sampleData = dataArray[0];
        if (!sampleData) {
            throw new Error(`No log data found for TCU PCBA Number: ${tcuNumber}`);
        }

        const {logInfo, testSteps, logisticData} = processLogData(sampleData);
        displayLogInfo(logInfo);
        displayTestSteps(testSteps);
        displayLogisticData(logisticData);
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading the PCBA log data: ' + error.message);
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
                <h3>Entity Type</h3>
                <p>${info.entityType}</p>
            </div>
            <div class="info-card">
                <h3>TCU PCBA Number</h3>
                <p>${info.tcuPCBA}</p>
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
                <h3>All Tests Passed</h3>
                <p>${info.isAllPassed ? 'Yes' : 'No'}</p>
            </div>
            <div class="info-card">
                <h3>Error Codes</h3>
                <p>${info.errorCodes}</p>
            </div>
            <div class="info-card">
                <h3>Finish Time</h3>
                <p>${formatDateTime(info.finishTime)}</p>
            </div>
        </div>
    `;
}

function displayLogisticData(data) {
    const container = document.getElementById('logistic-data');

    container.innerHTML = `
        <h2>Logistic Data</h2>
        <div class="log-info-grid">
            <div class="info-card">
                <h3>PCBA Number</h3>
                <p>${data.pcbaNumber}</p>
            </div>
            <div class="info-card">
                <h3>Product Serial Number</h3>
                <p>${data.productSN}</p>
            </div>
            <div class="info-card">
                <h3>Part Number</h3>
                <p>${data.partNumber}</p>
            </div>
            <div class="info-card">
                <h3>VP App Version</h3>
                <p>${data.vpAppVersion}</p>
            </div>
            <div class="info-card">
                <h3>VP Boot Loader Version</h3>
                <p>${data.vpBootLoaderVersion}</p>
            </div>
            <div class="info-card">
                <h3>VP Core Version</h3>
                <p>${data.vpCoreVersion}</p>
            </div>
            <div class="info-card">
                <h3>Supplier Hardware Version</h3>
                <p>${data.supplierHardwareVersion}</p>
            </div>
            <div class="info-card">
                <h3>Manufacturer Hardware Version</h3>
                <p>${data.manufacturerHardwareVersion}</p>
            </div>
            <div class="info-card">
                <h3>Manufacturer Software Version</h3>
                <p>${data.manufacturerSoftwareVersion}</p>
            </div>
            <div class="info-card">
                <h3>BLE MAC</h3>
                <p>${data.bleMac}</p>
            </div>
            <div class="info-card">
                <h3>BLE Serial Number</h3>
                <p>${data.bleSN}</p>
            </div>
            <div class="info-card">
                <h3>BLE Version</h3>
                <p>${data.bleVersion}</p>
            </div>
            <div class="info-card">
                <h3>BLE Password Key</h3>
                <p>${data.blePassworkKey}</p>
            </div>
            <div class="info-card">
                <h3>AP App Version</h3>
                <p>${data.apAppVersion}</p>
            </div>
            <div class="info-card">
                <h3>AP Kernel Version</h3>
                <p>${data.apKernelVersion}</p>
            </div>
            <div class="info-card">
                <h3>TCU ICCID</h3>
                <p>${data.tcuICCID}</p>
            </div>
            <div class="info-card">
                <h3>Phone Number</h3>
                <p>${data.phoneNumber}</p>
            </div>
            <div class="info-card">
                <h3>IMEI</h3>
                <p>${data.imei}</p>
            </div>
            <div class="info-card">
                <h3>IMSI</h3>
                <p>${data.imsi}</p>
            </div>
            <div class="info-card">
                <h3>Production Date</h3>
                <p>${data.productionDate}</p>
            </div>
        </div>
    `;
}


function displayTestSteps(steps) {
    const container = document.getElementById('tests-container');

    container.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = 'Test Steps';
    container.appendChild(title);
    const header = document.createElement('div');
    header.className = 'test-steps-header';
    container.appendChild(header);

    const sortContainer = document.createElement('div');
    sortContainer.className = 'test-steps-searcher';
    sortContainer.innerHTML =
        '<span class="searcher-label">Search:</span> ' +
        '<input type="text" id="test-step-searcher" placeholder="Search test steps...">';
    header.appendChild(sortContainer);

    const statusContainer = document.createElement('div');
    statusContainer.className = 'test-steps-status-filter';
    statusContainer.innerHTML = `
        <span class="status-label">Filter by Status:</span>
        <label><input type="checkbox" class="status-chk" value="passed" checked> Passed</label>
        <label><input type="checkbox" class="status-chk" value="failed" checked> Failed</label>
        <label><input type="checkbox" class="status-chk" value="unprocessed" checked> Unprocessed</label>
    `;
    header.appendChild(statusContainer);

    const statusCheckboxes = statusContainer.querySelectorAll('.status-chk');
    statusCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const selectedStatuses = Array.from(statusCheckboxes)
                .filter(chk => chk.checked)
                .map(chk => chk.value);

            const stepElements = container.querySelectorAll('.test-step');
            stepElements.forEach(stepElement => {
                const stepStatus = stepElement.classList.contains('passed') ? 'passed' :
                                   stepElement.classList.contains('failed') ? 'failed' : 'unprocessed';
                if (selectedStatuses.includes(stepStatus)) {
                    stepElement.style.display = '';
                } else {
                    stepElement.style.display = 'none';
                }
            });
        });
    });

    const searcherInput = document.getElementById('test-step-searcher');

    searcherInput.addEventListener('input', function () {
        const filterValue = searcherInput.value.trim().toLowerCase();
        const stepElements = container.querySelectorAll('.test-step');

        stepElements.forEach(stepElement => {
            const stepName = stepElement.querySelector('.test-step-name').textContent.trim().toLowerCase();
            if (stepName.includes(filterValue)) {
                stepElement.style.display = '';
            } else {
                stepElement.style.display = 'none';
            }
        });
    });

    steps.forEach(step => {
        const stepElement = document.createElement('div');
        stepElement.className = `test-step ${step.result.toLowerCase()}`;

        stepElement.innerHTML = `
            <div class="test-step-header">
                <span class="test-step-name">${step.name}</span>
                <span class="test-step-result ${step.result.toLowerCase()}">${step.result}</span>
            </div>
            <div class="test-details">
                <div class="detail-item">
                    <span class="detail-label">Elapsed Time:</span>
                    <span>${step.elapsed} ms</span>
                </div>
                ${step.measured ? `
                <div class="detail-item">
                    <span class="detail-label">Measured Value:</span>
                    <span>${formatValue(step.measured)}</span>
                </div>
                ` : ''}
                ${step.threshold ? `
                <div class="detail-item">
                    <span class="detail-label">Threshold Value:</span>
                    <span>${formatValue(step.threshold)}</span>
                </div>
                ` : ''}
                <div class="detail-item">
                    <span class="detail-label">Error Code:</span>
                    <span>${step.errorCode}</span>
                </div>
            </div>
        `;

        container.appendChild(stepElement);
    });
}