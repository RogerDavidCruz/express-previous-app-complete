//*******Server side Javascript code *********

console.log('it worked')

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

let db, collection;

let url = "mongodb+srv://test:test@cluster0-ieizd.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "wutang";


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

app.get('/', (req,res) => {
  db.collection('names').find().toArray((err, result) => {
    console.log('user names from database: ', result)
    if (err) return console.log(err)
    res.render('index.ejs', {names: result})

  })
})

//CREATE - MAKE something into the database - POST method
app.post('/saveName', (req, res) => {
  console.log("this is the wuTangName",req.body.wutangname)
  db.collection('names').save({savename: req.body.wutangname}, (err, result) =>{
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})


//UPDATEs the database (targets content and CHANGEs something) - PUT method
//I want to let the user edit their generated Wu Tang Name []
app.put('/edit', (req, res) => {
  db.collection('names').findOneAndUpdate({savename: req.body.saveName}, {
    $set: {
    savename: req.body.newName
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

//*******Server Side JS for delete endpoint
//note "/deleted" must match the fetch on the client side js"
app.delete('/deleted', (req, res) => {
  console.log('about to delete this name: ', req.body.savename)
  db.collection('names').findOneAndDelete({savename: req.body.savename}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
    console.log('message deleted', result)
  })
})
