import {getDMMScale, exportOptions, getCurrentPath, createFolder} from "./utils.js";
import {createContent} from './webvr.js';

export default function(context) {
    const sketch = context.api();
    // sketch.log('wrapper:' + Object.getOwnPropertyNames(sketch.wrapperMappings()));
    const doc = sketch.selectedDocument;
    const page = doc.selectedPage;
    const docObj = doc.sketchObject;
    const fileFolder = getCurrentPath(docObj);
    sketch.log('path: ' + fileFolder);
    artboards = getArtboardsFromPage(sketch, page);
    // sketch.log('artboads: ' + artboards[0].name)
    groups = getGroupsFromArtboards(sketch, artboards);


    // exportGroupsToImages(sketch, groups)
    exportToWebVR(sketch, 'sketch', groups, fileFolder);
}

var exportToWebVR = (sketch, docName, groups, currentPath) => {
    // creat a webvr folder under current path
    const vrFolderName = `${docName}-webVR`;
    createFolder(currentPath, vrFolderName);

    // creat img folder under the webvr folder
    const imgFolder = 'img';
    createFolder(`${currentPath}/${vrFolderName}`, imgFolder);

    // export all groups as png files to img folder
    let outputPath = `${currentPath}/${vrFolderName}/${imgFolder}`;
    exportGroupsToImages(sketch, groups, outputPath);

    // generate html content with groups info
    const html = createContent(groups);
    let fileName = 'index.html';
    createPage(currentPath, fileName, html);
}

var createPage = (currentPath, name, content) => {
    let path = `${currentPath}/${name}`;
    saveTextToFile(path, content);
}

var saveTextToFile = (name, content) => {
    // let path = [@"" stringByAppendingString:name];
    // let content = [@"" stringByAppendingString: content];
    let path = NSString.stringWithString(name);
    let data = NSString.stringWithString(content);
    data.dataUsingEncoding_(NSUTF8StringEncoding).writeToFile_atomically_(path, true);
}

var getArtboardsFromPage = (sketch, page) => {
    const layers = page.selectedLayers
    const arts = []
    layers.iterateWithFilter((layer) => {
        return layer.isArtboard
    }, (layer) => {
        sketch.log('layer name 1: ' + layer.name)
        // get groups and export each group as an image
        // exportGroupsToImages(sketch, layer)
        arts.push(layer)
    })
    return arts
}

var getGroupsFromArtboards = (sketch, artboards) => {
    const groups = []
    for (let artboard of artboards) {
        subgroups = getGroupsFromArtboard(sketch, artboard)
        groups.push(...subgroups)
    }
    return groups
}

var getGroupsFromArtboard = (sketch, artboard) => {
    const groups = []
    artboard.iterateWithFilter((layer) => {
        return layer.isGroup
    }, (group) => {
        groups.push(group)
    })
    return groups
}

var exportGroupsToImages = (sketch, groups, output) => {
    let d = 1;
    for(let group of groups){
        let scale = getDMMScale(d);
        sketch.log('s: ' + scale);
        let x = group.frame.x;
        let y = group.frame.y;
        let w = group.frame.width * scale;
        let h = group.frame.height * scale;
        let options = exportOptions;
        options.output = output;
        sketch.log('w, h: ' + w + ', ' + h);
        group.frame = new sketch.Rectangle(x, y, w, h);
        group.export(options);
        // d += 1;
    }
}
