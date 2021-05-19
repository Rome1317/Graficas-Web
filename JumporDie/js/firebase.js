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
var p2_nombre = document.getElementById('p2-nombre');
var prueba = "";

//GUARDANDO
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var dbRef = firebase.database().ref('jugadores/' + user.uid).set({
            username: user.email,
            point: 0
        });
    } else {
      // No user is signed in.
    }
});



//LEER
// var dbRef = firebase.database().ref('LordRikura').on('value', function (snapshot) {
//     alert(snapshot.val().username)
//     p1_nombre.innerHTML = snapshot.val().username
// })

// var messageRef = dbRef.ref('message')

// messageRef.once('value').then(function (snap) {
//     p1_nombre.innerHTML = snap.val()
// })