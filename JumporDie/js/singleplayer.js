//Firebase
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
firebase.initializeApp(firebaseConfig);

var p1_nombre = document.querySelector("#p1-nombre")
var p1_score = document.querySelector("#p1-score")

var userID 

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        userID = user.uid
        
        const db = firebase.firestore()
        var docRef = db.collection("usuarios").doc(user.uid);

        docRef.get().then((doc) => {
            if (doc.exists) {
                p1_nombre.innerHTML = doc.data().username
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        })        
    }
})


// Variables globales
var scene
var renderer
var camera
var camera2
var cameraPies

var pausa = false

var clock
var delta

var mixers = []
var action, action2, action3, actionA
var actionY, actionY2, actionY3

var keys = {}
var flag = 0
var flag2 = 0

var pyramid, pyramid2
var laseres = []

var indiceNombre = 0
var numeroAl

var worldready = [false, false, false]

var puntuacion = 0

var p1_score = document.querySelector("#p1-score")

$(document).ready(function () {
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

 

    // 0.07636858177216749 y: 3.5805250000157685 z: -5.654726153709754
    camera2.position.x = 0
    camera2.position.y = 2.4
    camera2.position.z = -4.654726153709754
    camera2.rotation.y = THREE.Math.degToRad(180);

    // En caso de animacion de camara, camara inical 0, 10, 20

    // Inicializamos la escena
    scene = new THREE.Scene()

    // Agregamos la etiquetada canvas dentro del Div
    $('#scene-section').append(renderer.domElement)

    // Iluminacion
    var ambient = new THREE.AmbientLight(
        // Color
        new THREE.Color(.8,.8,.8),
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

    scene.add(pyramid);

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

        worldready[0] = true

    })

    var escenario = new THREE.FBXLoader()
    escenario.load('Assets/Modelos/Escenario/Metro/metro.fbx', function (escenario) {

        // le damos la posicion que queramos en x y z
        escenario.position.z = 0
        escenario.position.x = 0
        escenario.position.y = 0.1

        // le asignamos una escala en x y z = ancho del puente
        escenario.scale.set(.005,.005,.005)

        // Le asignamos un nombre al modelo
        escenario.name = 'escenario'
        escenario.rotation.y = THREE.Math.degToRad(90);
        
        var escenario2 = escenario.clone()
        escenario2.position.z = 8
        escenario2.position.x = 0
        escenario2.position.y = 0.1
        scene.add(escenario2)

        var escenario3 = escenario.clone()
        escenario3.position.z = 16
        escenario3.position.x = 0
        escenario3.position.y = 0.1
        scene.add(escenario3)

        var escenario4 = escenario.clone()
        escenario4.position.z = 24
        escenario4.position.x = 0
        escenario4.position.y = 0.1
        scene.add(escenario4)

        // Agregamos el personaje a la escena
        scene.add(escenario)

        worldready[1] = true
    })

    var laser = new THREE.FBXLoader()
    laser.load('Assets/Modelos/Laser/laserpuro.fbx', function (laser) {

        // le damos la posicion que queramos en x y z
        laser.position.z = 10
        laser.position.x = 20
        laser.position.y = .1

        // le asignamos una escala en x y z = ancho del puente
        laser.scale.set(.15,.15,.15)

        // Le asignamos un nombre al modelo
        laser.name = 'laser'
        laser.rotation.y = THREE.Math.degToRad(90);
        


        // Agregamos el personaje a la escena
        scene.add(laser)
        worldready[2] = true
    })

    
    // Dibujamos un grid
    // var grid = new THREE.GridHelper(50, 10, 0xffffff, 0xffffff);
    // grid.position.y = -1;
    // scene.add(grid);

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    timer = 0

    // Mandamos llamar la funcion render
    
    render()
    
})

