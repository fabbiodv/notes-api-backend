const bcrypt = require ('bcrypt') //paquete para encriptar password
const usersRouter = require('express').Router() 
const User = require('../models/User')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', { //traigo usuarios con las notas
    content: 1,
    date: 1,
    _id: 0
  })
  response.json(users)
})

usersRouter.post('/', async (request, response) =>{
  try{
  const {body} = request
  const { username, name, password } = body


  //encripta la password
  const saltRounds = 10 //coste de computacion para generar el pass
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User ({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  
  response.status(201).json(savedUser)

} catch (error) {
  console.error(error)
  response.status(400).json({error})
}

})

module.exports = usersRouter