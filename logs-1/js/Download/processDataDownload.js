function processLogData(rawData) {
    const logInfo = {
        testStation: rawData.TestStation,
        flashEntityType: rawData.FlashEntityType,
        tcuPCBA: rawData.TcuPCBANumber.trim(),
        flashTime: rawData.FlashElapsedTime,
        flashState: rawData.TcuEntityFlashState,
        partNumber: rawData.PartNumber,
        productLine: rawData.ProductLine,
        toolVersion: rawData.DownloadToolVersion,
        finishTime: rawData.DownloadFinishedTime
    };

    return { logInfo};
}
