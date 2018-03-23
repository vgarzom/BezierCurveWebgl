function animate() {
  app.timeNow = new Date().getTime();
  app.elapsed = app.timeNow - app.lastTime;
  app.lastTime = app.timeNow;
}

function tick() {
  requestAnimFrame(tick);
  app.curve.lutindex ++;
  if (app.curve.lutindex >= app.curve.max){
    app.curve.lutindex = 0;
  }

  app.airplane.position = app.airplane.speed*(app.lastTime - app.airplane.startTime);
  if (app.airplane.position > app.curve.length){
    app.airplane.position = 0;
    app.airplane.startTime = app.lastTime;
  }

  app.airplane.speed = app.sliders.speed.value/100000;
  app.sliders.speedLabel.innerHTML = 'Velocidad ('+app.airplane.speed+'):';

  

  app.drawScene();
  animate();
}

function webGLStart( meshes ) {
  app.meshes = meshes;
  canvas = document.getElementById("mycanvas");
  initCurve();
  initGL(canvas);
  initShaders();
  initBuffers();
  initPointerLock();
  initTextures();
  initInterfaceListeners();

  gl.clearColor(123.0/255.0, 208.0/255.0, 255.0/255.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  tick();
}

window.onload = function(){
  OBJ.downloadMeshes({
    'airplane_body': 'models/airplane_body.obj',
    'airplane_elisa': 'models/airplane_elisa.obj',
    'sphere': 'models/boulder.obj',
    },
    webGLStart
  );
};
