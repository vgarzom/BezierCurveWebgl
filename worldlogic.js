
function drawWorld(){
  //roomCollisionCheck();
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.01, 1000.0, app.pMatrix);
  //mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.01, 1000.0, app.pMatrix);
  vec3.negate( app.camera.position, app.camera.inversePosition )
  
  mat4.identity( app.mvMatrix )
  // camera position and rotations
  mat4.rotate( app.mvMatrix, degToRad( app.camera.pitch ), [1,0,0] );
  // account for pitch rotation and light down vector
  mat4.rotate( app.mvMatrix, degToRad( app.camera.heading ), [0,1,0] );
  mat4.translate( app.mvMatrix, app.camera.inversePosition );
  
  gl.useProgram( shaderProgram );

  setUniforms();
      
      //Dibujamos el punto de partida
      mvPushMatrix();
        mat4.translate( app.mvMatrix, app.curve.startPoint );
        mat4.scale(app.mvMatrix, [0.3, 0.3, 0.3], app.mvMatrix);
        drawObject( app.models.sphere, 0.5, [165.0/255.0, 0.0, 0.0, 1.0] );
      mvPopMatrix();
      //Dibujamos el punto de finalización
      mvPushMatrix();
        mat4.translate( app.mvMatrix, app.curve.endPoint );
        mat4.scale(app.mvMatrix, [0.3, 0.3, 0.3], app.mvMatrix);
        drawObject( app.models.sphere, 0.5, [165.0/255.0, 0.0, 0.0, 1.0] );
      mvPopMatrix();

      //Dibujamos los puntos de control
      mvPushMatrix();
        mat4.translate( app.mvMatrix, app.curve.controlPoint1 );
        mat4.scale(app.mvMatrix, [0.3, 0.3, 0.3], app.mvMatrix);
        drawObject( app.models.sphere, 0.5, [165.0/255.0, 0.0, 0.0, 1.0] );
      mvPopMatrix();
      mvPushMatrix();
        mat4.translate( app.mvMatrix, app.curve.controlPoint2);
        mat4.scale(app.mvMatrix, [0.3, 0.3, 0.3], app.mvMatrix);
        drawObject( app.models.sphere, 0.5, [165.0/255.0, 0.0, 0.0, 1.0] );
      mvPopMatrix();

      mvPushMatrix();
        for (var i = 0; i < 1; i+=0.1){
          mvPushMatrix();
            var l = app.curve.curve.get(i);;
            mat4.translate( app.mvMatrix, [l.x, l.y, l.z] );
            mat4.scale(app.mvMatrix, [0.1, 0.1, 0.1], app.mvMatrix);
            drawObject( app.models.sphere, 0, [165.0/255.0, 0.0, 0.0, 1.0] );
          mvPopMatrix();
        }
      mvPopMatrix();
      
      mvPushMatrix();
        var t = app.airplane.position / app.curve.length;
        var pt = app.curve.curve.get(t);
        var dv = app.curve.curve.derivative(t);
        mat4.translate( app.mvMatrix, [pt.x, pt.y, pt.z] );
        var co = dv.z - pt.z;
        var ca = dv.x - pt.x;
        var angle = 0;

        

        if (dv.x < pt.x)
          angle = degToRad(270) - Math.atan(co/ca);
        else
          angle = degToRad(90) - Math.atan(co/ca)

          //Actualizamos la vista de la camara
        switch(app.camera.selected){
          case FIRST:
            app.camera.position = [pt.x, pt.y + 0.5, pt.z];
            app.camera.pitch = 10;
            app.camera.heading = 180 - radToDeg(angle);
          break;
          case THIRD:
            app.camera.position = [pt.x - 3*Math.sin(angle), pt.y + 1, pt.z - 3*Math.cos(angle)];
              app.camera.pitch = 0;
              app.camera.heading = 180 - radToDeg(angle);
          break;
          case LONGSHOT:
          break;
        }
        
        mat4.rotate( app.mvMatrix, angle, [0,1,0] );
        drawObject( app.models.airplane_body, 0.1, [165.0/255.0, 0.0, 0.0, 1.0]  );
        app.animations.elisa.rotation += app.animations.elisa.speed;
        
        mat4.translate( app.mvMatrix, [0.0, 0.2, 0.87] );
        mat4.rotate( app.mvMatrix, app.animations.elisa.rotation, [0,0,1] );
        drawObject( app.models.airplane_elisa, 1, [0.0, 0.0, 0.0, 1.0] );
      mvPopMatrix();

  if( app.animate ){
    app.animations.currentAnimation();
  }
}

app.drawScene = drawWorld;
