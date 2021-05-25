var firebaseConfig = {
    apiKey: "AIzaSyAt9SffQbYI2mDHh1nv6GdI5aAisYD4QL0",
    authDomain: "gcw-pf.firebaseapp.com",
    projectId: "gcw-pf",
    storageBucket: "gcw-pf.appspot.com",
    messagingSenderId: "270321268780",
    appId: "1:270321268780:web:68b32fb6bf2b9e0ffaf989",
    measurementId: "G-3TRFSPGLMN"
    };
    // Initialize Firebase
    //firebase.initializeApp(firebaseConfig);
    
 // Variables globales
 
 const fs = firebase.firestore()
 var scene
 var renderer
 var camera, camera2, cameraPies

 var clock
 var delta

 var mixers = []
 var action, action2, action3, actionA
 var actionY, actionY2, actionY3

 var keys = {}
 var flag = 0
 var flag2 = 0

 var pyramid, pyramid2
 var troncos = []
 var troncos2 = []
 var aguilas = []
 var aguilas2 = []

 var indiceNombre = 0
 var numeroAl

 var worldready = [false, false, false, false, false]
 var flagReadyMundo2 = false

 var puntuacionTemp = 0
 var gameoverLocal = false
 var gameoverOnline = false

 var gameover = false
 var p1_score = document.querySelector("#p1-score")

 
 $(document).ready(function () {


    $("#btnVolverAJugar").click(function(){
        
        window.location.href='index.html';
    });



    clock = new THREE.Clock()
    raycaster = new THREE.Raycaster()

    // Tamano del canvas
    var canvasSize = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    // Inicializar el renderer
    renderer = new THREE.WebGLRenderer()

    //Limpiamos la pantalla
    renderer.setClearColor(new THREE.Color(0,0,0))
    renderer.setSize(
        canvasSize.width,
        canvasSize.height
    )

    // Inicializar la camara
    camera = new THREE.PerspectiveCamera(
        //Campo de vision
        75,
        //Relacion aspecto
        canvasSize.width / canvasSize.height,
        //Que tan cerca se va a ver
        0.1,
        // Que tan lejos se va a ver
        100
    )
    camera.position.y = 2
    camera.rotation.y = THREE.Math.degToRad(180);

    camera.rayos = [
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
    ];

    cameraPies = new THREE.PerspectiveCamera(
        //Campo de vision
        75,
        //Relacion aspecto
        canvasSize.width / canvasSize.height,
        //Que tan cerca se va a ver
        0.1,
        // Que tan lejos se va a ver
        100
    )

    cameraPies.position.y = .4
    cameraPies.rotation.y = THREE.Math.degToRad(180);

    cameraPies.rayos = [
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
    ];

    //IA

    cameraIA = new THREE.PerspectiveCamera(
        //Campo de vision
        75,
        //Relacion aspecto
        canvasSize.width / canvasSize.height,
        //Que tan cerca se va a ver
        0.1,
        // Que tan lejos se va a ver
        100
    )
    cameraIA.position.y = 2
    cameraIA.position.x = 4
    cameraIA.rotation.y = THREE.Math.degToRad(180);

    cameraIA.rayos = [
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
    ];

    cameraPiesIA = new THREE.PerspectiveCamera(
        //Campo de vision
        75,
        //Relacion aspecto
        canvasSize.width / canvasSize.height,
        //Que tan cerca se va a ver
        0.1,
        // Que tan lejos se va a ver
        100
    )

    cameraPiesIA.position.x = 4
    cameraPiesIA.position.y = .4
    cameraPiesIA.rotation.y = THREE.Math.degToRad(180);

    cameraPiesIA.rayos = [
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
    ];


    camera2 = new THREE.PerspectiveCamera(
        //Campo de vision
        75,
        //Relacion aspecto
        canvasSize.width / canvasSize.height,
        //Que tan cerca se va a ver
        0.1,
        // Que tan lejos se va a ver
        100
    )

    camera2.position.x = -7.997888024743593
    camera2.position.y = 3.7446499999423395
    camera2.position.z = 6.221919561140418
    camera2.rotation.y = THREE.Math.degToRad(290);

    // En caso de animacion de camara, camara inical 0, 10, 20

    // Inicializamos la escena
    scene = new THREE.Scene()

    // Agregamos la etiquetada canvas dentro del Div
    $('#scene-section').append(renderer.domElement)

    // Iluminacion
    var ambient = new THREE.AmbientLight(
        // Color
        new THREE.Color(0x82a1b1),
        // intensidad
        1.0
    )

    var directional = new THREE.DirectionalLight(
        // Color
        new THREE.Color(.6,.6,.6),
        // intensidad
        0.4
    )

    // Ambos tipos de iluminacion se agregan a la escena
    scene.add(ambient)
    scene.add(directional)

    // Skybox

    const loaderT = new THREE.CubeTextureLoader();
    const textureT = loaderT.load([
        './Assets/Imagenes/Skybox2/penguins2/arid2_lf.jpg',
        './Assets/Imagenes/Skybox2/penguins2/arid2_lf.jpg', //bk
        './Assets/Imagenes/Skybox2/penguins2/arid2_up.jpg', //Arriba
        './Assets/Imagenes/Skybox2/penguins2/arid2_dn.jpg', //Abajo
        './Assets/Imagenes/Skybox2/penguins2/arid2_rt.jpg',//ft
        './Assets/Imagenes/Skybox2/penguins2/arid2_ft.jpg', //rt
    ]);
    textureT.encoding = THREE.sRGBEncoding;
    scene.background = textureT;

    // Diamantes
    var radius = 4;
    var height = 5;

    var geometry = new THREE.CylinderGeometry(0, radius, height, 4, 1)
    var materialRojo = new THREE.MeshBasicMaterial({
        color: 0xFF0000
    });
    var materialAmarillo = new THREE.MeshBasicMaterial({
        color: 0xFFFF00
    });

    pyramid = new THREE.Mesh(geometry, materialRojo);
    pyramid.rotation.z = THREE.Math.degToRad(180);

    pyramid2 = new THREE.Mesh(geometry, materialAmarillo);
    pyramid2.rotation.z = THREE.Math.degToRad(180);

    scene.add(pyramid);
    scene.add(pyramid2);

    //Carga de escenario
    loadOBJWithMTL(
        //Carpeta donde esta el modelo,
        'Assets/Modelos/Escenario/Puente/',
        // El archivo obj del modelo
        'puente.obj',
        // El archivo mtl
        'puente.mtl',
        (miObjetoYaCargado) =>{
            // Posicion del objeto en x y z
            miObjetoYaCargado.position.z = 0
            miObjetoYaCargado.position.x = 0
            miObjetoYaCargado.position.y = -5.65

            // Escala del objeto en x y z
            miObjetoYaCargado.scale.set(1,1,1)

            // Nombre del objeto
            miObjetoYaCargado.name = 'Escenario'

            var puente2 = miObjetoYaCargado.clone()
            puente2.position.y = -5.65 
            puente2.position.x = 4.5
            scene.add(puente2)
            // camera2.lookAt(puente2)

            var puente3 = miObjetoYaCargado.clone()
            puente3.position.y = -5.65 
            puente3.position.x = 4.5
            puente3.position.z = 15
            scene.add(puente3)

            var puente4 = miObjetoYaCargado.clone()
            puente4.position.y = -5.65
            puente4.position.x = 0
            puente4.position.z= 15
            scene.add(puente4)
            
            scene.add(miObjetoYaCargado)

            worldready[0] = true
        }
    )

    // Carga de fbx
    var player1 = new THREE.FBXLoader()
    player1.load('Assets/Modelos/Caballero/Caballero_Animaciones.fbx', function (personaje) {
        // AnimationMixer es un reproductor de animaciones
        personaje.mixer = new THREE.AnimationMixer(personaje)

        // El reproductor de animaciones de nuestro modelo
        // entra al arreglo de mixers
        mixers.push(personaje.mixer)

        // Aqui van las animaciones que se hicieron en maya
        action = personaje.mixer.clipAction(personaje.animations[0])
        action2 = personaje.mixer.clipAction(personaje.animations[1])
        action3 = personaje.mixer.clipAction(personaje.animations[2])

        action.play()
        action2.play()
        action3.play()

        // action.stop()

        // le damos la posicion que queramos en x y z
        personaje.position.z = 0
        personaje.position.x = 0
        personaje.position.y = 0

        // le asignamos una escala en x y z
        personaje.scale.set(.01,.01,.01)

        // Le asignamos un nombre al modelo
        personaje.name = 'player1'

        // Posicion de la luz direccional
        directional.lookAt(personaje.position)

        personaje.add(pyramid)
        pyramid.scale.set(3,3,3)
        pyramid.position.y = 230
        pyramid.position.z = 20

        // Agregamos el personaje a la escena
        scene.add(personaje)

        worldready[1] = true

    })


    var player2 = new THREE.FBXLoader()
    player2.load('Assets/Modelos/Caballero/Caballero_Animaciones.fbx', function (personaje) {
        // AnimationMixer es un reproductor de animaciones
        personaje.mixer = new THREE.AnimationMixer(personaje)

        // El reproductor de animaciones de nuestro modelo
        // entra al arreglo de mixers
        mixers.push(personaje.mixer)

        // Aqui van las animaciones que se hicieron en maya
        actionY = personaje.mixer.clipAction(personaje.animations[0])
        actionY2 = personaje.mixer.clipAction(personaje.animations[1])
        actionY3 = personaje.mixer.clipAction(personaje.animations[2])

        actionY.play()
        actionY2.play()
        actionY3.play()

        // le damos la posicion que queramos en x y z
        personaje.position.z = 0
        personaje.position.x = 4
        personaje.position.y = 0

        // le asignamos una escala en x y z
        personaje.scale.set(.01,.01,.01)

        // Le asignamos un nombre al modelo
        personaje.name = 'player2'

        personaje.add(pyramid2)
        pyramid2.scale.set(3,3,3)
        pyramid2.position.y = 230
        pyramid2.position.z = 20

        // Agregamos el personaje a la escena
        scene.add(personaje)
        worldready[2] = true


    })


    var aguila = new THREE.FBXLoader()
    aguila.load('Assets/Modelos/Aguila/Aguila.fbx', function (personaje) {
        // // AnimationMixer es un reproductor de animaciones
        // personaje.mixer = new THREE.AnimationMixer(personaje)

        // // El reproductor de animaciones de nuestro modelo
        // // entra al arreglo de mixers
        // mixers.push(personaje.mixer)

        // // Aqui van las animaciones que se hicieron en maya
        // actionA = personaje.mixer.clipAction(personaje.animations[1])

        // actionA.play()
    
        // le damos la posicion que queramos en x y z
        personaje.position.z = 20
        personaje.position.x = 0
        personaje.position.y = 1.8

        // le asignamos una escala en x y z
        personaje.scale.set(.0025,.0025,.0025)

        personaje.rotation.y = THREE.Math.degToRad(180);

        // Le asignamos un nombre al modelo
        personaje.name = 'aguila'
        // Agregamos el personaje a la escena
        scene.add(personaje)
        worldready[3] = true


    })

    var tronco = new THREE.FBXLoader()
    tronco.load('Assets/Modelos/Tronco/Log_fbx.fbx', function (personaje) {

        // le damos la posicion que queramos en x y z
        personaje.position.z = 20
        personaje.position.x = 0
        personaje.position.y = 0.3

        // le asignamos una escala en x y z = ancho del puente
        personaje.scale.set(.004,.004,.0035)

        // Le asignamos un nombre al modelo
        personaje.name = 'tronco'
        personaje.rotation.y = THREE.Math.degToRad(90);

        // Agregamos el personaje a la escena
        scene.add(personaje)
        worldready[4] = true

    })

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    timer = 0

    // Mandamos llamar la funcion render
    render()
})

