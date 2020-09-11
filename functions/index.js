const functions = require('firebase-functions');
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
const scopes = ['https://www.googleapis.com/auth/drive.file','https://www.googleapis.com/auth/spreadsheets.readonly','https://www.googleapis.com/auth/spreadsheets'];

const client = new google.auth.OAuth2(
	keys.web.client_id,
	keys.web.client_secret,
	keys.web.redirect_uris[1]
  );

this.authorizeUrl = client.generateAuthUrl({
	access_type: 'offline',
	scope: scopes,
  });
  

app.get('/authclient',urlencodedparser, async(req, res) => {
	const code =req.query.code;
	client.getToken(code,(err,tokens)=>{
		if(err){
			console.error('Error getting oAuth tokens:');
      		throw err;
		}

		client.credentials=tokens
		res.redirect('/')
	})
	
  });

app.post('/createSheet',async (req,res)=>{
	const sheetData=await extra.fetchDataFromAPI()
	const sheetHeaders=sheetData['sheetHeaders']
	const sheetContent=sheetData['sheetValues']
	const sheetname=req.body.sheetname

	const sheetID=await extra.fillSheetWithAPIDATA(client,sheetData,sheetname)
	console.log(sheetID)
	res.send(sheetID)

})

app.post('/downloadsheet',async (req,res)=>{
	const downloadID="1rwhcADPOtSc5-xhfTHZOcgGxjZzoHN9F5CCGb9UNbSU"
	const drive = google.drive({version:"v3",auth:client})
	drive.files.get({
		fileId:downloadID,
		alt:"media"
	})
	
	
})



exports.helloWorld = functions.https.onRequest(app)
