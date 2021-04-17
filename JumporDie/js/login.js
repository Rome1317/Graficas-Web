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
            signupForm.reset()
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