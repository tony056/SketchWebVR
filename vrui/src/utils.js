

var getDMMScale = (distance) => {
    return distance;
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



const exportOptions = {
    "scales": "1",
    "formats": "png"
};

export {getDMMScale, exportOptions, getCurrentPath, createFolder};
