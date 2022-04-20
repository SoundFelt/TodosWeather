import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashCan, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'

function Todoitem(props) {

    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState('')

    const toggleEditing = () => {
        setIsEditing(!isEditing)
    }

    const handleEditing = (e) => {
        setEditValue(e.target.value)
    }

    const handleEditConfirm = (e) => {
        e.preventDefault()
        toggleEditing()
        if (editValue) {
        props.updateTodo(props.id, editValue)
        } else {
          return
        }
    }

  return (
      <div className="todo-container">
        {isEditing ? <div className="edit-todo-container">
        <input className="edit-todo-input" type='text' defaultValue={props.todo} onChange={handleEditing}></input>
        </div>
        : <div className="todo-info"> <input type="checkbox" checked={props.completed} onChange={() => props.completedToggle(props.id)} /> 
        <span className="todo-idx">{props.idx + 1}. </span><span className="todo-title">{props.todo}</span> </div>}

            
        {!isEditing ? <div className="todo-icons">
          <FontAwesomeIcon className="edit-button" onClick={toggleEditing} icon={faPenToSquare}/>
          <FontAwesomeIcon className="delete-button" onClick={() => props.handleDelete(props.id)}icon={faTrashCan} />
        </div>
        : <div><FontAwesomeIcon onClick={handleEditConfirm} className="confirm-button" icon={faCheck}/>
        <FontAwesomeIcon className="cancel-button" onClick={toggleEditing} icon={faXmark} /> </div>}
      </div>
  )
}

export default Todoitem