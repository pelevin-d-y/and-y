
import {glMatrix,mat4,mat3,quat} from "gl-Matrix"
import {vertex_shader_source,frag_shader_source} from "./shaders.js"
import {cube_obj} from "./cube.js"
import fallbackBackground  from "../images/main-bg.png"

const canvas = document.querySelector("#backCanvas");
var gl = canvas.getContext ? canvas.getContext("webgl") : fallback();
function fallback(){
  canvas.style = "background: url('"+fallbackBackground+"') no-repeat center/cover"
  return null;
}


var shaderProgram;


// const params
const shaderLocations={}
const VERTEX_LENGTH_FLOAT = 12;
const translationSpeed = -0.0014; //units per ms
const rotationSpeed = 0.025; // degress per ms
const fovy = 50;
const distanceFromEye = 10;
const viewPlaneHeight = 1.3* (2*distanceFromEye/Math.tan(glMatrix.toRadian(90-fovy/2)));
const viewPlaneLow = -viewPlaneHeight/2;
const viewPlaneHigh = -viewPlaneLow;
const cubeScale = 1.8;
const cubeScaleVec = [cubeScale,cubeScale,cubeScale]
const instances=[
  // y<0  -  right
  {x: 0, y:6.3, z:2, angle:10},
  {x: 0, y:2.2, z:1.7, angle:90},
  {x: 0, y:5, z:-2, angle:-40},
  {x: 0, y:8.5, z:-4.5, angle:-50},
  {x: 0, y:4.5, z:5.5, angle:20},
  {x: 0, y:-0.5, z:-0.5, angle:60},
  {x: 0, y:1.5, z:-4, angle:30},
  {x: 0, y:-3, z:2.7, angle:-45},
  {x: 0, y:-4, z:-2.5, angle:34},
  {x: 0, y:-7, z:0, angle:0},
  {x: 0, y:-7.7, z:4.5, angle:-34},
  {x: 0, y:-6.6, z:-4.8, angle:-67},
  {x: 0, y:-2, z:6, angle:250},
];
// helper variables
var lastTime = 0;
var handleResize = true;
var transformMatrix = mat4.create();
var inverseMatrix = mat3.create();
var projectionMatrix = mat4.create();
var viewMatrix = mat4.create();
var fullProjMat = mat4.create();
var q = quat.create();






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

  lastTime = Date.now();
  window.addEventListener('resize',()=>{ handleResize = true},{capture:true,passive:true});
  window.requestAnimationFrame(calculateFrame);
}



function drawInstance(instance,translated,rotated){

  instance.angle = rotated+instance.angle - Math.round((rotated+instance.angle)/360)*360;
  instance.z = translated+instance.z - Math.round((translated+instance.z)/viewPlaneHeight)*viewPlaneHeight;

  quat.fromEuler(q,0,instance.angle,  instance.angle);
  mat4.fromRotationTranslationScale(transformMatrix,q,[instance.x,instance.y,instance.z], cubeScaleVec);
  mat3.normalFromMat4(inverseMatrix,transformMatrix);

  gl.uniformMatrix4fv(shaderLocations.transformModelLocation,false,transformMatrix);
  gl.uniformMatrix3fv(shaderLocations.transformNormalLocation,false,inverseMatrix)

  gl.drawElements(gl.TRIANGLES,cube_obj.index_count,gl.UNSIGNED_INT,0);
}


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


     mat4.perspective(projectionMatrix,glMatrix.toRadian(fovy),canvas.width/canvas.height,0.1,50);
     mat4.perspective(projectionMatrix,glMatrix.toRadian(fovy),canvas.width/canvas.height,0.1,50);
     mat4.lookAt(viewMatrix,[-distanceFromEye,0,0],[0,0,0],[0,0,1]);
     mat4.mul(fullProjMat,projectionMatrix,viewMatrix);
     //gl.uniformMatrix4fv(shaderLocations.transformViewlLocation,false,viewMatrix);
     gl.uniformMatrix4fv(shaderLocations.transformProjectionlLocation,false,fullProjMat);
   }
   gl.viewport(0, 0, canvas.width,canvas.height);

 }

function calculateFrame(now){
   if(handleResize){
    resize(canvas);
    handleResize = false;
  }

   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
   const timePassed = now - lastTime;
   const translated = timePassed * translationSpeed;
   const rotated =  timePassed * rotationSpeed;
   instances.forEach((inst)=> drawInstance(inst,translated,rotated));
   gl.flush();

   lastTime = now;
   requestAnimationFrame(calculateFrame);
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

  mat4.perspective(projectionMatrix,glMatrix.toRadian(fovy),canvas.width/canvas.height,0.1,50);
  mat4.lookAt(viewMatrix,[-distanceFromEye,0,0],[0,0,0],[0,0,1]);
  mat4.mul(fullProjMat,projectionMatrix,viewMatrix);
  //gl.uniformMatrix4fv(shaderLocations.transformViewlLocation,false,viewMatrix);
  gl.uniformMatrix4fv(shaderLocations.transformProjectionlLocation,false,fullProjMat);
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
