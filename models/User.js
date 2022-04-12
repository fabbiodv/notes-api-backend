const uniqueValidator = require('mongoose-unique-validator');
const {Schema, model} = require('mongoose')

//Schema
const userSchema = new Schema({
  username: { 
    type: String,
    unique: true //uniquevalidator
  },
  name: String,
  passwordHash: String,
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note' //referencia del modelo Note
  }]

})

//Setea el _id a id y borra el _id, __v
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    
    delete returnedObject.passwordHash   //nunca devuelve la password

  }
})

userSchema.plugin(uniqueValidator); //funcionalidad para ver si el campo es unico

const User = model('User', userSchema)

module.exports = User