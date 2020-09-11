const functions = require('firebase-functions');
const firebase=require('firebase-admin')
const express=require('express');
const engines=require('consolidate')
const path =require('path')
const fs = require('fs');
const bodyParser=require('body-parser')
const urlencodedparser = bodyParser.urlencoded({extended:false})
const {google} = require('googleapis');
const opn = require('open');

const extra=require('../modules');
const { response } = require('express');




const keyfile = path.join(__dirname, 'credentials.json');
const keys = JSON.parse(fs.readFileSync(keyfile));
const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly','https://www.googleapis.com/auth/spreadsheets'];

const client = new google.auth.OAuth2(
	keys.web.client_id,
	keys.web.client_secret,
	keys.web.redirect_uris[0]
  );

this.authorizeUrl = client.generateAuthUrl({
	access_type: 'offline',
	scope: scopes,
  });

const app=express()
app.set('views','./views')
app.set('view engine','pug')

app.get('/',(request,response)=>{
    opn(this.authorizeUrl, {wait: false});
    response.render('index')
})

app.get('/authclient',urlencodedparser, async(req, res) => {
	const code =req.query.code;
	client.getToken(code,(err,tokens)=>{
		if(err){
			console.error('Error getting oAuth tokens:');
      		throw err;
		}

        client.credentials=tokens
        res.send("AUTHORIZATION COMPLETE")
		// res.redirect('/')
	})
	
  });


app.get('/fetchAPI',async(req,res)=>{
    
	res.send(await extra.fetchDataFromAPI())
})


exports.app = functions.https.onRequest(app)


