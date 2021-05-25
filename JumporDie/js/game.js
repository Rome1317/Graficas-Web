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

 var finalizo = false

 $(document).ready(function () {


    $("#btnVolverAJugar").click(function(){

        var noexiste = false
        var getHighScore = fs.collection("Scores").doc(userID);
        
        getHighScore.get().then((doc) => {
            if (doc.exists) {
                //console.log("Document data:", doc.data());

               var highscoreActual = doc.data().HighScore

               if(highscoreActual< p1_score.innerHTML){
                fs.collection('Scores').doc(userID)
                .set({
                    username: p1_nombre.innerHTML,
                    HighScore: p1_score.innerHTML
                })
                .catch(error => {
                    console.log('Algo salio mal en firestore: ', error);
                })
               }


            } else {
                
               
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

        

        //if(noexiste){
           
            
            
            //noexiste = false
        //}
        
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

function init() {
    
}

function render() {
    //Recibe como parametro la funcion padre
    // Se llama arias veces (update)
    requestAnimationFrame(render)
    var personaje1 = scene.getObjectByName("player1")
    var personaje2 = scene.getObjectByName("player2")

    if(worldready[0] && worldready[1] && worldready[2] && worldready[3] && worldready[4] && arregloNombres.length > 0){
    
        var dbRef3 = firebase.database().ref('jugadores/' + userID).update({
            ready: true
        });

        if(arregloNombres.length < 2){
            getPlayers()  
            getArray()
        }else{
            arregloNombres.forEach(e=>{
                if(e != userID){
                    userID2 = e
                }
            })

            const db = firebase.firestore()

            var docRef = db.collection("usuarios").doc(userID2);

            docRef.get().then((doc) => {
                if (doc.exists) {
                    p2_nombre.innerHTML = doc.data().username
                    var dbRef2 = firebase.database().ref('jugadores/' + userID2).on('value', function (snapshot){
                        flagReadyMundo2 = snapshot.val().ready
                        p2_score.innerHTML = snapshot.val().point
                    })
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            })     
        }

        if(flagReadyMundo2){

            if(personaje1 != null && personaje1.position.z <= -8.5 ){
        
                var dbRef3 = firebase.database().ref('jugadores/' + userID).update({
                    gameover: true
                });
                
                gameoverLocal =true
                var dbRef2 = firebase.database().ref('jugadores/' + userID2).on('value', function (snapshot){
                    gameoverOnline = snapshot.val().gameover
                })
            }

            if(gameoverLocal && gameoverOnline){
                //Sacar ventana modal de quien gano
                if(!finalizo){
                var puntuacion1
                var dbRef1 = firebase.database().ref('jugadores/' + userID).on('value', function (snapshot){
                    puntuacion1 = snapshot.val().point
                })

                var puntuacion2
                var dbRef2 = firebase.database().ref('jugadores/' + userID2).on('value', function (snapshot){
                    puntuacion2 = snapshot.val().point
                })

                if( puntuacion1 > puntuacion2){
                $(".modal-body").append('<h1 class="clasecentro">'+p1_nombre.innerHTML+'</h1>');
                var Frase = "Wow, esta vez he ganado hahaha, mi puntuacion fue de : ";
                var linkDelJuego = "";
                $(".twitter-share-button").attr("href","https://twitter.com/intent/tweet?text="+Frase+ puntuacion1+"%20"+linkDelJuego);

                }else{
                $(".modal-body").append('<h1 class="clasecentro">'+p2_nombre.innerHTML+'</h1>');
                var Frase = "Wow, esta vez he perdido :(, pero me diverti hehe, mi puntuacion fue de : ";
                var linkDelJuego = "";
                $(".twitter-share-button").attr("href","https://twitter.com/intent/tweet?text="+Frase+puntuacion1+"%20"+linkDelJuego);
                }

                $('#myModal2').modal('show')
                finalizo = true    
            }

            }else{
                $('#loading').fadeOut(1000)
               timer = timer +1  
                firebase.database().ref('jugadores/' + userID2).on('value', function (snapshot){
                    if(snapshot.val().jump){
                        flag2 = 1
                    }
            
                    if(snapshot.val().squad){
                        flag2 = 2
                    }
                
                })
    
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

                        firebase.database().ref('jugadores/' + userID).update({
                            jump: false,
                            squad: false,
                            posz: personaje1.position.z
                        });
                    }
    
                    // Player 2
                    if(flag2 == 1){
                        actionY.weight = 0
                        actionY2.weight = 1
                        actionY3.weight = 0
    
                        flag2 = 0
                    }else if(flag2 == 2){
                        actionY.weight = 0
                        actionY2.weight = 1
                        actionY3.weight = 1
    
                        flag2 = 0
                    }else{
                        actionY.weight = 1
                        actionY2.weight = 0
                        actionY3.weight = 0
                    }
                }
    
    //console.log( "delta: "+ delta)
    
    //console.log( timer)

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
                    // numeroAl = aleatorio(0,1)
                    
                    if(arregloONLINE[ix] == 0){
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
                    //debugger
                    ix++
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

            var dbRef3 = firebase.database().ref('jugadores/' + userID).update({
                point: puntuacionTemp
            });

            var dbRef2 = firebase.database().ref('jugadores/' + userID2).on('value', function (snapshot){
                personaje2.position.z = snapshot.val().posz
            })
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
        var dbRef3 = firebase.database().ref('jugadores/' + userID).update({
            jump: true
        });
    }
    if (keys["V"]) {
        flag = 2
        var dbRef3 = firebase.database().ref('jugadores/' + userID).update({
            squad: true
        });
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
