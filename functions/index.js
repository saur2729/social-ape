const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
 
admin.initializeApp(); 

const firebaseConfig = {
    apiKey: "AIzaSyDpa5Mw8DZZ0RWJd8AV7oYgxx0daNxNA-o",
    authDomain: "socialape-12d50.firebaseapp.com",
    databaseURL: "https://socialape-12d50.firebaseio.com",
    projectId: "socialape-12d50",
    storageBucket: "socialape-12d50.appspot.com",
    messagingSenderId: "937857447745",
    appId: "1:937857447745:web:ebc94287f9173b94"
};
const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

app.get('/screams', (req, res) => {
    db
    .collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
        let screams = [];
        data.forEach(doc => {
            screams.push({
                screamId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt
            });
        });
        return res.json(screams);
    })
    .catch(err => console.error(err));
})

app.post('/scream', (req, res) => {

    const newScream = {
        body : req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString(),
    };
    db.collection('screams').add(newScream)
    .then(doc => {
        return res.json({message: `document ${doc.id} created successfully`});
    })
    .catch(err => {
        res.status(500).json({ error: `something went wrong` });
        console.error(err);
    });
});

// Signup route
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle 
    };

    //Todo validate data
    let token, userId;

    db.doc(`/users/${newUser.handle}`).get()
      .then(doc => {
          if(doc.exists){
              return res.status(400).json({ handle: 'this handle is already taken'});
          }else{
              return firebase
              .auth()
              .createUserWithEmailAndPassword(newUser.email, newUser.password);
          }
      })
      .then (data => {
          userId = data.user.uId;
          return data.user.getIdToken();
      })
      .then((idtoken) => {
          token = idtoken;
          const userCredentials = {
              handle: newUser.handle,
              email: newUser.email,
              createdAt: new Date().toISOString(),
              userId
          };
          return db.doc(`/users/${newUser.handle}`).set(userCredentials);
      })
      .then(() => {
          return screen.status(201).json({token});
      })
      .catch(err => {
          console.error(err);
          if (err.code === "auth/email-already-in-use"){
              return res.status(400).json({emial: 'Email already in use'});
          }else{
              return res.status(500).json({error : err.code});
          }
      }); 
});

// https://baseurl.com/api/     we are trying to get this prefix here - api
exports.api = functions.region('asia-east2').https.onRequest(app); 
