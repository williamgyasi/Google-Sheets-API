const express = require('express');
const app = express();
const path =require('path')
const bodyParser=require('body-parser')
const opn = require('opn');
const {google} = require('googleapis');
const urlencodedparser = bodyParser.urlencoded({extended:false})
const fs = require('fs');

//Modules
const extra=require('./modules')

app.use(bodyParser.urlencoded({extended:false}))


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.get('/fetchAPI',async(req,res)=>{
	res.send(await extra.fetchDataFromAPI())
})

app.post('/testingAjax', (req, res) => {
  console.log(req.body)
});

const keyfile = path.join(__dirname, 'credentials.json');
const keys = JSON.parse(fs.readFileSync(keyfile));
const scopes = [
	'https://www.googleapis.com/auth/spreadsheets.readonly',
	'https://www.googleapis.com/auth/spreadsheets',
];

const client = new google.auth.OAuth2(
	keys.web.client_id,
	keys.web.client_secret,
	keys.web.redirect_uris[5]
  );



this.authorizeUrl = client.generateAuthUrl({
	access_type: "offline",
	scope: scopes,
  });
  
app.get('/', async(req, res) => {
	// open(this.authorizeUrl, {wait: false});
	await opn('https://sindresorhus.com');
	res.render('index.pug')
	console.log("APP HAS STARTED")
});

app.get('/authclient', async(req, res) => {
	const code =req.query.code;
	client.getToken(code,(err,tokens)=>{
		if(err){
			console.error('Error getting oAuth tokens:');
      		throw err;
		}

		// client.credentials=tokens
		client.setCredentials(tokens)
		console.log(tokens.access_token)
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


const PORT = process.env.PORT ||8080 ;

app.listen(PORT, () => {

	console.log(`App is listening on Port NUMBER ${PORT}!`);
	opn(this.authorizeUrl, {wait: false});
});