import * as THREE from 'three.js'
import './loader'
import '../engine/parameters'

var textureDescriptors = {
	// 'panorama': "images/Room.jpg",
};

var meshDescriptors = {
	// 'building1': "meshes/building1.ply",
};

var geometryDescriptors = {
	// 'Simon1': 'meshes/Simon1.ply',
};

var shaderDescriptors = {
	'particle.vert': 'particle.vert',
	'color.frag': 'color.frag',
};

var shaderBaseURL = 'app/shaders/';					

var pendingCallbacks = [];
var isLoaded = false;

function load(callback) {
	if (isLoaded) {
		return setTimeout(function() {
			return callback(assets);
		});
	}

	return pendingCallbacks.push(callback);
}

export var assets = {
	// 'actions': new blenderHTML5Animations.ActionLibrary(actionsDescriptor),
	'load': load,
	'geometries': {},
	'textures': {}
};

function notify() {
	isLoaded = assets.shaders 
	// && Object.keys(assets.textures).length == Object.keys(textureDescriptors).length 
	// && Object.keys(assets.geometries).length == Object.keys(geometryDescriptors).length;
	// && assets.meshes;

	if (isLoaded) {
		return pendingCallbacks.forEach(function(callback) {
			return callback();
		});
	}
}

var shaderURLs = [
	// "header.glsl",
	// "uniforms.glsl",
	// "modifiers.glsl",
	"utils.glsl",
	// "hg_sdf.glsl",
].map(function(name) {
	return shaderBaseURL + name;
});

Object.keys(shaderDescriptors).forEach(function(name) {
	var url = shaderDescriptors[name];
	shaderURLs.push( shaderBaseURL + url );
});

var parameterList = 'uniform float ';
var keys = Object.keys(parameters);
var count = keys.length;
for (var i = 0; i < count; ++i) {
	parameterList += keys[i] + (i+1!=count?', ':';');
}

assets.fileLoaded = {};

function fileWithHeaders(name) {
	return assets.fileLoaded[shaderBaseURL + "utils.glsl"] + parameterList + assets.fileLoaded[name];
}

loadFiles(shaderURLs, function (err, files) {
	if (err) throw err;

	assets.fileLoaded = files;

	var shaders = {};
	Object.keys(shaderDescriptors).forEach(function(name) {
		var url = shaderDescriptors[name];
		shaders[name] = fileWithHeaders(shaderBaseURL + url);
	});

	assets.shaders = shaders;
	return notify();
});

assets.reload = function (assetName, callback) {
	loadFiles([shaderBaseURL + assetName], function (err, files) {
		assets.fileLoaded[shaderBaseURL + assetName] = files[shaderBaseURL + assetName];
		assets.shaders[assetName] = fileWithHeaders(shaderBaseURL + shaderDescriptors[assetName]);
		if (callback != null) callback();
	});
};

// var textureLoader = new THREE.TextureLoader();
// Object.keys(textureDescriptors).forEach(function(name) {
// 	textureLoader.load(textureDescriptors[name], function(texture) {
// 		assets.textures[name] = texture;
// 		return notify();
// 	});
// });


// var plyLoader = new THREE.PLYLoader();
// var objLoader = new THREE.OBJLoader();

// var meshURLs = [];
// Object.keys(geometryDescriptors).forEach(function(name) {
// 	var url = geometryDescriptors[name];
// 	var infos = url.split('.');
// 	var extension = infos[infos.length-1];
// 	if (extension == 'ply') {
// 		plyLoader.load(url, function(geometry){
// 			assets.geometries[name] = geometry;
// 			return notify();
// 		});
// 	} else if (extension == 'obj') {
// 		objLoader.load(url, function(geometry){
// 			assets.geometries[name] = geometry;
// 			return notify();
// 		});
// 	}
// });
