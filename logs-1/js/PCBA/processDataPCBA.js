// БЕЗ API (STATIC)


/*
function processLogData(data) {
    const logInfo = {
        testStation: data.TestStation,
        entityType: data.EntityType,
        tcuPCBA: data.TcuPCBANumber.trim(),
        partNumber: data.PartNumber,
        productLine: data.ProductLine,
        toolVersion: data.TestToolVersion,
        isAllPassed: data.IsAllPassed,
        errorCodes: data.ErrorCodes || "None",
        finishTime: data.TestFinishedTime
    };

    const testSteps = data.tests.map(test => ({
        name: test.TestStepName,
        threshold: test.TestThresholdValue,
        measured: test.TestMeasuredValue,
        elapsed: test.TestStepElapsedTime,
        result: test.TestStepResult,
        errorCode: test.TestStepErrorCode
    }));

    const logisticData = {
        pcbaNumber: data.LogisticData.PCBANumber,
        productSN: data.LogisticData.ProductSN || "N/A",
        partNumber: data.LogisticData.PartNumber || "N/A",
        vpAppVersion: data.LogisticData.VPAppVersion || "N/A",
        vpBootLoaderVersion: data.LogisticData.VPBootLoaderVersion || "N/A",
        vpCoreVersion: data.LogisticData.VPCoreVersion || "N/A",
        supplierHardwareVersion: data.LogisticData.SupplierHardwareVersion || "N/A",
        manufacturerHardwareVersion: data.LogisticData.ManufacturerHardwareVersion || "N/A",
        manufacturerSoftwareVersion: data.LogisticData.ManufacturerSoftwareVersion || "N/A",
        bleMac: data.LogisticData.BleMac || "N/A",
        bleSN: data.LogisticData.BleSN || "N/A",
        bleVersion: data.LogisticData.BleVersion || "N/A",
        blePassworkKey: data.LogisticData.BlePassworkKey || "N/A",
        apAppVersion: data.LogisticData.APAppVersion || "N/A",
        apKernelVersion: data.LogisticData.APKernelVersion || "N/A",
        tcuICCID: data.LogisticData.TcuICCID || "N/A",
        phoneNumber: data.LogisticData.PhoneNumber || "N/A",
        imei: data.LogisticData.IMEI || "N/A",
        imsi: data.LogisticData.IMSI || "N/A",
        productionDate: data.LogisticData.ProductionDate || "N/A"
    };

    return { logInfo, testSteps, logisticData };
}
*/

function processLogData(data) {
    if (!data) {
        throw new Error('No data provided to processLogData');
    }

    const logInfo = {
        testStation: data.TestStation || "N/A",
        entityType: data.EntityType || "N/A",
        tcuPCBA: data.PCBANumber ? String(data.PCBANumber).trim() : "N/A",
        partNumber: data.PartNumber || "N/A",
        productLine: data.ProductLine || "N/A",
        toolVersion: data.TestToolVersion || "N/A",
        isAllPassed: data.IsAllPassed !== undefined ? data.IsAllPassed : false,
        errorCodes: data.ErrorCodes || "None",
        finishTime: data.TestFinishedTime || "N/A"
    };

    const testSteps = Array.isArray(data.TestSteps) ? data.TestSteps.map(test => ({
        name: test.TestStepName || "N/A",
        threshold: test.TestThresholdValue !== undefined ? test.TestThresholdValue : null,
        measured: test.TestMeasuredValue !== undefined ? test.TestMeasuredValue : null,
        elapsed: test.TestStepElapsedTime || 0,
        result: test.TestStepResult || "Unprocessed",
        errorCode: test.TestStepErrorCode || "None"
    })) : [];

    const logisticData = data.LogisticData ? {
        pcbaNumber: data.LogisticData.PCBANumber || "N/A",
        productSN: data.LogisticData.ProductSN || "N/A",
        partNumber: data.LogisticData.PartNumber || "N/A",
        vpAppVersion: data.LogisticData.VPAppVersion || "N/A",
        vpBootLoaderVersion: data.LogisticData.VPBootLoaderVersion || "N/A",
        vpCoreVersion: data.LogisticData.VPCoreVersion || "N/A",
        supplierHardwareVersion: data.LogisticData.SupplierHardwareVersion || "N/A",
        manufacturerHardwareVersion: data.LogisticData.ManufacturerHardwareVersion || "N/A",
        manufacturerSoftwareVersion: data.LogisticData.ManufacturerSoftwareVersion || "N/A",
        bleMac: data.LogisticData.BleMac || "N/A",
        bleSN: data.LogisticData.BleSN || "N/A",
        bleVersion: data.LogisticData.BleVersion || "N/A",
        blePassworkKey: data.LogisticData.BlePassworkKey || "N/A",
        apAppVersion: data.LogisticData.APAppVersion || "N/A",
        apKernelVersion: data.LogisticData.APKernelVersion || "N/A",
        tcuICCID: data.LogisticData.TcuICCID || "N/A",
        phoneNumber: data.LogisticData.PhoneNumber || "N/A",
        imei: data.LogisticData.IMEI || "N/A",
        imsi: data.LogisticData.IMSI || "N/A",
        productionDate: data.LogisticData.ProductionDate || "N/A"
    } : {
        pcbaNumber: "N/A",
        productSN: "N/A",
        partNumber: "N/A",
        vpAppVersion: "N/A",
        vpBootLoaderVersion: "N/A",
        vpCoreVersion: "N/A",
        supplierHardwareVersion: "N/A",
        manufacturerHardwareVersion: "N/A",
        manufacturerSoftwareVersion: "N/A",
        bleMac: "N/A",
        bleSN: "N/A",
        bleVersion: "N/A",
        blePassworkKey: "N/A",
        apAppVersion: "N/A",
        apKernelVersion: "N/A",
        tcuICCID: "N/A",
        phoneNumber: "N/A",
        imei: "N/A",
        imsi: "N/A",
        productionDate: "N/A"
    };

    return { logInfo, testSteps, logisticData };
}