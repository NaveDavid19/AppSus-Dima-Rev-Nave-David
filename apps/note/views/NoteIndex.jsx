const { useState, useEffect } = React
const { Link } = ReactRouterDOM

import { NoteAdd } from '../cmps/NoteAdd.jsx'
import { NoteEdit } from '../cmps/NoteEdit.jsx'
import { NoteList } from '../cmps/NoteList.jsx'
import { noteService } from '../services/note.service.js'

export function NoteIndex() {
  const [notes, setNotes] = useState(null)
  const [selectedNote, setSelectedNote] = useState(null)

  useEffect(() => {
    loadNotes()
  }, [])

  // *  --------------------------//CRUD HANDLE //---------------------------  * //

  function loadNotes() {
    noteService
      .query()
      .then((notes) => {
        setNotes(notes)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  function addNote(note) {
    console.log('NoteIndex.addNote', note)
    noteService.save(note).then((note) => {
      setNotes((prevNotes) => [...prevNotes, note])
    })
  }

  function deleteNote(note) {
    const noteId = note.id
    noteService.remove(noteId).then((note) => {
      setNotes((prevNotes) => {
        return prevNotes.filter((prevNote) => prevNote.id !== noteId)
      })
    })
  }

  function editNote(note) {
    setSelectedNote(note)
  }

  function saveNote(note) {
    const noteId = note.id
    noteService.save(note).then((updatedNote) => {
      console.log(updatedNote)
      setNotes((prevNotes) => {
        const idx = prevNotes.findIndex((prevNote) => prevNote.id === noteId)
        prevNotes.splice(idx, 1, updatedNote)
        setSelectedNote(null)
        return prevNotes
      })
    })
  }

  //* -------------------------------------------------------------------------- //

  function todoToggle(note, todo) {
    const noteId = note.id
    const todoId = todo.id

    setNotes((prevNotes) => {
      const noteIndex = prevNotes.findIndex((note) => note.id === noteId)
      const todoIndex = prevNotes[noteIndex].info.todos.findIndex(
        (todo) => todo.id === todoId
      )
      const newNotes = [...prevNotes]

      newNotes[noteIndex].info.todos[todoIndex].isDone =
        !newNotes[noteIndex].info.todos[todoIndex].isDone

      noteService.save(newNotes[noteIndex])
      return newNotes
    })
  }

  function changeBackgroundColor(colorHex, note) {
    const noteId = note.id
    const style = { backgroundColor: colorHex }
    note = { ...note, style }
    console.log(note)
    setNotes((prevNotes) => {
      const noteIndex = prevNotes.findIndex((note) => note.id === noteId)
      prevNotes[noteIndex] = { ...prevNotes[noteIndex], ...note }
      const newNotes = [...prevNotes]
      noteService.save(newNotes[noteIndex])
      return newNotes
    })
  }

  if (!notes) return <div>Loading... </div>
  return (
    <section className="note-index">
      <Link to={'search'}>Search</Link>
      <NoteAdd addNote={addNote} />
      <NoteList
        notes={notes}
        changeBackgroundColor={changeBackgroundColor}
        deleteNote={deleteNote}
        editNote={editNote}
        todoToggle={todoToggle}
      />
      
      {selectedNote && (
        <NoteEdit
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
          saveNote={saveNote}
        />
      )}
    </section>
  )
}
