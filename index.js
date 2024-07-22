const express = require('express') // importing express, which this time is a function that is used to create an Express app stored in the app variable.
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(bodyParser.json())
app.use(express.json())
app.use(cors())


// app.use((req, res, next) => {
//   if (req.method === 'POST' && req.body) {
//     req.bodyData = JSON.stringify(req.body);
//   }
//   next();
// });

// // Define a custom token to log the request body
// morgan.token('body', (req) => {
//   return req.bodyData || '';
// });

// // Configure Morgan to use the custom format including the request body
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     important: true
//   },
//   {
//     id: 2,
//     content: "Browser can execute only JavaScript",
//     important: false
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true
//   }
// ]

// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>')
// })

// app.get('/api/notes', (request, response) => {
//   response.json(notes)
// })

// app.get('/api/notes/:id', (request, response) => {
//   const id = Number(request.params.id)
//   const note = notes.find(note => note.id === id)
//   if (note) {
//     response.json(note)
//   } else {
//     response.status(404).end()
//   }
// })

// app.delete('/api/notes/:id', (request, response) => {
//   const id = request.params.id
//   notes = notes.filter(note => note.id !== id)

//   response.status(204).end()
// })

// const generateId = () => {
//   const maxId = notes.length > 0
//     ? Math.max(...notes.map(n => Number(n.id)))
//     : 0
//   return String(maxId + 1)
// }

// app.post('/api/notes', (request, response) => {
//   const body = request.body

//   if (!body.content) {
//     return response.status(400).json({ 
//       error: 'content missing' 
//     })
//   }

//   const note = {
//     content: body.content,
//     important: Boolean(body.important) || false,
//     id: generateId(),
//   }

//   notes = notes.concat(note)

//   response.json(note)
// })

// FOR PERSONS EXERCISES

let persons = [
  { 
    id: "1",
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: "2",
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: "3",
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: "4",
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  const nameAndNumber = persons.map(person => [person.name, person.number, person.id])
  const html = nameAndNumber.map(person => {
    return `
      <p>
        ${person[0]}: ${person[1]} 
        <button onClick="deletePerson('${person[2]}')">Delete</button>
      </p>
    `;
  }).join('');

  response.send(`
    <html>
      <body>
        <h2>Persons</h2>
        <button onClick="addPerson()">Add new person</button>
        ${html}
        <script>
        async function addPerson() {
          const name = document.getElementById('name').value;
          const number = document.getElementById('number').value;

          if (!name || !number) {
            alert('Name and number are required');
            return;
          }

          const response = await fetch('/api/persons');
          const persons = await response.json();
          const existingPerson = persons.find(person => person.name === name);

          if (existingPerson) {
            const update = window.confirm(\`\${name} already exists. Do you want to update the number for this person?\`);
            if (update) {
              await updatePerson(existingPerson.id, number);
            }
          } else {
            await addNewPerson(name, number);
          }
        }

        async function addNewPerson(name, number) {
          const response = await fetch('/api/persons', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, number })
          });

          if (response.ok) {
            window.location.reload();
          } else {
            alert('Failed to add new person');
          }
        }

        async function updatePerson(id, number) {
          const response = await fetch('/api/persons/' + id, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ number })
          });

          if (response.ok) {
            window.location.reload();
          } else {
            alert('Failed to update person');
          }
        }

        function deletePerson(id) {
          fetch('/api/persons/' + id, {
            method: 'DELETE'
          })
          .then(response => {
            if (response.ok) {
              window.location.reload();
            } else {
              alert('Failed to delete person');
            }
          });
        }
        </script>
      </body>
    </html>
  `)
})

            // if (response.ok) {
            //   console.log(response)
            //   // Reload the page to reflect changes
            //   // if (response.body.find(person => person.name === response.body.name)) {
            //   //   window.confirm(\`\${props.name} is already added to phonebook, replace the old number with a new one?\`)
            //   // }
            //   // window.location.reload();
            // } else {
            //   alert('Failed to add person');
            // }

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  console.log(`Received request for person with ID: ${id}`);
  const person = persons.find(person => person.id === id)
  if (person) {
    response.send(`
    <h3>${person.name}</h3>
    <p>Number: ${person.number}</p>`)
  } else {
    response.status(404).send(`
      <h3>404 Not Found</h3>
      <p>Person with ID ${id} not found</p>
    `)
  }
})

app.get('/info', (request, response) => {
  let total = `Phonebook has info for ${persons.length} people`
  const dateAndTime = new Date()
  console.log(total, dateAndTime)
  response.send(`
    <p>${total}</p>
    <p>${dateAndTime}</p>
  `);
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).send(`
    <p>Person with ID of ${id} has been deleted</p>
  `)
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

const existingPerson = (body) => {
  const existing = persons.find(person => person.name === body.name)
  return existing ? true : false
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    });
  } else if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    });
  } else if (existingPerson(body)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)
  response.json(person)
})

app.put('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const body = request.body;

  const personIndex = persons.findIndex(person => person.id === id);
  if (personIndex === -1) {
    return response.status(404).json({ error: 'Person not found' });
  }

  persons[personIndex].number = body.number;
  response.json(persons[personIndex]);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})