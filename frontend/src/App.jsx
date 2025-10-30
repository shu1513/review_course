import {useState, useEffect} from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'
import Footer from './components/Footer'

const App = () => {
const [notes, setNotes]=useState(null)
const [newNote, setNewNote]=useState('')
const [showAll, setShowAll]=useState(true)
const [errorMessage, setErrorMessage] = useState(null)

useEffect(()=>{
  console.log('effect')
  noteService
    .getAll()
    .then(initialNotes=>{
      setNotes(initialNotes)
    })
},[])


const notesToShow = showAll ? notes : notes.filter(note=>note.important===true)

const addNote =(event) => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    important: Math.random()<0.5,
  }
  noteService
    .create(noteObject)
    .then(addedNote => {
      setNotes(notes.concat(addedNote))
      setNewNote('')
    })
}

const toggleImportanceOf = (id) => {
    const note = notes.find(note=>note.id===id)
    if (!note) return
    const change = {important: !note.important}
    noteService
      .update(id, change)
      .then(updatedNote=>{
      setNotes(notes.map(note=>note.id===id?updatedNote:note))
    })
      .catch(
        ()=>{
          setErrorMessage(`Note '${note.content}' was already deleted from the server`)
          setTimeout(()=>{
            setErrorMessage(null)
          },4000)
          setNotes(notes.filter (n=>n.id !==id))
        }
      )
}

const handleNoteChange = (event) =>{
  setNewNote(event.target.value)
}
  if(!notes){
    return null
  }
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <div>
        <button onClick={()=>setShowAll(!showAll)}>
          show {showAll ? 'important':'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note=>
          <Note 
            key={note.id} 
            note={note}
            toggleImportance={()=>toggleImportanceOf(note.id)}
          />
        )
        }
      </ul>
      <form onSubmit={addNote}>
        <input 
        value={newNote}
        onChange={handleNoteChange}
        />
        <button type='submit'>save</button>
      </form>
      <Footer/>
    </div>
  )
}

export default App
