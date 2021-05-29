const express = require('express');
const morgan = require('morgan');
const app = express();

morgan.token('body', req => JSON.stringify(req.body));

app.use(express.json());

app.use(morgan(':method :url :response-time ms :body'));

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
];

// Just checking that server is working
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Phonebook App</h1>');
});

// get contact list
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

// get specific contact
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  person ? res.json(person) : res.status(404).end();
});

// get info page with number of contacts in phonebook
app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p> 
  <p>${new Date()}</p>`);
});

// delete specific contact
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

// create id
const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0;
  return maxId + 1;
};

// add new contact to the list
app.post('/api/persons', (req, res) => {
  const body = req.body;

  // error checking
  const alreadyAdded = persons.some(person => person.name === body.name);

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

  // create person object to then add in new array
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  res.json(person);
});

const PORT = 3001;
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
// const customLog = morgan(function (tokens, req, res) {
//   console.log(tokens.method(req, res));

//   if (tokens.method(req, res) === 'GET') {
//     return [
//       tokens.method(req, res),
//       tokens.url(req, res),
//       tokens.status(req, res),
//       tokens.res(req, res, 'content-length'),
//       '-',
//       tokens['response-time'](req, res),
//       'ms',
//     ].join(' ');
//   }
//   return [
//     tokens.method(req, res),
//     tokens.url(req, res),
//     tokens.status(req, res),
//     tokens.res(req, res, 'content-length'),
//     '-',
//     tokens['response-time'](req, res),
//     'ms',
//   ].join(' ');
// });
