const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log(
    'please provide the password as an argument: node mongo.js <password>'
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://theoLev:${password}@cluster0.iay88.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model('Contact', personSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => console.log(person.name, person.number));
    mongoose.connection.close();
  });
} else if (process.argv.length > 3) {
  person.save().then(result => {
    console.log(result);
    console.log('Contact Saved!');
    mongoose.connection.close();
  });
}
