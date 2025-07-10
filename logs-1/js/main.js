function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return 'N/A';

    const year = dateTimeStr.substring(0, 4);
    const month = dateTimeStr.substring(4, 6);
    const day = dateTimeStr.substring(6, 8);
    const hour = dateTimeStr.substring(8, 10);
    const minute = dateTimeStr.substring(10, 12);
    const second = dateTimeStr.substring(12, 14);

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}


function formatValue(value) {
    if (value && value.includes('\\n') || value.includes('\\r\\n')) {
        return value
            .replace(/\\r\\n|\\n/g, '<br>')
            .replace(/\\r/g, '');
    }
    return value || 'N/A';
}