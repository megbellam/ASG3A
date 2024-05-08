// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;

  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

  

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;   //use color

    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0); //use uv debug color

    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV); //use texture0

    } else {
      gl_FragColor = vec4(1,.2,.2,1); // error, put redish
    }

  }`

//Global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_whichTexture;

//get the canvas and gl context
function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

//compile the shader programs, attach the javascript variables to the GLSL variables
function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  //Get the storage location of u_Sampler
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  // Set the initial value of this matrix to identity
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}

//Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global variables related to UI elements
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize=5;
let g_selectedType=POINT;
let g_selectedSegments=10;
let g_globalAngle = 0;
let g_yellowAngle = 0;
let g_magentaAngle = 0;
let g_yellowAnimation = false;
let g_magentaAnimation = false;

// Set up actions for the HTML UI elements
function addActionsForHtmlUI(){
    // Button Events (Shape Type)
    document.getElementById('green').onclick = function() { g_selectedColor = [0.0,1.0,0.0,1.0]; };
    document.getElementById('red').onclick   = function() { g_selectedColor = [1.0,0.0,0.0,1.0]; };
    document.getElementById('clearButton').onclick   = function() { g_shapesList=[]; renderAllShapes();};

    document.getElementById('animationYellowOffButton').onclick   = function() { g_yellowAnimation=false;};
    document.getElementById('animationYellowOnButton').onclick   = function() { g_yellowAnimation=true;};
    document.getElementById('animationMagentaOffButton').onclick   = function() { g_magentaAnimation=false;};
    document.getElementById('animationMagentaOnButton').onclick   = function() { g_magentaAnimation=true;};

    document.getElementById('pointButton').onclick   = function() {g_selectedType=POINT};
    document.getElementById('triButton').onclick     = function() {g_selectedType=TRIANGLE};
    document.getElementById('circleButton').onclick  = function() {g_selectedType=CIRCLE};

    document.getElementById('magentaSlide').addEventListener('mousemove',   function() { g_magentaAngle = this.value; renderAllShapes();});
    document.getElementById('yellowSlide').addEventListener('mousemove',   function() { g_yellowAngle = this.value; renderAllShapes();});
    document.getElementById('angleSlide').addEventListener('mousemove',   function() { g_globalAngle = this.value; renderAllShapes();});

    //Color slider Events
    document.getElementById('redSlide').addEventListener('mouseup',   function() { g_selectedColor[0] = this.value/100;});
    document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100;});
    document.getElementById('blueSlide').addEventListener('mouseup',  function() { g_selectedColor[2] = this.value/100;});

    // Size Slider Events
    document.getElementById('sizeSlide').addEventListener('mouseup',  function() { g_selectedSize = this.value;});

    // Number of Segments in a Circle Slider
    document.getElementById('segcountSlide').addEventListener('mouseup',  function() { g_selectedSegments = this.value;});
}

function initTextures() {
  //var texture = gl.createTexture(); //Create a texture object
  //if (!texture) {
  //  console.log('Failed to create the texture object');
  //  return false;
  //}

  var image = new Image(); //Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ sendImageToTEXTURE0(image);};
  //Tell the browser to load an image
  image.src = 'sky.jpg';

  //Add more texture loading later if we want


  return true;
}

function sendImageToTEXTURE0(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); //Flip the image's y axis
  //Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  //Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  //Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  //Set the texture image
  // (targer, level, internalformat, format, type, pixels)
  // Documentation at https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  //Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);

  //console.log('finished loadTexture');
}

function main() {

  //Set up canvas and gl variables
  setupWebGL();
  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  //Setup actions for the HTML UI variables
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  //canvas.onmousedown = click;
  //canvas.onmousemove = function(ev) { if (ev.buttons == 1) { click(ev) } };

  document.onkeydown = keydown;

  initTextures();
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);
  //renderAllShapes();
  requestAnimationFrame(tick);

}

var g_shapesList = [];

function click(ev) {
  //Extract the event click and return it in WebGL coordinates
  let [x,y] = convertCoordinatesEventToGL(ev);

  // Create and store the new point
  let point;
  if (g_selectedType == POINT){
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
  }
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  point.segments = g_selectedSegments;
  g_shapesList.push(point);
  renderAllShapes();
}

function drawMyPicture(){
  let [x,y] = [0.1,0.1];
  let point;
  //g_selectedColor = [0.0,1.0,0.0,1.0];
  point = new Picture();
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = 10;
  g_shapesList.push(point);

  renderAllShapes();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function doAwesomeness(){
  let [x,y] = [0.1,0.1];
  let point;
  //g_selectedColor = [0.0,1.0,0.0,1.0];
  point = new Picture();
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = 10;
  g_shapesList.push(point);
  renderAllShapes();

  sleep(1000).then(() => {
  point = new Picture1();
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = 10;
  g_shapesList.push(point);
  renderAllShapes();
  });
}

//Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();
  
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  
    return([x, y]);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

//Called by browser repeatedly whenever its time
function tick() {
  g_seconds = performance.now()/1000.0 - g_startTime;
  updateAnimationAngles();
  renderAllShapes();
  requestAnimationFrame(tick);
}

//Update the angles of everything if currently animated
function updateAnimationAngles(){
  if (g_magentaAnimation){
    g_magentaAngle = (45*Math.sin(g_seconds));
  }
  if (g_yellowAnimation){
    g_yellowAngle = (45*Math.sin(g_seconds));
  }
}

//handling the keyboard
function keydown(ev){
  if (ev.keyCode==39) { //Right arrow
    g_eye[0] += 0.2;
  } else
  if (ev.keyCode == 37) { //Left arrow
    g_eye[0] -= 0.2;
  }

  renderAllShapes();
  console.log(ev.keyCode);
}

var g_eye = [0,0,3];
var g_at = [0,0,-100];
var g_up = [0,1,0];
var g_camera = new Camera();

//based on some data structure that is holding all the information about what to draw, 
//actually draw all the shapes.
function renderAllShapes(){

    // Check the time at the start of this function
    var startTime = performance.now();

    //pass the projection matrix
    var projMat=new Matrix4();
    projMat.setPerspective(90, canvas.width/canvas.height, .1,100 );
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    //pass the view matrix
    var viewMat=new Matrix4();
    viewMat.setLookAt(
      g_eye[0],g_eye[1],g_eye[2], 
      g_at[0], g_at[1],g_at[2], 
      g_up[0],g_up[1],g_up[2]); //(eye, at, up)

      //g_eye[0],g_eye[1],g_eye[2], 
      //g_at[0], g_at[1],g_at[2], 
      //g_up[0],g_up[1],g_up[2]); //(eye, at, up)
      //g_camera.eye.x,g_camera.eye.y, g_camera.eye.z,
      //g_camera.at.x,g_camera.at.y, g_camera.at.z,
      //g_camera.up.x,g_camera.up.y, g_camera.up.z); 
      //viewMat.setLookAt(0,0,-1, 0,0,0, 0,1,0); //(eye, at, up)

    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    // Clear <canvas>
     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
     gl.clear(gl.COLOR_BUFFER_BIT);

    //var len = g_points.length;
   // var len = g_shapesList.length;
   // for(var i = 0; i < len; i++) {
   //   g_shapesList[i].render();
   // }

   //Draw the floor
   var floor = new Cube();
   floor.color = [1.0, 0.0, 0.0, 1.0];
   floor.textureNum=-1;
   floor.matrix.translate(0, -.75, 0.0);
   floor.matrix.scale(10,0,10);
   floor.matrix.translate(-.5, 0, -0.5);
   floor.render();

   //Draw the sky
   var sky = new Cube();
   sky.color = [1.0,0.0,0.0,1.0];
   sky.textureNum=0;
   sky.matrix.scale(50,50,50);
   sky.matrix.translate(-.5, -.5, -0.5);
   sky.render();

   //Draw the Body Cube
   var body = new Cube();
   body.color = [1.0,0.0,0.0,1.0];
   body.textureNum = 0;
   body.matrix.translate(-.25,-.75,0.0);
   body.matrix.rotate(-5,1,0,0);
   body.matrix.scale(0.5,.3,.5);
   body.render();

   //Draw a left arm
   var leftArm = new Cube();
   leftArm.color = [1,1,0,1];
   //Rotates up and down, not sideways
   leftArm.matrix.setTranslate(0,-.5,0.0);
   leftArm.matrix.rotate(-g_yellowAngle,0,0,1);
   var yellowCoordinatesMat = new Matrix4(leftArm.matrix);
   leftArm.matrix.scale(0.25,.7,.5);
   leftArm.matrix.translate(-.5,0,0);
   leftArm.render();

   //Purple tail end
   var box = new Cube();
   box.color = [1,0,1,1];
   box.textureNum = -2;
   box.matrix = yellowCoordinatesMat;
   box.matrix.translate(0,0.65,0);
   box.matrix.rotate(g_magentaAngle,0,0,1);
   box.matrix.scale(0.3,.3,.3);
   box.matrix.translate(-.5,0,-0.001);
   box.render();

    // Check the time at the end of the function, and show on web page
    var duration = performance.now() - startTime;
}

//Set the text of a HTML element
function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}