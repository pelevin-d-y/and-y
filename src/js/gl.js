
import {glMatrix,mat4,mat3,quat} from "gl-Matrix"
import {vertex_shader_source,frag_shader_source} from "./shaders.js"
import {cube_obj} from "./cube.js"


const canvas = document.querySelector("#backCanvas");
var gl = canvas.getContext ? canvas.getContext("webgl") : fallback();


var shaderLocations={}
var shaderProgram;
const VERTEX_LENGTH_FLOAT = 12;

function fallback(){
  return null;

}

function main(){
  if(!gl)
    return;
  // get VERSION
  console.log(gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
  console.log(gl.getParameter(gl.VERSION));
  // this is to use UNSIGNED_INT in drawElements --- to get Ushort(16bit unsigned int) we need to pack it beforehand
  var ext = gl.getExtension('OES_element_index_uint');
  // set clear color and depth values
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clearDepth(1.0);
  //enable z-buffer
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  // load, compile, link shaders
  shaderProgram = initShaderProgram(vertex_shader_source,frag_shader_source);
  // set as active
  gl.useProgram(shaderProgram);
  // locate all uniforms
  locateUniforms();
  setConstShaderUniforms();
  loadCube();


  gl.bindBuffer(gl.ARRAY_BUFFER, cube_obj.VBO);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube_obj.IBO);
  window.requestAnimationFrame(drawCube);
}


 var transformMatrix = mat4.create();
 var inverseMatrix = mat3.create();
 var projectionMatrix = mat4.create();
 var viewMatrix = mat4.create();
 var q = quat.create();
 let lastNow=0;


 function resize(canvas) {
   // Lookup the size the browser is displaying the canvas.
  var realToCSSPixels = window.devicePixelRatio;
   var displayWidth  = Math.floor(canvas.clientWidth  * realToCSSPixels);
   var displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels);

   // Check if the canvas is not the same size.
   if (canvas.width  != displayWidth ||
       canvas.height != displayHeight) {

     // Make the canvas the same size
     canvas.width  = displayWidth;
     canvas.height = displayHeight;


     mat4.perspective(projectionMatrix,glMatrix.toRadian(90),canvas.width/canvas.height,0.1,50);
     mat4.lookAt(viewMatrix,[-5,0,0],[0,0,0],[0,0,1]);

     let transformViewlLocation = gl.getUniformLocation(shaderProgram, "transform_view");
     gl.uniformMatrix4fv(transformViewlLocation,false,viewMatrix);

     let transformProjectionlLocation = gl.getUniformLocation(shaderProgram, "transform_projection");
     gl.uniformMatrix4fv(transformProjectionlLocation,false,projectionMatrix);




   }
   gl.viewport(0, 0, canvas.width,canvas.height);
 }

function drawCube(now){
   resize(canvas);
   let period  = 100;
   let time= now*0.001; // in seconds
   let rotationSpeed = 50;// degrees in seconds
   let translateSpeed = 1; // unit in seconds
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   quat.fromEuler(q,0,-30,rotationSpeed*time);
   mat4.fromRotationTranslationScale(transformMatrix,q,[0,0,0],[2,2,2]);
   mat3.normalFromMat4(inverseMatrix,transformMatrix);

   // pass matrixes to gpu
   gl.uniformMatrix4fv(shaderLocations.transformModelLocation,false,transformMatrix);
   gl.uniformMatrix3fv(shaderLocations.transformNormalLocation,false,inverseMatrix)



   gl.drawElements(gl.TRIANGLES,cube_obj.index_count,gl.UNSIGNED_INT,0);

   gl.flush();
   lastNow = now;
   requestAnimationFrame(drawCube);
}

function locateUniforms(){
  shaderLocations.transformModelLocation = gl.getUniformLocation(shaderProgram, "transform_model");
  shaderLocations.transformNormalLocation = gl.getUniformLocation(shaderProgram,"transform_normal");
  shaderLocations.transformViewlLocation = gl.getUniformLocation(shaderProgram, "transform_view");
  shaderLocations.transformProjectionlLocation = gl.getUniformLocation(shaderProgram, "transform_projection");
  shaderLocations.transformViewPositionLocation = gl.getUniformLocation(shaderProgram, "transform_viewPosition");
  shaderLocations.lightPositionLocation = gl.getUniformLocation(shaderProgram, "light_position");
  shaderLocations.lightAmbientLocation = gl.getUniformLocation(shaderProgram, "light_ambient");
  shaderLocations.lightDiffuseLocation = gl.getUniformLocation(shaderProgram, "light_diffuse");
  shaderLocations.lightSpecularLocation = gl.getUniformLocation(shaderProgram, "light_specular");
  shaderLocations.lightAttenuationLocation = gl.getUniformLocation(shaderProgram, "light_attenuation");
  shaderLocations.materialAmbientLocation = gl.getUniformLocation(shaderProgram, "material_ambient");
  shaderLocations.materialDiffuseLocation = gl.getUniformLocation(shaderProgram, "material_diffuse");
  shaderLocations.materialSpecularlLocation = gl.getUniformLocation(shaderProgram, "material_specular");
  shaderLocations.materialEmissionLocation = gl.getUniformLocation(shaderProgram, "material_emission");
  shaderLocations.materialShininessLocation = gl.getUniformLocation(shaderProgram, "material_shininess");
}

