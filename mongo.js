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

const contactSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Contact = mongoose.model('Contact', contactSchema);

const contact = new Contact({
  name: process.argv[3],
  number: process.argv[4],
});

// const contact = new Contact({
//   name: 'Lily Leveque',
//   number: 6043548946,
// });

if (process.argv.length === 3) {
  Contact.find({}).then(result => {
    result.forEach(contact => console.log(contact.name, contact.number));
    mongoose.connection.close();
  });
} else if (process.argv.length > 3) {
  contact.save().then(result => {
    console.log(result);
    console.log('Contact Saved!');
    mongoose.connection.close();
  });
}
