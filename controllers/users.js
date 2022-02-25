const bcrypt = require ('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', {
    content: 1,
    date: 1,
    _id: 0
  })
  response.json(users)
})

usersRouter.post('/', async (request, response) =>{
  const {body} = request
  const { username, name, password} = body

  //encripta la password
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User ({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  
  response.json(savedUser)
})

module.exports = usersRouter