function render() {
    
    //Recibe como parametro la funcion padre
    // Se llama arias veces (update)
    requestAnimationFrame(render)
    
    if(!pausa){
        var personaje1 = scene.getObjectByName("player1")

        if(worldready[0] && worldready[1] && worldready[2] ){
            p1_score.innerHTML = puntuacion
            $('#loading').fadeOut(1000)
            
            timer = timer + 1
            
        }

        if(personaje1 != null && personaje1.position.z <= -3.5 ){
        
                // console.log('game over')
            
        }else{
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

            if(mixers.length > 0){
                for (let index = 0; index < mixers.length; index++) {
                    mixers[index].update(delta);
                }
                // Player 1
                if(flag == 1){ //Accion 2 SALTAR
                    action.weight = 0
                    action2.weight = 1
                    action3.weight = 0
                    action2.play()

                    personaje1.position.y = .5
                    cameraPies.position.y = .9
                    
                    flag = 0
                    
                }else if(flag == 2){ //Accion 3 AGACHARSE
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
                numeroAl = aleatorio(0,1)
                if(numeroAl == 0){
                    // Obtenemos el tronco original y lo clonamos
                    objeto = scene.getObjectByName('laser')
                    objetoClone = objeto.clone()
                    objetoClone.position.z = 10
                    objetoClone.position.y = -1.5
                    objetoClone.position.x = 20
                    objetoClone.name = nombre
                    // Metemos el tronco con name unico al arreglo de troncos
                    laseres.push(objetoClone)
                }else{
                    objeto = scene.getObjectByName('laser')
                    objetoClone = objeto.clone()
                    objetoClone.position.z = 10
                    objetoClone.position.y = .1
                    objetoClone.position.x = 20
                    objetoClone.name = nombre
                    // Metemos el tronco con name unico al arreglo de troncos
                    laseres.push(objetoClone)
                }

                // y lo metemos a la escena 
                scene.add(objetoClone)

                timer = 0
            }

            var puntuacionTemp = puntuacion

            laseres.forEach(laser =>{
                var ElLaser = scene.getObjectByName(laser.name)
                if(!pausa){ 
                ElLaser.position.z -= 3 * delta

                }
                if(ElLaser.position.z < personaje1.position.z && ElLaser.position.z > personaje1.position.z - 1){
                    puntuacion += 2
                    // console.log('puntoccccc')
                }
                if(ElLaser.position.z <= -8){
                    scene.remove(ElLaser)
                    laseres.shift()
                }
                
                
            })

            
            //Colisiones
            for (var i = 0; i < camera.rayos.length; i++) {
                var rayo = camera.rayos[i];

                raycaster.set(camera.position, rayo);

                var colision = raycaster.intersectObjects(
                    laseres,
                    true
                );

                if (colision.length > 0) {
                    if (colision[0].distance < 1) {
                        /*
                        if(colision[0].object.parent.name == "corazon") {
                            scene.remove(colision[0].object.parent);
                        }*/
                        personaje1.position.z -= .01
                        camera.position.z -= .01
                        cameraPies.position.z -= .01
                        puntuacion = puntuacionTemp
                        // console.log('COLISION CABEZA');
                        // console.log(personaje1.position);

                        //console.log("Si hay colision");
                    }
                }
            }

            for (var i = 0; i < cameraPies.rayos.length; i++) {
                var rayo = cameraPies.rayos[i];

                raycaster.set(cameraPies.position, rayo);

                var colision = raycaster.intersectObjects(
                    laseres,
                    true
                );

                if (colision.length > 0) {
                    if (colision[0].distance < 1) {
                        /*
                        if(colision[0].object.parent.name == "corazon") {
                            scene.remove(colision[0].object.parent);
                        }*/
                        
                        personaje1.position.z -= .01
                        camera.position.z -= .01
                        cameraPies.position.z -= .01

                        puntuacion = puntuacionTemp

                        // console.log('COLISION PIES');

                        //console.log("Si hay colision");
                    }
                }
            }


            moverPersonaje(delta)
        }

    }
    
    renderer.render(scene, camera2)

}

function moverPersonaje(delta){
    // Player 1
    if (keys["C"]) {
    flag = 1
    //    action2.play()
    //    action2.setLoop( THREE.LoopOnce);
    }
    if (keys["V"]) {
    flag = 2
    //    action3.play()
    //    action3.setLoop( THREE.LoopOnce);
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
