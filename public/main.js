//*******Client side Javascript to produce the generated Wu Tang Clan Name *********

var trash = document.getElementsByClassName("fa-trash");
var edit = document.getElementsByClassName("fa-edit");

let firstNames =['Dynamic','Irate','Bittah','Annoying','Vulgar','Phantom','Scratching','Intellectual','Peeping','Wonderful','Dynamic','Irate','Bittah','Annoying','Vulgar','Phantom','Scratching','Intellectual','Peeping','Wonderful']
let lastNames = ['Mastermind','Demon','Contender','Prophet','Wizard','Madman','Swami','Pikachi','Chardroid','Panther','Mastermind','Demon','Contender','Prophet','Wizard','Madman','Swami','Pikachi','Chardroid','Panther']


let sumFirstName = 0;
let sumLastName = 0;
document.querySelector('button').addEventListener('click', ()=>{
  let test1 = document.querySelector('.answer1').value
  let test2 = document.querySelector('.answer2').value
  let test3 = document.querySelector('.answer3').value
  let test4 = document.querySelector('.answer4').value
  let test5 = document.querySelector('.answer5').value
  sumFirstName = test1.length + test2.length
  sumLastName = test3.length + test4.length + test5.length
  console.log(sumFirstName)
  console.log(sumLastName)
  let indexFirstName = determFirst()
  let indexLastName = determLast()
  console.log(`indexFirstName ${indexFirstName}`)
  console.log(`indexLastName ${indexLastName}`)
  let createFirst = generateFirstName(indexFirstName)
  let createLast = generateLastName(indexLastName)
  document.querySelector('.first').textContent = createFirst
  document.querySelector('.last').textContent = createLast
  // sum += document.querySelector('.answer1').value.length
})
//note: when we wrote test wrote globably, we cannot write variable test inside addEventListener and console log it. question?

function determFirst(){
  return Math.floor(sumFirstName/2)
}

function  determLast(){
  return Math.floor(sumLastName/5)
}

function generateFirstName(indexFirstName){
  console.log(`generateFirstName ${firstNames[indexFirstName]}`)
  return firstNames[indexFirstName]
}

function generateLastName(indexLastName){
  console.log(`generateLastName ${lastNames[indexLastName]}`)
  return lastNames[indexLastName]
}


console.log(document.querySelector('.first').innerText)


//Button to send generated name  to database
document.querySelector('#saveNameBut').addEventListener('click', function() {

  let finalFirstName = this.parentNode.childNodes[11].innerText
  let finalLastName = this.parentNode.childNodes[12].nextSibling.innerText
  console.log(finalFirstName)
  console.log(finalLastName)

  fetch('saveName',{
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'wutangname': finalFirstName + " " + finalLastName
    })
  }).then(data => {
    console.log(data)
    window.location.reload(true)
  })
});

Array.from(trash).forEach(function(element) {
  element.addEventListener('click', (event)=> {
    console.log("passed to name", event.target)
    let saveName = event.target.parentNode.parentNode.childNodes[1].innerHTML
    console.log(saveName)
    fetch('deleted',{
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'savename': saveName
      })
    }).then(function (response) { /* ADD THIS  to your fetch */
      window.location.reload()
    })
  });
})

Array.from(edit).forEach(function(element) {
  element.addEventListener('click', (event)=> {
    console.log("passed to name", event.target)
    let saveName = event.target.parentNode.parentNode.childNodes[1].innerHTML
    console.log(saveName)
      let newName = prompt("Please enter new name")
    console.log(saveName)
    fetch('edit',{
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'saveName': saveName,
        'newName': newName
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
})
