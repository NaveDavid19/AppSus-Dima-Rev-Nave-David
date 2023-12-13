const { useState } = React
import { noteService } from '../services/note.service.js'

export function NoteTxt({ note, deleteNote, editNote, saveNote, from }) {
  const [id, setId] = useState(note.id)
  const [newNoteInfo, setNewNoteInfo] = useState({
    title: note.info.title,
    txt: note.info.txt,
  })

  function onSubmitHandle(ev) {
    ev.preventDefault()
    let emptyNote = noteService.getEmptyNote()
    emptyNote.info = { ...emptyNote.info, ...newNoteInfo }
    let newNote = {...emptyNote, id}
    saveNote(newNote)
  }

  function onChangeHandle(ev) {
    const target = ev.target
    const field = target.name
    const value = target.value

    setNewNoteInfo({ ...newNoteInfo, [field]: value })
  }

  switch (from) {
    //* ---------------------------------------------------------------- //
    case 'noteList':
      return (
        <article className="note-preview">
          <button
            onClick={() => {
              deleteNote(note)
            }}>
            x
          </button>

          <button
            onClick={() => {
              editNote(note)
            }}>
            edit
          </button>

          <h2>{note.info.title}</h2>
          <h3>{note.info.txt}</h3>
        </article>
      )
    //* ---------------------------------------------------------------- //
    case 'noteEdit':
      return (
        <article className="note-preview-edit">
          <form onSubmit={onSubmitHandle}>
            <input
              onChange={onChangeHandle}
              type="text"
              value={newNoteInfo.title}
              placeholder="Title"
              name="title"
              id="title"
            />

            <textarea
              onChange={onChangeHandle}
              rows="4"
              cols="50"
              value={newNoteInfo.txt}
              placeholder="Take a note..."
              name="txt"
              id="txt"
            />
            <button>Save</button>
          </form>
        </article>
      )
  }
}
