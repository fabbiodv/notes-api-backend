const bcrypt = require ('bcrypt') //paquete para encriptar password
const User = require("../models/User")
const { api, getUsers} = require ('./helpers')
const mongoose = require('mongoose')
const {server} = require('../index')

describe('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('pswd', 10)
    const user = new User ({ username: 'miduroot', passwordHash})

    await user.save()
  })

  test('work as expected creating a fresh username',
  async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'fabbiodv',
      name: 'Fabio',
      password: 'tw1tch'
    }

    await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  //Hecho con TDD (Test Drive Development)
  test('creation fails with proper statuscode and message if username is already token',
  async () => {
    const usersAtStart = await getUsers()

    const newUser = { //crea usuario
      username: 'miduroot',
      name: 'Miguel',
      password: 'tw1tch'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

      expect(result.body.error.errors.username.message).toContain('`username` to be unique' )

      const usersAtEnd = await getUsers() //usuarios del principio misma length que al final
      expect(usersAtEnd).toHaveLength(usersAtStart.length) 

  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})