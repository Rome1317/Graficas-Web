
class Tronco{
    constructor(x,y,z,scene, nombre){
        this.x = x
        this.y = y
        this.z = z
        this.nombre = nombre

        this.loader(scene)
    }

    loader(scene){
        this.objeto = new THREE.FBXLoader()
        objeto.load('Assets/Modelos/Tronco/Log_fbx.fbx', function (personaje) {

            // le damos la posicion que queramos en x y z
            personaje.position.z = this.x
            personaje.position.x = this.y
            personaje.position.y = this.z

            // le asignamos una escala en x y z = ancho del puente
            personaje.scale.set(.004,.004,.0035)

            // Le asignamos un nombre al modelo
            personaje.name = this.nombre
            personaje.rotation.y = THREE.Math.degToRad(90);

            // Agregamos el personaje a la escena
            scene.add(personaje)
        })
    }

    mover(scene){
        var tronco = scene.getObjectByName(this.nombre)
        if(tronco.position.z <= -8){
            tronco.position.z = tronco.position.z
            tronco.position.y-= 3*delta 
            if(tronco.position.y <= -6){
                tronco.position.y = 0.3
                tronco.position.z = 20
            }
        }else{
            tronco.position.z -= 3* delta 
        }
    }

    borrar(scene){
        scene.remove(this.name)
    }
}