var flagArr = true
var flagIA = true
var colisionIA = true

function render() {
    //Recibe como parametro la funcion padre
    // Se llama arias veces (update)
    requestAnimationFrame(render)
    var personaje1 = scene.getObjectByName("player1")
    var personaje2 = scene.getObjectByName("player2")

    if(worldready[0] && worldready[1] && worldready[2] && worldready[3] && worldready[4]){
        

        if(personaje1 != null && personaje1.position.z <= -8.5 ){
    


            if(!gameover){

                var getHighScore = fs.collection("Scores").doc(userID);
    
                getHighScore.get().then((doc) => {
                    if (doc.exists) {
                        //console.log("Document data:", doc.data());
                        var Frase = "";
        
                       var highscoreActual = doc.data().HighScore
                       
                        var highscoreactualint = parseInt (highscoreActual)
                        var p1ScoreINT = parseInt(p1_score.innerHTML)

                       if(highscoreactualint< p1ScoreINT){
                           //debugger
                        fs.collection('Scores').doc(userID)
                        .set({
                            username: p1_nombre.innerHTML,
                            HighScore: p1_score.innerHTML
                        })
                        .catch(error => {
                            console.log('Algo salio mal en firestore: ', error);
                        })
                        $(".modal-body").append('<h2 class="clasecentro"> NUEVO HIGH SCORE: '+p1_score.innerHTML+'</h2>');
                        $(".modal-body").append('<h1 class="clasecentro">'+p1_nombre.innerHTML+'</h1>');
                        Frase = "Wow, tengo un nuevo highscore de : ";
                        var linkDelJuego = "";
                        $(".twitter-share-button").attr("href","https://twitter.com/intent/tweet?text="+Frase+ p1_score.innerHTML+"%20"+linkDelJuego);

                        
                       }else{
                           //debugger
                        $(".modal-body").append('<h2 class="clasecentro">'+p1_score.innerHTML+'</h2>');
                        $(".modal-body").append('<h2 class="clasecentro"> HIGH SCORE: '+highscoreActual+'</h2>');
                        $(".modal-body").append('<h1 class="clasecentro">'+p1_nombre.innerHTML+'</h1>');
                        Frase = "Wow, no mejore mi highscore de : ";
                        var linkDelJuego = "";
                        $(".twitter-share-button").attr("href","https://twitter.com/intent/tweet?text="+Frase+highscoreActual+"%20"+linkDelJuego);
                       }
        
        
                    } else {
                        $(".modal-body").append('<h2 class="clasecentro">'+p1_score.innerHTML+'</h2>');
                        $(".modal-body").append('<h2 class="clasecentro"> MI PRIMER HIGH SCORE: '+p1_score.innerHTML+'</h2>');
                        $(".modal-body").append('<h1 class="clasecentro">'+p1_nombre.innerHTML+'</h1>');
                        Frase = "Wow, mi primer highscore fue de : ";
                        var linkDelJuego = "";
                        $(".twitter-share-button").attr("href","https://twitter.com/intent/tweet?text="+Frase+highscoreActual+"%20"+linkDelJuego);
                        fs.collection('Scores').doc(userID)
                        .set({
                            username: p1_nombre.innerHTML,
                            HighScore: p1_score.innerHTML
                        })
                        .catch(error => {
                            console.log('Algo salio mal en firestore: ', error);
                        })
        
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });



            $('#myModal2').modal('show')
            gameover = true
            }


           //Gameover
        }else{
            p1_score.innerHTML = puntuacionTemp
            $('#loading').fadeOut(1000)
            timer = timer +1  

            delta = clock.getDelta()

            var yaw = 0;
            var forward = 0;
            var updown = 0;


            if (keys["A"]) {
                yaw = 5;
            } else if (keys["D"]) {
                yaw = -5;
            }
            if (keys["W"]) {
                forward = -20;
            } else if (keys["S"]) {
                forward = 20;
            }if(keys["Q"]){
                updown = 5;
            }else if(keys["E"]){
                updown = -5;
            }

            
            camera.rotation.y += yaw * delta;
            camera.translateZ(forward * delta);
            camera.translateY(updown * delta);
            
            pyramid.rotation.y += 1 * delta;
            pyramid2.rotation.y += 1 * delta;

            // Animaciones
            // Mide el arreglo de mixers mientras no este vacio
            // lo va a recorrer y hara el update de las animaciones
            if(mixers.length > 0){
                for (let index = 0; index < mixers.length; index++) {
                    mixers[index].update(delta);
                }
                // Player 1
                if(flag == 1){ //Accion 2
                    action.weight = 0
                    action2.weight = 1
                    action3.weight = 0
                    action2.play()
                    
                    personaje1.position.y = .5
                    cameraPies.position.y = .9
                    
                    flag = 0
                    
                }else if(flag == 2){ //Accion 3
                    action.weight = 0
                    action2.weight = 1
                    action3.weight = 1
                    action3.play()
                    
                    personaje1.position.y = -.5
                    camera.position.y = 1.5

                    flag = 0
                }else{ //Idle
                    action.weight = 1
                    action2.weight = 0
                    action3.weight = 0
                    action2.stop();
                    action3.stop();
                    
                    personaje1.position.y = 0
                    camera.position.y = 2
                    cameraPies.position.y = .4 
                }

                // Player 2
                if(flag2 == 1){
                    actionY.weight = 0
                    actionY2.weight = 1
                    actionY3.weight = 0

                    personaje2.position.y = .5
                    cameraPiesIA.position.y = .9

                    
                }else if(flag2 == 2){
                    actionY.weight = 0
                    actionY2.weight = 1
                    actionY3.weight = 1

                    personaje2.position.y = -.5
                    cameraIA.position.y = 1.5

                    
                }else{
                    actionY.weight = 1
                    actionY2.weight = 0
                    actionY3.weight = 0

                    personaje2.position.y = 0
                    cameraIA.position.y = 2
                    cameraPiesIA.position.y = .4 
                }
            }

            if(timer >= 100){
                // Creamos un nombre unico para cada tronco
                var nombre = "objeto" + indiceNombre
                indiceNombre++
                // Reseteamos el indice solamente para que no llegue al limite
                // de la variable
                if(indiceNombre > 100){
                    indiceNombre = 0
                }

                var objeto
                var objetoClone
                var objetoClone2
                numeroAl = aleatorio(0,1)
                
                if(numeroAl == 0){
                    // Obtenemos el tronco original y lo clonamos
                    objeto = scene.getObjectByName('tronco')
                    objetoClone = objeto.clone()
                    objetoClone.position.z = 20
                    objetoClone.position.y = 0.3
                    objetoClone.position.x = 0
                    objetoClone.name = nombre
                    // Metemos el tronco con name unico al arreglo de troncos
                    troncos.push(objetoClone)

                    objetoClone2 = objeto.clone()
                    objetoClone2.position.z = 20
                    objetoClone2.position.y = 0.3
                    objetoClone2.position.x = 4
                    objetoClone2.name = nombre + "1"
                    // Metemos el tronco con name unico al arreglo de troncos
                    troncos2.push(objetoClone2)

                }else{
                    objeto = scene.getObjectByName('aguila')
                    objetoClone = objeto.clone()
                    objetoClone.position.z = 20
                    objetoClone.position.y = 1.8
                    objetoClone.position.x = 0
                    objetoClone.name = nombre
                    // Metemos el tronco con name unico al arreglo de troncos
                    aguilas.push(objetoClone)

                    objetoClone2 = objeto.clone()
                    objetoClone2.position.z = 20
                    objetoClone2.position.y = 1.8
                    objetoClone2.position.x = 4
                    objetoClone2.name = nombre + "1"
                    // Metemos el tronco con name unico al arreglo de troncos
                    aguilas2.push(objetoClone2)
                }
                // y lo metemos a la escena 
                scene.add(objetoClone)
                scene.add(objetoClone2)

                timer = 0
            }

            var puntuacionAnterior = puntuacionTemp

            troncos.forEach(tronquito => {
                var tronco = scene.getObjectByName(tronquito.name)
                
                tronco.position.z -= 3 * delta
                tronco.rotation.z -= 9 * delta 

                if(tronco.position.z <= -8){
                    scene.remove(tronco)
                    troncos.shift()
                    
                }

                if(tronco.position.z < personaje1.position.z && tronco.position.z > personaje1.position.z - 1){
                    puntuacionTemp += 2
                    // console.log('puntoccccc')
                }
            });

            troncos2.forEach(tronquito => {
                var tronco = scene.getObjectByName(tronquito.name)
                
                tronco.position.z -= 3 * delta
                tronco.rotation.z -= 9 * delta 

                if(tronco.position.z <= -8){
                    scene.remove(tronco)
                    troncos2.shift()
                    
                }

                if(tronco.position.z < personaje2.position.z - 1.5 && tronco.position.z > personaje2.position.z - 2.5){
                    flag2 = 0
                    flagIA = true
                    colisionIA = true
                }
            });

            aguilas.forEach(aguilita =>{
                var aguila = scene.getObjectByName(aguilita.name)
                aguila.position.z -= 3 * delta
            
                if(aguila.position.z <= -10){
                    scene.remove(aguila)
                    aguilas.shift()
                }

                if(aguila.position.z < personaje1.position.z && aguila.position.z > personaje1.position.z - 1){
                    puntuacionTemp += 2
                }
            })

            aguilas2.forEach(aguilita =>{
                var aguila = scene.getObjectByName(aguilita.name)
                aguila.position.z -= 3 * delta
            
                if(aguila.position.z <= -10){
                    scene.remove(aguila)
                    aguilas2.shift()
                }

                if(aguila.position.z < personaje2.position.z - 1.5 && aguila.position.z > personaje2.position.z - 2.5){
                    flag2 = 0
                    flagIA = true
                    colisionIA = true
                }
            })
            
        }

            //Colisiones
            for (var i = 0; i < camera.rayos.length; i++) {
            var rayo = camera.rayos[i];

            raycaster.set(camera.position, rayo);

            var colision = raycaster.intersectObjects(
                aguilas,
                true
            );

            if (colision.length > 0) {
                 if (colision[0].distance < 1) {
                     personaje1.position.z -= 1
                     camera.position.z -= 1
                     cameraPies.position.z -= 1
                     puntuacionTemp =puntuacionAnterior
                 }
            }
        }

        for (var i = 0; i < cameraPies.rayos.length; i++) {
            var rayo = cameraPies.rayos[i];

            raycaster.set(cameraPies.position, rayo);

            var colision = raycaster.intersectObjects(
                troncos,
                true
            );

            if (colision.length > 0) {
                 if (colision[0].distance < 1) {
                     personaje1.position.z -= 1
                     camera.position.z -= 1
                     cameraPies.position.z -= 1
                     puntuacionTemp =puntuacionAnterior
                 }
            }
        }  

        //IA
        for (var i = 0; i < cameraIA.rayos.length; i++) {
            var rayo = cameraIA.rayos[i];

            raycaster.set(cameraIA.position, rayo);

            var colision = raycaster.intersectObjects(
                aguilas2,
                true
            );
          
            if (colision.length > 0) {
                if(colision[0].distance < 2 && colision[0].distance > 1){
                    if(flagIA){
                        flagIA = false
                        flag2 = aleatorio(1,2)
                    }
                }
                else if (colision[0].distance < 1) {

                    if(colisionIA){
                        personaje2.position.z -= 1
                        cameraIA.position.z -= 1
                        cameraPiesIA.position.z -= 1
                        colisionIA = false
                    }
                    
                    // puntuacionTemp =puntuacionAnterior
                }
            }
        }

        for (var i = 0; i < cameraPiesIA.rayos.length; i++) {
            var rayo = cameraPiesIA.rayos[i];

            raycaster.set(cameraPiesIA.position, rayo);

            var colision = raycaster.intersectObjects(
                troncos2,
                true
            );

            if (colision.length > 0) {
                if(colision[0].distance < 2 && colision[0].distance > 1){
                    if(flagIA){
                        flagIA = false
                        flag2 = aleatorio(1,2)
                    }
                }else if (colision[0].distance < 1) {
                    if(colisionIA){
                        personaje2.position.z -= 1
                        cameraIA.position.z -= 1
                        cameraPiesIA.position.z -= 1
                        colisionIA = false
                    }
                    
                    // puntuacionTemp =puntuacionAnterior
                }
            }
        }  



    }

    moverPersonaje(delta)
    // Recibe como parametro que escena va a dibujar, y la camara que se va a utilizar
    renderer.render(scene, camera2)
}

function moverPersonaje(delta){
    var character = scene.getObjectByName('player1')
    // Player 1
    if (keys["C"]) {
        flag = 1
        
    }
    if (keys["V"]) {
        flag = 2
        
    }
}

function onKeyDown(event) {
    keys[String.fromCharCode(event.keyCode)] = true;
}

function onKeyUp(event) {
    var key = keys[String.fromCharCode(event.keyCode)] = false;
}

function loadOBJWithMTL(path, objFile, mtlFile, onLoadCallback) {
    var mtlLoader = new THREE.MTLLoader()
    mtlLoader.setPath(path)

    mtlLoader.load(mtlFile,(material)=>{
        var objLoader = new THREE.OBJLoader()
        objLoader.setPath(path)
        objLoader.setMaterials(material)
        objLoader.load(objFile,(object3d)=>{
            onLoadCallback(object3d)
        })
    })
}

function aleatorio(minimo,maximo){
    return Math.floor(Math.random() * ((maximo+1)-minimo)+minimo);
}
