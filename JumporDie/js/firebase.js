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
            point: 10,
            jump: false,
            squad: false
        });

        const db = firebase.firestore()

        //Traer nombre del firebase user.uid == al que se busca en firestore
        var docRef = db.collection("usuarios").doc(user.uid);

        docRef.get().then((doc) => {
            if (doc.exists) {
                // p1_nombre.innerHTML = user.username
                console.log("Document data:", doc.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
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