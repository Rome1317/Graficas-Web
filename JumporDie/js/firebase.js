// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
var p2_nombre = document.querySelector("#p2-nombre");
var p2_score = document.querySelector("#p2-score");
var prueba = "";

var indicez = 0
var arregloNombres = []
var userID 
var userID2
var arregloONLINE = []
var ix=0

function aleatorioF(minimo,maximo){
    return Math.floor(Math.random() * ((maximo+1)-minimo)+minimo);
}

//GUARDANDO
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        userID = user.uid
        //Agrego un jugador
        var dbRef = firebase.database().ref('jugadores/' + user.uid).set({
            username: user.email,
            point: 0,
            jump: false,
            squad: false,
            ready: false,
            gameover: false,
            posz: 0
        });


        var arr = []
        for (let index = 0; index < 100; index++) {
            arr.push(aleatorioF(0,1))
        }
        var dbRef = firebase.database().ref('arr/').set({
            arregloPos: arr,
        });

        getPlayers()

        const db = firebase.firestore()

        //Traer nombre del firebase user.uid == al que se busca en firestore
        var docRef = db.collection("usuarios").doc(user.uid);

        docRef.get().then((doc) => {
            if (doc.exists) {
                p1_nombre.innerHTML = doc.data().username
                var dbRef2 = firebase.database().ref('jugadores/' + user.uid).on('value', function (snapshot){
                    p1_score.innerHTML = snapshot.val().point
                })
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        })        
    } else {
      // No user is signed in.
    }
});

function getPlayers() {
    var dbRef2 = firebase.database().ref('jugadores/').on('value', function (snapshot){
        snapshot.forEach((child) => {
            var flag = true
            arregloNombres.forEach(e =>{
                if(e == child.key){
                    flag = false
                }
            })

            if(flag){
                arregloNombres.push(child.key);
            }
            
        });
    })
}

function getArray() {

    var dbRef2 = firebase.database().ref('arr/arregloPos').on('value', function (snapshot){

        arregloONLINE = snapshot.val()
        console.log(arregloONLINE)
    })
}
//LEER
// var dbRef = firebase.database().ref('LordRikura').on('value', function (snapshot) {
//     alert(snapshot.val().username)
//     p1_nombre.innerHTML = snapshot.val().username
// })

// var messageRef = dbRef.ref('message')

// messageRef.once('value').then(function (snap) {
//     p1_nombre.innerHTML = snap.val()
// })