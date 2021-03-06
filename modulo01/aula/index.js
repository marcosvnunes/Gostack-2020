const express = require('express');

const server = express();

server.use(express.json())
// query params=  ?teste=1
// Route params = users/1
// body 

const users = ['Diego','Marcos', 'Fabricio']

function checkUserExists (req,res,next){
  if(!req.body.name){
    return res.status(400).json({error: 'user is requerid'})
  }
  return next();
}

function checkUserInArray (req,res,next){
  const user = users[req.params.index]
  if(!user){
    return res.status(400).json({error: 'User does not exist'})
  }
  req.user = user;
  next();
}

server.use((req,res,next)=>{
  console.log(`Método: ${req.method}; URL : ${req.url} `);

  return next();
})

server.get('/users',(req,res)=>{
  return res.json(users);
})

server.get('/users/:index',checkUserInArray,(req,res)=>{
  return res.json(req.user)
})

server.post('/users',checkUserExists,(req,res)=>{
  const { name } = req.body;
  users.push(name);
  
  return res.json(users);
})

server.put('/users/:index',checkUserExists,checkUserInArray,(req,res)=>{
  const { name } = req.body;
  const { index } = req.params;
  users[index] = name;
  return res.json(users);
})

server.delete('/users/:index',checkUserInArray,(req,res)=>{
  const { index } = req.params;
  users.splice(index,1);
  return res.send();
})

server.listen(3000);