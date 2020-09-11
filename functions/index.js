const functions = require('firebase-functions');
const firebase=require('firebase-admin')
const express=require('express');
const engines=require('consolidate')

const firebaseApp =firebase.initializeApp(
    functions.config().firebase
)



const app=express()
app.engine('pug',engines.handlebars)
app.set('views','./views')
app.set('view engine','pug')
exports.app = functions.https.onRequest(app)

app.get('/',(request,response)=>{
    response.render('index.pug')
})
