

var getDMMScale = (distance) => {
    return distance / 1000;
}

var getCurrentPath = (docObj) => {
    return docObj.fileURL().path().split(docObj.displayName())[0];
}

var createWebVRFolder = (path, folderName) => {
    createFolder(path, folderName);
    return `${path}/${folderName}`;
}

var createFolder = (path, name) => {
    deleteFolder(path, name);
    var fileManager = NSFileManager.defaultManager();
    fileManager.createDirectoryAtPath_withIntermediateDirectories_attributes_error_(path + '/' + name, true, nil, nil);
}

var deleteFolder = (path, name) => {
    var fileManager = NSFileManager.defaultManager();
    fileManager.removeItemAtPath_error(path + '/' + name, nil);
}

var parseDepthInfo = (name) => {
    let arr = name.split('z_');
    log(`arr: ${arr}` );
    let depthStr = arr[arr.length - 1];
    var numArr = depthStr.split('e-').map((num) => {
        return parseFloat(num, 10);
    });
    if(numArr.length !== 2){
        numArr.push(0);
    }
    return numArr[0] * (10 ** (-numArr[1]));
}

const exportOptions = {
    "scales": "1",
    "formats": "png"
};

export {getDMMScale, exportOptions, getCurrentPath, createFolder, parseDepthInfo};
