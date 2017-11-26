import {getDMMScale, exportOptions, getCurrentPath} from "./utils.js"

export default function(context) {
    const sketch = context.api();
    const doc = sketch.selectedDocument;
    const page = doc.selectedPage;
    const docObj = doc.sketchObject;
    const fileFolder = getCurrentPath(docObj);
    sketch.log('path: ' + fileFolder);
    // artboards = getArtboardsFromPage(sketch, page)
    // // sketch.log('artboads: ' + artboards[0].name)
    // groups = getGroupsFromArtboards(sketch, artboards)
    // exportGroupsToImages(sketch, groups)
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

var exportGroupsToImages = (sketch, groups) => {
    let d = 1;
    for(let group of groups){
        let scale = getDMMScale(d);
        sketch.log('s: ' + scale);
        let x = group.frame.x;
        let y = group.frame.y;
        let w = group.frame.width * scale;
        let h = group.frame.height * scale;
        sketch.log('w, h: ' + w + ', ' + h);
        group.frame = new sketch.Rectangle(x, y, w, h);
        // group.export(exportOptions)
        d += 1;
    }
    // sketch.log('exporting... ' + groups.length)
    // for(let group of groups){
    //     group.iterate((layer) => {
    //         sketch.log(layer.frame.width)
    //     })
    //
    // }

}
