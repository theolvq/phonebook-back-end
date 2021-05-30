require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Contact = require('./models/contact');

const app = express();

// use static build
app.use(express.static('build'));
// JSON parser
app.use(express.json());
// log request body
morgan.token('body', req => JSON.stringify(req.body));
app.use(morgan(':method :url :response-time ms :body'));
// allow for Cross Origin Ressource Sharing
app.use(cors());

// const unkownEndpoint = (req, res) => {
//   res.status(404).send({ error: 'unknown endpoint' });
// };

// app.use(unkownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};

app.use(errorHandler);

// get contact list
app.get('/api/persons', (req, res) => {
  Contact.find({}).then(contacts => {
    res.json(contacts);
  });
});

// get specific contact
app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then(contact => (contact ? res.json(contact) : res.status(404).end()))
    .catch(err => next(err));
});

// get info page with number of contacts in phonebook
app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${Contact.length} people</p> 
  <p>${new Date()}</p>`);
});

// delete specific contact
app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndRemove(req.params.id)
    .then(result => res.status(204).end())
    .catch(err => next(err));
});

// create id
/* const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0;
  return maxId + 1;
}; */

// add new contact to the list
app.post('/api/persons', (req, res) => {
  const body = req.body;

  // error checking
  const alreadyAdded = persons.some(contact => contact.name === body.name);

  if (!body.name) {
    return res.status(400).json({
      error: 'name missing',
    });
  } else if (!body.number) {
    return res.status(400).json({
      error: 'number missing',
    });
  } else if (alreadyAdded) {
    return res.status(400).json({
      error: 'name already added',
    });
  }

  // create contact object to then add in new array
  const contact = new Contact({
    name: body.name,
    number: body.number,
    // id: generateId(),
  });

  contact.save().then(savedPerson => {
    res.json(savedPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// exampple of a request logger middleware
// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method);
//   console.log('Path:  ', request.path);
//   console.log('Body:  ', request.body);
//   console.log('---');
//   next();
// };

// app.use(requestLogger);
