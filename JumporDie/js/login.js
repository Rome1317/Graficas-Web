const fs = firebase.firestore()
//Sign up
const signupForm = document.querySelector('#signup-form')

signupForm.addEventListener('submit',e=>{
    e.preventDefault()

    const signupEmail = document.querySelector('#signup-email').value
    const signupPassword = document.querySelector('#signup-password').value
    const signupUsername = document.querySelector('#signup-username').value


    auth
        .createUserWithEmailAndPassword(signupEmail, signupPassword)
        .then(userCredential =>{
            signupForm.reset()

            fs.collection('usuarios').doc(auth.currentUser.uid)
            .set({
                username: signupUsername,
                email: signupEmail
            })
            .catch(error => {
                console.log('Algo salio mal en firestore: ', error);
            })


            console.log('signup')
        })

        
})

//Sign in
const signinForm = document.querySelector('#signin-form')

signinForm.addEventListener('submit',e=>{
    e.preventDefault()
    const email = document.querySelector("#login-username").value
    const password = document.querySelector("#login-password").value

    auth
        .signInWithEmailAndPassword(email, password)
        .then(userCredential =>{
            signinForm.reset()

            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                  console.log(user.email)
                  location.href ="index.html";
                } else {
                  // No user is signed in.
                }
              });

            console.log('signin')
        })
})
    
//logout
const logout = document.querySelector('#logout')

logout.addEventListener('click',e=>{
    e.preventDefault()
    auth.signOut().then(()=>{
        console.log('loguot')
    })
})



//Events
//list for auth changes
auth.onAuthStateChanged(user => {
    if(user){
        console.log('auth: sign in')

        /*fs.collection('posts').get().then((snapshot)=>{
            console.log(snapshot)
        })*/
    }else {
        console.log('auth:sign out')
    }
})