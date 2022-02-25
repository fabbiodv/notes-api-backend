require('dotenv').config()
require('./mongo')
const express = require('express')
const cors = require ('cors')
const app = express()
const Note = require('./models/Note')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const userExtractor = require('./middleware/userExtractor')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const User = require('./models/User')
const { findById } = require('./models/User')

app.use(express.json())
app.use(cors())


/* const app = http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type' : 'text/plain'})
    response.end(JSON.stringify(notes))
}) */

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', async(request, response) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })
    response.json(notes)
  
}) 

app.get('/api/notes/:id', (request, response, next) => {
  const {id} = request.params
  Note.findById(id).then(note => {
    if (note) {
      return response.json(note)
    } else {
      response.status(404).end()
    }
  }).catch(err =>{
    next(err)
  })
})

app.put('/api/notes/:id', userExtractor, (request, response, next) => {
  const {id} = request.params
  const note = request.body
  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, {new: true})
  .then(result => {
    response.json(result)
  })
})

app.delete('/api/notes/:id', userExtractor, (request, response, next) => {
  const {id} = request.params

  Note.findByIdAndDelete(id).then(() => {

  }).catch(error => next(error)) 

  response.status(204).end()
})



app.post('/api/notes', userExtractor, async (request, response, next) => {

  const {
    content,
    important = false,
  } = request.body

  // sacar userID de request
  const { userId } = request

  const user = await User.findById(userId)

  if (!content) {
    return response.status(400).json({
      error: 'required "content" is missing'
    })
  }

  const newNote = new Note({
    content,
    important,
    date: new Date(),
    user: user._id //relacionar con el usuario
  })

  
  try {
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.json(savedNote)
  } catch (error) {
    next(error)
  }

})



//en api/users usamos el controlador
app.use('/api/users', usersRouter )
app.use('/api/login', loginRouter )

app.use(notFound)

app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
