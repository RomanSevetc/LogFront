let activeBoard = null;
let currentPage = 1;
const rowsPerPage = 20;
let filteredRows = [];
let originalRows = [];

document.addEventListener('DOMContentLoaded', async () => {
    const themeButton = document.getElementById('theme-button');
    const body = document.body;
    const icon = themeButton?.querySelector('i');

    if (themeButton && icon) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
            icon.classList.replace('fa-moon', 'fa-sun');
        }

        themeButton.addEventListener('click', () => {
            body.classList.toggle('dark-theme');

            if (body.classList.contains('dark-theme')) {
                icon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const boardName = urlParams.get('boardName');

    try {
        const logsResponse = await fetch('../data/logs.json');
        if (!logsResponse.ok) {
            throw new Error(`Error loading logs.json: ${logsResponse.statusText}`);
        }
        const logsResponseData = await logsResponse.json();
        const logsData = Object.entries(logsResponseData).map(([board, count]) => ({board, count}));
        originalRows = logsData;
        filteredRows = logsData;


        let timelogData = null;
        if (boardName) {
            const timelogResponse = await fetch('../data/timelog.json');
            if (!timelogResponse.ok) {
                throw new Error(`Error loading timelog.json: ${timelogResponse.statusText}`);
            }
            timelogData = await timelogResponse.json();

            if (!timelogData[boardName]) {
                throw new Error(`No timestamp data found for board: ${boardName}`);
            }
        }


        renderTable(timelogData);

        document.getElementById('searchInput').addEventListener('input', () => {
            currentPage = 1;
            searchLogs(timelogData);
        });

        document.addEventListener('click', (event) => {
            if (activeBoard) {
                const clickedInsideTable = event.target.closest('table.timestamp-table')
                    || event.target.closest('tr') === activeBoard.timestampRow
                    || event.target.closest('tr') === activeBoard.filterRow
                    || event.target.closest('.time-filter');
                const clickedLink = event.target.closest('a');

                if (!clickedInsideTable && !clickedLink) {
                    activeBoard.timestampRow.remove();
                    activeBoard.filterRow.remove();
                    activeBoard = null;
                    renderTable(timelogData);
                }
            }
        });

    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
});

function renderTable(timelogData) {
    const tbody = document.getElementById('logsBody');
    tbody.innerHTML = '';

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const rowsToShow = filteredRows.slice(startIndex, endIndex);

    rowsToShow.forEach(item => {
        const row = document.createElement('tr');
        const boardLink = document.createElement('a');
        boardLink.href = `?boardName=${encodeURIComponent(item.board)}`;
        boardLink.textContent = item.board;

        row.addEventListener('click', async (event) => {
            event.preventDefault();
            if (activeBoard && activeBoard.board !== item.board) {
                activeBoard.timestampRow.remove();
                activeBoard.filterRow.remove();
                activeBoard = null;
            }
            if (activeBoard && activeBoard.board === item.board) {
                return;
            }

            let localTimelogData = timelogData;

            if (!localTimelogData) {
                const timelogResponse = await fetch('../data/timelog.json');
                if (!timelogResponse.ok) {
                    throw new Error(`Error loading timelog.json: ${timelogResponse.statusText}`);
                }
                localTimelogData = await timelogResponse.json();
            }
            if (!localTimelogData[item.board]) {
                alert(`No timestamp data found for board: ${item.board}`);
                return;
            }

            const timestampRow = document.createElement('tr');
            const timestampCell = document.createElement('td');
            timestampCell.colSpan = 2;
            timestampRow.appendChild(timestampCell);
            tbody.insertBefore(timestampRow, row.nextSibling);

            const filterRow = document.createElement('tr');
            const filterCell = document.createElement('td');
            filterCell.colSpan = 2;
            filterRow.appendChild(filterCell);
            tbody.insertBefore(filterRow, row.nextSibling);

            const filterForm = document.createElement('div');
            filterForm.className = 'time-filter';
            filterForm.innerHTML = `
                <label>От:
                    <input type="datetime-local" class="time-filter-start">
                </label>
                <label>До:
                    <input type="datetime-local" class="time-filter-end">
                </label>
                <button class="apply-filter">Применить</button>
                <button class="reset-filter">Сбросить</button>
            `;
            filterCell.appendChild(filterForm);

            const renderFilteredData = (startDate = null, endDate = null) => {
                const timestampTable = document.createElement('table');
                timestampTable.className = 'timestamp-table';
                timestampTable.innerHTML = `
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                `;

                const timestampTbody = timestampTable.querySelector('tbody');
                let hasData = false;

                localTimelogData[item.board].forEach(timestamp => {
                    const [dateStr, timeWithMicro] = timestamp.split(' ');
                    const timeStr = timeWithMicro.split('.')[0];
                    const fullDateStr = `${dateStr}T${timeStr}`;
                    const timestampDate = new Date(fullDateStr);

                    if ((!startDate || timestampDate >= startDate) &&
                        (!endDate || timestampDate <= endDate)) {

                        const timestampRowInner = document.createElement('tr');
                        timestampRowInner.innerHTML = `
                            <td>${dateStr}</td>
                            <td>${timeStr}</td>
                        `;
                        timestampTbody.appendChild(timestampRowInner);
                        hasData = true;
                    }
                });

                timestampCell.innerHTML = '';
                if (hasData) {
                    timestampCell.appendChild(timestampTable);
                } else {
                    timestampCell.textContent = 'Нет данных за выбранный период';
                }
            };

            renderFilteredData();

            filterForm.querySelector('.apply-filter').addEventListener('click', () => {
                const startInput = filterForm.querySelector('.time-filter-start');
                const endInput = filterForm.querySelector('.time-filter-end');

                const startDate = startInput.value ? new Date(startInput.value) : null;
                const endDate = endInput.value ? new Date(endInput.value) : null;

                renderFilteredData(startDate, endDate);
            });

            filterForm.querySelector('.reset-filter').addEventListener('click', () => {
                filterForm.querySelector('.time-filter-start').value = '';
                filterForm.querySelector('.time-filter-end').value = '';
                renderFilteredData();
            });

            activeBoard = {
                board: item.board,
                timestampRow,
                filterRow
            };
        });

        row.innerHTML = `<td></td><td>${item.count}</td>`;
        row.cells[0].appendChild(boardLink);
        tbody.appendChild(row);
    });

    renderPagination(filteredRows.length);
}

function renderPagination(totalRows) {
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination';

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Предыдущая';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
            renderPagination(totalRows);
        }
    });
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = currentPage === i ? 'active' : '';
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderTable();
            renderPagination(totalRows);
        });
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Следующая';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
            renderPagination(totalRows);
        }
    });
    paginationContainer.appendChild(nextButton);

    const existingPagination = document.querySelector('.pagination');
    if (existingPagination) {
        existingPagination.remove();
    }
    const tableContainer = document.querySelector('.table-container');
    if (tableContainer) {
        tableContainer.appendChild(paginationContainer);
    } else {
        document.body.appendChild(paginationContainer);
    }
}

