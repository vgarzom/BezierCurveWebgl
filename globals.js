
// globals

// Enums
var X = 0, Y = 1, Z = 2, H = 3, P = 4;
// gl context
var gl;
// the canvas we're working with
var canvas;
// application var holder
var app = {};
  // mesh holder
  app.meshes = {};
  // model holder
  app.models = {};
  // this model has a single texture image,
  // so there is no need to have more than one
  // texture holder
  app.textures = {};

  app.curve = {};
  app.curve.startPoint = [];
  app.curve.endPoint = [];
  app.curve.controlPoint1 = [];
  app.curve.controlPoint2 = [];
  app.updateCurve;
  app.cursor = {
    x: 0,
    y: 0
  };

  app.selectedPoint = null;
  // camera
  app.camera = {};
  app.camera.position = [0,10.0,0];
  app.camera.inversePosition = vec3.create();
  app.camera.heading = 0;
  app.camera.pitch = 90;
  app.camera.walkSpeed = 0.005;
  app.camera.speed = app.camera.walkSpeed;
  app.camera.sensitivity = 10;
  app.camera.disable = false;
  
  // which function to use to draw
  app.drawScene;

  app.mvMatrix = mat4.create();
  app.mvMatrixStack = [];
  app.pMatrix = mat4.create();
  // animation references
  app.lastTime = 0;

  // animations
  app.animate = false;
  app.animations = {};
  app.animations.currentAnimation = 0;
    // animation elisa airplane
    app.animations.elisa = {};
    app.animations.elisa.speed = 0.5;
    app.animations.elisa.rotation = 0;

app.airplane = {speed : 0.0001,
                startTime : 0,
                position: 0
              };

var shaderProgram;
var light = 0;
var angle = 0;
