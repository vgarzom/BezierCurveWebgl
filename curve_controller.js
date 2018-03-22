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

function getNoPaddingNoBorderCanvasRelativeMousePosition(event, target) {
  target = target || event.target;
  var pos = getRelativeMousePosition(event, target);

  pos.x = pos.x * target.width  / target.clientWidth;
  pos.y = pos.y * target.height / target.clientHeight;

  return pos;  
}