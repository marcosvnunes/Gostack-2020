const express = require('express');

const server = express();

server.use(express.json());

let countAcess = 0
server.use((req,res,next)=>{
  console.log(`Total de requisições: ${++countAcess}`);
  next();
})

const projects = [];

function checkId(req,res,next){
  const {id} = req.params;
  const project = projects.find(project => project.id == id)
  if(!project){
    return res.status(400).json({error:"Project not found"})
  }
  req.project = project;

  next();
}

server.get('/projects',(req,res)=>{
  return res.json(projects);
})

server.post('/projects',(req,res)=>{
  const { id ,title } = req.body;
  projects.push({ id, title, tasks: [] })
  return res.json(projects);
})

server.put('/projects/:id',checkId,(req,res)=>{
  const { title } = req.body;
  const project = req.project

  project.title = title;

  return res.json(project);

})

server.delete('/projects/:id',checkId,(req,res)=>{

  const indexProject = projects.findIndex(project => project.id == id)
  projects.splice(indexProject,1);
  return res.send();

})

server.post('/projects/:id/tasks',checkId,(req,res)=>{
  const title  = req.body.title;

  const project = req.project;

  project.tasks.push(title)
  return res.json(project);
})


server.listen(3000);
