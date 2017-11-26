export default function(context) {
    var sketch = context.api()
    var doc = sketch.selectedDocument
    var page = doc.selectedPage
    exportUIsfromArtboards(sketch, page)
    // sketch.log('artboads: ' + artboards.length)
}

var exportUIsfromArtboards = (sketch, page) => {
    const layers = page.selectedLayers
    var artboards = []
    sketch.log('artboards: ' + artboards.length)
    layers.iterateWithFilter((layer) => {
        if(layer.isArtboard)
            return true
    }, (layer) => {
        sketch.log('layer name: ' + layer.name)
        // get groups and export each group as an image
        
    })
}
