const express = require('express');
const app = express();
const path =require('path')
const bodyParser=require('body-parser')
const opn = require('open');
const {google} = require('googleapis');
const urlencodedparser = bodyParser.urlencoded({extended:false})
const fs = require('fs');

//Modules
const extra=require('./modules')

app.use(bodyParser.urlencoded({extended:false}))


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
	res.render('index.pug')
});

app.get('/fetchAPI',async(req,res)=>{
	res.send(await extra.fetchDataFromAPI())
})

app.post('/testingAjax', (req, res) => {
  console.log(req.body)
});

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
  

app.post('/createSheet',urlencodedparser, async(req, res) => {
	const code =req.query.code;
	client.getToken(code,(err,tokens)=>{
		if(err){
			console.error('Error getting oAuth tokens:');
      		throw err;
		}

		client.credentials=tokens
		res.send('Authentication successful! Please return to the console.');
	})
	// const sheetData=await extra.fetchDataFromAPI()
	// const sheetHeaders=sheetData['sheetHeaders']
	// const sheetContent=sheetData['sheetValues']
	// const sheetname=req.body?.sheetname
	// console.log(sheetContent)
  });

const PORT = 8080;

app.listen(PORT, () => {
	console.log(`App is listening on Port ${PORT}!`);
});