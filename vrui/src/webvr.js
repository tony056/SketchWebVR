import {getDMMScale, parseDepthInfo} from './utils.js';

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


let HTML_END = '<a-entity camera look-controls wasd-controls>\n\
<a-entity cursor="fuse: true;" position="0 0 -1" scale=".01 .01 .01" geometry="primitive: ring" material="color: #fff; shader: flat">\n\
</a-entity>\n\
</a-entity>\n\
</a-scene>\n\
</body>\n\
</html>\n';

let BASIC_SCENE_SOURCE = '<img id="groundTexture" src="https://cdn.aframe.io/a-painter/images/floor.jpg" crossorigin="anonymous">\n\
<img id="skyTexture" src="https://cdn.aframe.io/a-painter/images/sky.jpg" crossorigin="anonymous">\n';

let BASIC_SCENE = '<a-sky height="2048" radius="30" src="#skyTexture" theta-length="90" width="2048"></a-sky>\n';

var createContent = (groups) => {
    const assets = createAssets(groups);
    const uis = createUIs(groups);
    return `${HTML_HEAD}${assets}${BASIC_SCENE}${uis}${HTML_END}`;
};

var createAssets = (groups) => {
    var assets = '';
    for(let group of groups){
        let name = group.name;
        assets += `<img id="${name}" src="./img/${name}.png">\n`;
    }
    return `<a-assets>\n${BASIC_SCENE_SOURCE}${assets}</a-assets>\n`;
};

var createUIs = (groups) => {
    var uis = '';
    for(let group of groups){
        let name = group.name;
        let frame = group.frame;
        let d = parseDepthInfo(name);
        let {width, height} = scaleUIs(frame.width, frame.height, d);
        let {x, y} = placeUIs(frame.x, frame.y, width, height, d);
        log(`name: ${name}, x: ${x}, y: ${y}, d:${d}, w: ${width}, h: ${height}`);
        uis += `<a-box src="#${name}" width="${width}" height="${height}" depth="0.01" position="${x} ${y} ${d}"></a-box>\n`;
    }
    return uis;
};

var scaleUIs = (w, h, d) => {
    let scale = getDMMScale(d);
    return {width: w * scale, height: h * scale};
};

var placeUIs = (x, y, w, h, d) => {
    let scale = getDMMScale(d);
    return {x: (x * scale + w / 2) , y: -(y * scale + h / 2) };
};

export {createContent};