function searchLogs(timelogData) {
    const input = document.getElementById('searchInput').value.toLowerCase();
    filteredRows = originalRows.filter(item => {
        const boardName = item.board.toLowerCase();
        const count = item.count.toString().toLowerCase();
        return boardName.includes(input) || count.includes(input);
    });

    renderTable(timelogData);
}



function sortTable(columnIndex, timelogData) {
    if (activeBoard) {
        activeBoard.timestampRow.remove();
        activeBoard.filterRow.remove();
        activeBoard = null;
    }

    const header = document.querySelectorAll('th')[columnIndex];
    const isAsc = header.classList.contains('sorted-asc');

    document.querySelectorAll('th').forEach(th => {
        th.classList.remove('sorted-asc', 'sorted-desc');
        th.querySelector('i').className = 'fas fa-chevron-up';
    });

    header.classList.add(isAsc ? 'sorted-desc' : 'sorted-asc');
    header.querySelector('i').className = isAsc ? 'fas fa-chevron-up' : 'fas fa-chevron-down';

    filteredRows.sort((a, b) => {
        const aVal = columnIndex === 0 ? a.board : a.count;
        const bVal = columnIndex === 0 ? b.board : b.count;

        if (columnIndex === 1) {
            return isAsc ? parseInt(aVal) - parseInt(bVal) : parseInt(bVal) - parseInt(aVal);
        }
        return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    currentPage = 1;
    renderTable(timelogData);
}