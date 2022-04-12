const { app } = require('../index')
const supertest = require('supertest')
const User = require('../models/User')

const api = supertest(app)

const initialNotes = [
  {
    content: 'Aprendiendo FullStack',
    important: true,
    date: new Date(),
  },
  {
    content: 'Seguime en ig o me mato',
    important: true,
    date: new Date(),
  }
]


getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map(note => note.content),
    response
  }
}

const getUsers = async () => {
  const usersDB = await User.find({}) //recupera usuarios
  return usersDB.map(user => user.toJSON())
}



module.exports = {
  initialNotes,
  api,
  getAllContentFromNotes,
  getUsers
}