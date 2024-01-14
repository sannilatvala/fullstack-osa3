const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const phoneName = process.argv[3]
const phoneNumber = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@atlascluster.d7isvbq.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', phoneSchema)

if (process.argv.length === 3) {
  Person
    .find({})
    .then(persons => {
      console.log('phonebook:')
      persons.forEach(person => {
        console.log(person)
      })
      mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
  const newPerson = new Person({
    name: phoneName,
    number: phoneNumber,
  })

  newPerson
    .save()
    .then(() => {
      console.log(`added ${phoneName} number ${phoneNumber} to phonebook`)
      mongoose.connection.close()
    })
} else {
  console.log('Invalid number of arguments')
  mongoose.connection.close()
}
