export function NoteImg({ note , deleteNote}) {

  return (
    <article className="note-preview">
      <button onClick={()=>{deleteNote(note)}}>x</button>
      <h2>{note.info.title}</h2>
      <img src={note.info.imgUrl} alt="{note.info.title}"/>
    </article>
  )
}
