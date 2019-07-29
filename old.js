console.log('it worked')

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

let db, collection;

let url = "mongodb+srv://test:test@cluster0-ieizd.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "wutang";

//Array of possible names generated
const firstNames =['Dynamic','Irate','Bittah','Annoying','Vulgar','Phantom','Scratching','Intellectual','Peeping','Wonderful','Dynamic','Irate','Bittah','Annoying','Vulgar','Phantom','Scratching','Intellectual','Peeping','Wonderful']
const lastNames = ['Mastermind','Demon','Contender','Prophet','Wizard','Madman','Swami','Pikachi','Chardroid','Panther','Mastermind','Demon','Contender','Prophet','Wizard','Madman','Swami','Pikachi','Chardroid','Panther']

//functions needed to generate Wu-Tang-Clan name
function determFirst(sumFirstName){
  //return Math.floor(sumFirstName/2)
  return sumFirstName % firstNames.length
}

function  determLast(sumLastName){
  //return Math.floor(sumLastName/5)
  return sumLastName % lastNames.length
}

function generateFirstName(indexFirstName){
  console.log(`generateFirstName ${firstNames[indexFirstName]}`)
  return firstNames[indexFirstName]
}

function generateLastName(indexLastName){
  console.log(`generateLastName ${lastNames[indexLastName]}`)
  return lastNames[indexLastName]
}


app.listen(2020, function(){
  MongoClient.connect(url, {useNewURLParser:true}, (error,client) => {
    if(error){
      throw error;
    }
    db = client.db(dbName)
    console.log("connected to `" + dbName +"`!");
  })
  console.log('listening on 2020')
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))


// .get method with Trek's help, without using mongodb...
//
// app.get('/', (req, res) =>{
//   res.sendFile(__dirname + '/index.html')
// })
//
// app.get('/public/main.js', (req, res) =>{
//   res.sendFile(__dirname + '/public/main.js')
// })
//
// app.get('/public/style.css', (req, res) =>{
//   res.sendFile(__dirname + '/public/style.css')
// })
//
// app.get('/public/images/background.png', (req,res) =>{
//   res.sendFile(__dirname + '/public/images/background.png')
// })

//**Tips from Nick [to be done below]
//**successfuly get data from database
//**figure out how to serve an ejs file with the data from database

//render the url and refresh
//Question: why is there .find() and .toArray() methods? Are they needed for my project?
app.get('/', (req,res) => {
  db.collection('names').find().toArray((err, result) => {
    //an array is inside the result
    if (err) return console.log(err)
    res.render('index.ejs', {names: result})
    //res = response that is going to be rendered
    //passing an array into the ejs template that was gained from the db collection.
    //the actual array is result,
    //key value, i could change the name of the key.
    //name key something you are trying to get.

//Question: how does names connect here to ejs? [object - element with properties]
  //an array that is gained from the collection, that is passed into the ejs template that is render
  })
})

//CREATE - MAKE something into the database - POST method
app.post('/wu-tang-clan-name-generator', (req, res) => {

  //{body.anime,body.smash,body.smash,body.pokemon,body.potter,body.avenger}
  //destructing - the values from the body object___(below)

  //leon notes
  //******Make a fetch that passes the name,
  //pass the value gained from the server side code, this value generates a name, and that that name is stored into the database

  const { anime, smash, pokemon, potter, avenger } = req.body

  let sumFirstName = anime.length + smash.length
  let sumLastName = pokemon.length + potter.length + avenger.length
  console.log(sumFirstName)
  console.log(sumLastName)
  let indexFirstName = determFirst(sumFirstName)
  let indexLastName = determLast(sumLastName)
  console.log(`indexFirstName ${indexFirstName}`)
  console.log(`indexLastName ${indexLastName}`)

  // const { createFirst, createLast} = res.body

  let createFirst = generateFirstName(indexFirstName)
  let createLast = generateLastName(indexLastName)

  //build json object, stringify  and respond back to the front

  //collection
  //save

  //using mongodb - what corrections can I make on the syntax?
  //I would like to get the response portion of the .post method to work
  db.collection('names').save({ anime, smash, pokemon, potter, avenger })
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
})

//UPDATEs the database (targets content and CHANGEs something) - PUT method
app.put('/generatedName', (req, res) => {
  const { anime, smash, pokemon, potter, avenger } = req.body
  db.collection('names').findOneAndUpdate({ anime, smash, pokemon, potter, avenger }, {
    $set: {
      // thumbUp:newCount
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})
