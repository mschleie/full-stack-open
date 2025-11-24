import { useEffect, useState } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Filter = (props) => {
  return (
    <div>
      filter shown with <input value={props.filterText} onChange={props.handleFilterChange}/>
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addName}>
      <div>
        name: <input value={props.newName} onChange={props.handleNameChange}/>
      </div>
      <div>
        number: <input value={props.newNumber} onChange={props.handleNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = (props) => {
  console.log('Persons Component props', props)
  return (
    <ul>
      {props.personsToShow.map(person =>
        <li key={person.id}>
          <Person id={person.id} name={person.name} number={person.number} handleDelete={() => props.handleDeleteOf(person.id)}/>
        </li>
      )}
    </ul>
  )
}

const Person = (props) => {
  return (
    <p>
      {props.name} {props.number}
      <button onClick={props.handleDelete}>delete</button>
    </p>
  )
}

const Notification = (props) => {
  if (props.message === null) {
    return null
  }
  return (
    <div className="notification">
      {props.message}
    </div>
  )
}

const App = () => {
  
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')
  const [nofiticationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  const fireNotification = (text) => {
    setNotificationMessage(text)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const addName = (event) => {
    event.preventDefault()

    const nameToAdd = newName
    const numberToAdd = newNumber

    if (persons.some(person => person.name === nameToAdd)) {
      if (confirm(`${nameToAdd} is already added to phonebook, replace the number with a new one?`)) {
        console.log("Update phonenumber")
        const newPerson = {...persons.find(person => person.name === nameToAdd), number: numberToAdd}
        personService
          .update(newPerson.id, newPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id === returnedPerson.id ? returnedPerson : person))
            // success notification
            fireNotification(`Changed number of ${returnedPerson.name}`)
          })
      } else {
        console.log("No phonenumber update")
      }
    } else {
      const newPerson = {name: nameToAdd, number: numberToAdd}
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName("")
          setNewNumber("")
          // success notification
          fireNotification(`Added ${returnedPerson.name}`)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilterText(event.target.value)
  }

  const handleDeleteOf = (id) => {
    if (confirm(`Delete ${persons.find(person => person.id === id).name} ?`)) {
      console.log(`delete ${id}`)
      personService
        .deletePerson(id)
        .then(returnedPerson => {
          console.log("here we are")
          console.log(returnedPerson)
          setPersons(persons.filter(person => person.id != id))
        })
    } else {
      console.log("No delete")
    }
  }

  console.log('App persons', persons)
  const personsToShow = (filterText === "") ? persons : persons.filter(person => person.name.toLowerCase().startsWith(filterText.toLowerCase()))

  return (
    <div>
      <Notification message={nofiticationMessage}/>
      <h2>Phonebook</h2>
      <Filter filterText={filterText} handleFilterChange={handleFilterChange}/>

      <h2>Add a new</h2>
      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleDeleteOf={handleDeleteOf}/>
    </div>
  )
}

export default App