const {Schema, model} = require('mongoose')

//Schema
const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean,
  user: {
    type : Schema.Types.ObjectId,
    ref: 'User'
  }
})

//Setea el _id a id y borra el _id, __v
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

//Modelo con schema
const Note = model('Note', noteSchema)

/* Note.find({}).then(result => {
  console.log(result)
  mongoose.connection.close()
}) */

/*  const note = new Note ({
  content: 'MongoDB esta nazi',
  date: new Date (),
  important: true
})

note.save()
.then(result => {
  console.log(result)
  mongoose.connection.close()
})
.catch(err => {
  console.error(err)
})  */

module.exports = Note