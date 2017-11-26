let HTML_HEAD = '<!DOCTYPE html>\n\
<html lang="en">\n\
<head>\n\
<meta charset="utf-8">\n\
<title>' + 'webVR' + '</title>\n\
<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\
<script src="https://aframe.io/releases/0.7.0/aframe.min.js"></script> \n\
</head>\n\
<body>\n\
<a-scene>\n';


let HTML_END = '<a-entity camera look-controls>\n\
<a-entity cursor="fuse: true;" position="0 0 -1" scale=".01 .01 .01" geometry="primitive: ring" material="color: #fff; shader: flat">\n\
</a-entity>\n\
</a-entity>\n\
</a-scene>\n\
</body>\n\
</html>\n';



var createContent = (groups) => {
    const assets = createAssets(groups);
    const uis = createUIs(groups);
    return `${HTML_HEAD}${assets}${uis}${HTML_END}`;
};

var createAssets = (groups) => {
    var assets = '';
    for(let group of groups){
        let name = group.name;
        assets += `<img id="${name}" src="./img/${name}.png">\n`;
    }
    return `<a-assets>\n${assets}</a-assets>\n`;
};

var createUIs = (groups) => {
    var uis = '';
    for(let group of groups){
        let name = group.name;
        uis += `<a-image src="#${name}"></a-image>\n`;
    }
    return uis;
}


export {createContent};