function setConstShaderUniforms(){

  mat4.perspective(projectionMatrix,glMatrix.toRadian(90),canvas.width/canvas.height,0.1,50);
  mat4.lookAt(viewMatrix,[-5,0,0],[0,0,0],[0,0,1]);

  gl.uniformMatrix4fv(shaderLocations.transformViewlLocation,false,viewMatrix);
  gl.uniformMatrix4fv(shaderLocations.transformProjectionlLocation,false,projectionMatrix);
  gl.uniform3fv(shaderLocations.transformViewPositionLocation,[-5,0,0]);
  gl.uniform4fv(shaderLocations.lightPositionLocation,[-5,0,3,1]);
  // frag
  // параметры точечного источника освещения
  // uniform vec4 light_ambient;
  gl.uniform4fv(shaderLocations.lightAmbientLocation,[0.5,0.5,0.5,1]);
  // uniform vec4 light_diffuse;
  gl.uniform4fv(shaderLocations.lightDiffuseLocation,[0.9,0.9,0.9,1]);
  // uniform vec4 light_specular;
  gl.uniform4fv(shaderLocations.lightSpecularLocation,[0.4,0.4,0.4,1]);
  // uniform vec3 light_attenuation;
  gl.uniform3fv(shaderLocations.lightAttenuationLocation,[0,0,0]);

  //  параметры материала
  // uniform vec4 material_ambient;
  gl.uniform4fv(shaderLocations.materialAmbientLocation,[1,1,1,1]);
  // uniform vec4 material_diffuse;
  gl.uniform4fv(shaderLocations.materialDiffuseLocation,[1,1,1,1]);
  // uniform vec4 material_specular;
  gl.uniform4fv(shaderLocations.materialSpecularlLocation,[1,1,1,1]);
  // uniform vec4 material_emission;
  gl.uniform4fv(shaderLocations.materialEmissionLocation,[0,0,0,1]);
  // uniform float material_shininess;
  gl.uniform1f(shaderLocations.materialShininessLocation,0);

}

function initShaderProgram(vsSource, fsSource) {
  const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.log('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

function loadShader(type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function colorCubeOrange(cube_obj){
  cube_obj.vertices.forEach( (v)=>{ v.color.r = 0.94901;v.color.g = 0.44705;v.color.b = 0.21960784313; })
}

function loadCube(){

  colorCubeOrange(cube_obj);
  pack_model(cube_obj);
  var VBO = gl.createBuffer();
  var IBO =gl.createBuffer();
  cube_obj.VBO = VBO;
  cube_obj.IBO = IBO;
  cube_obj.index_count = cube_obj.indeces.length;
  gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IBO);
  gl.bufferData(gl.ARRAY_BUFFER,cube_obj.packed_array,gl.STATIC_DRAW);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,cube_obj.packed_indeces,gl.STATIC_DRAW);

  const coordsLocation = gl.getAttribLocation(shaderProgram, 'coord');
  gl.vertexAttribPointer(coordsLocation, 4, gl.FLOAT, false, 48, 0);
  gl.enableVertexAttribArray(coordsLocation);

  const normLocation = gl.getAttribLocation(shaderProgram, 'norm');
  gl.vertexAttribPointer(normLocation, 3, gl.FLOAT, true, 48, 16);
  gl.enableVertexAttribArray(normLocation);

  const texCoordLocation = gl.getAttribLocation(shaderProgram, 'texCoord');
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 48, 28);
  gl.enableVertexAttribArray(texCoordLocation);


  const colorCoordLocation = gl.getAttribLocation(shaderProgram, 'color');
  gl.vertexAttribPointer(colorCoordLocation, 3, gl.FLOAT, false, 48, 36);
  gl.enableVertexAttribArray(colorCoordLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

}

function pack_model(obj){
  let packed_array = new Float32Array(VERTEX_LENGTH_FLOAT*obj.vertices.length);
  var ind = 0;
  for (var i = 0; i < obj.vertices.length; i++) {
    let vrtx = obj.vertices[i];
    //packing array, we could def pack it before shipping
    //packing coords
    packed_array[ind++]=vrtx.position.x;
    packed_array[ind++]=vrtx.position.y;
    packed_array[ind++]=vrtx.position.z;
    packed_array[ind++]=1.0; // W
    //packing normal
    packed_array[ind++]=vrtx.normal.x;
    packed_array[ind++]=vrtx.normal.y;
    packed_array[ind++]=vrtx.normal.z;
    //packing texture coords
    packed_array[ind++]=vrtx.texCoord.x;
    packed_array[ind++]=vrtx.texCoord.y;
    //packing color
    packed_array[ind++]=vrtx.color.r;
    packed_array[ind++]=vrtx.color.g;
    packed_array[ind++]=vrtx.color.b;
  }

  obj.packed_array = packed_array;
  obj.packed_indeces = Uint32Array.from(obj.indeces);

}


main();
