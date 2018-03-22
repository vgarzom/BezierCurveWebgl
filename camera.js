function initPointerLock() {
  canvas.addEventListener("mousedown", validateSelection, false);
  canvas.addEventListener("mouseup", deselectPoint, false);
  canvas.addEventListener("mousemove", moveSelectedPoint, false);
}

function moveSelectedPoint(event){
  if (app.selectedPoint === null){
    return;
  }
  updateCursorPosition();
  app.selectedPoint[0] = app.cursor.x;
  app.selectedPoint[2] = app.cursor.y;
  app.updateCurve();
}

function deselectPoint(event){
  app.selectedPoint = null;
}

function validateSelection(event)
{
  

  // pos is in pixel coordinates for the canvas.
  // so convert to WebGL clip space coordinates
  updateCursorPosition();
  var selectionDistance = 0.15;
  if (Math.abs(app.curve.startPoint[X] - app.cursor.x) < selectionDistance && Math.abs(app.curve.startPoint[Z] - app.cursor.y) < selectionDistance){
    app.selectedPoint = app.curve.startPoint;
  }else if (Math.abs(app.curve.endPoint[X] - app.cursor.x) < selectionDistance && Math.abs(app.curve.endPoint[Z] - app.cursor.y) < selectionDistance){
    app.selectedPoint = app.curve.endPoint;
  }else if (Math.abs(app.curve.controlPoint1[X] - app.cursor.x) < selectionDistance && Math.abs(app.curve.controlPoint1[Z] - app.cursor.y) < selectionDistance){
    app.selectedPoint = app.curve.controlPoint1;
  }else if (Math.abs(app.curve.controlPoint2[X] - app.cursor.x) < selectionDistance && Math.abs(app.curve.controlPoint2[Z] - app.cursor.y) < selectionDistance){
    app.selectedPoint = app.curve.controlPoint2;
  }
}

function updateCursorPosition() {
  const pos = getNoPaddingNoBorderCanvasRelativeMousePosition(event, canvas);
  app.cursor.x = (0.016*pos.x) - 4.04 + app.camera.position[X];
  app.cursor.y = (0.016*pos.y) - 4.04 - app.camera.position[Z];
}
function getRelativeMousePosition(event, target) {
  target = target || event.target;
  var rect = target.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}

// assumes target or event.target is canvas
function getNoPaddingNoBorderCanvasRelativeMousePosition(event, target) {
  target = target || event.target;
  var pos = getRelativeMousePosition(event, target);

  pos.x = pos.x * target.width  / target.clientWidth;
  pos.y = pos.y * target.height / target.clientHeight;

  return pos;  
}

function fullscreenChange() {
  console.log('Full screen change');
  if ( document.webkitFullscreenElement === canvas ||
       document.mozFullscreenElement === canvas ||
       document.mozFullScreenElement === canvas ) { // Older API upper case 'S'.
    // Element is fullscreen, now we can request pointer lock
    canvas.requestPointerLock = canvas.requestPointerLock    ||
                                canvas.mozRequestPointerLock ||
                                canvas.webkitRequestPointerLock;
    canvas.requestPointerLock();
    gl.viewportWidth = canvas.width = window.innerWidth;
    gl.viewportHeight = canvas.height = window.innerHeight;
  }
  else{
    gl.viewportWidth = canvas.width = 500;
    gl.viewportHeight = canvas.height = 500;
  }
}


/*
function moveCallback( e ){
  if( !app.camera.disable ){
    var movementX = e.movementX       ||
                    e.mozMovementX    ||
                    e.webkitMovementX ||
                    0,
        movementY = e.movementY       ||
                    e.mozMovementY    ||
                    e.webkitMovementY ||
                    0;

  app.camera.heading += movementX / app.camera.sensitivity;
  app.camera.pitch += movementY / app.camera.sensitivity;

    if( app.camera.pitch < -90 )
      app.camera.pitch = -90;
    if( app.camera.pitch > 90 )
      app.camera.pitch = 90;
    if( app.camera.heading < -180 )
      app.camera.heading += 360
    if( app.camera.heading > 180 )
      app.camera.heading -= 360
  }
  
}
*/
function cameraKeyDownHandler( e ){
  console.log('Key pressed! -> '+ e);
  app.keys.pressed[ e.which ] = true;
  if( e.which === 16 ){
    app.camera.speed = app.camera.runSpeed;
  }
  // f
  if( e.which === 70 ){
    app.hasFlashlight = !app.hasFlashlight;
  }
  // e
  if( e.which === 69  && !app.animate && vec3.length( app.camera.position ) < 1 ){
    startAnimations();
  }
}

function cameraKeyUpHandler( e ){
  app.keys.pressed[ e.which ] = false;
  if( e.which == 16 ){
    app.camera.speed = app.camera.walkSpeed;
  }
}

function cameraShake(){
  app.camera.shakeTimer = app.camera.shakeTimer > Math.PI * 2 ? 0 : app.camera.shakeTimer + 0.01;
  app.camera.heading += app.camera.shakeAmplitude * Math.sin( app.camera.shakeTimer * app.camera.shakeFrequency );
  app.camera.pitch += app.camera.shakeAmplitude * Math.sin( app.camera.shakeTimer * app.camera.shakeFrequency );
}

function cameraMove(){
  var distance = app.elapsed * app.camera.speed;
  var camX = 0, camZ = 0;
  var pitchFactor = 1;//Math.cos( degToRad( app.camera.pitch ) );
  // forward
  if( app.keys.pressed[ app.keys.W ] ){
    camX += distance * Math.sin( degToRad( app.camera.heading ) ) * pitchFactor;
    camZ += distance * Math.cos( degToRad( app.camera.heading ) ) * pitchFactor * -1.0;
  }
  // backward
  if( app.keys.pressed[ app.keys.S ] ){
    camX += distance * Math.sin( degToRad( app.camera.heading ) ) * pitchFactor * -1.0;
    camZ += distance * Math.cos( degToRad( app.camera.heading ) ) * pitchFactor;
  }
  // strafing right
  if( app.keys.pressed[ app.keys.D ] ){
    camX += distance * Math.cos( degToRad( app.camera.heading ) );
    camZ += distance * Math.sin( degToRad( app.camera.heading ) );
  }
  // strafing left
  if( app.keys.pressed[ app.keys.A ] ){
    camX += -distance * Math.cos( degToRad( app.camera.heading ) );
    camZ += -distance * Math.sin( degToRad( app.camera.heading ) );
  }

  if( camX > distance )
    camX = distance;
  if( camX < -distance )
    camX = -distance;
  if( camZ > distance )
    camZ = distance;
  if( camZ < -distance )
    camZ = -distance;

  app.camera.position[ X ] += camX;
  app.camera.position[ Z ] += camZ;
}
