function initInterfaceListeners() {
    app.sliders.speed = document.getElementById("speedRange");
    app.sliders.speedLabel = document.getElementById('speedLabel');

    document.getElementById("first").onclick = function () { app.camera.selected = FIRST };
    document.getElementById("third").onclick = function () { app.camera.selected = THIRD };
    document.getElementById("long_shot").onclick = function () { 
        app.camera.selected = LONGSHOT;
        app.camera.position = [0,10.0,0];
        app.camera.pitch = 90;
        app.camera.heading = 0;
        window.alert('Con la cámara Long-shot puedes modificar la curva arrastrando los puntos de control (Esferas mas grandes) con el mouse')
    };
}
