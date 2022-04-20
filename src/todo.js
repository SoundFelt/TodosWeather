import React, {useState, useEffect} from 'react'
import { v4 as uuidv4 } from 'uuid';
import TodoItem from './todoitem'
import './todo.css'

function Todo() {

  const [todoInput, setTodoInput] = useState()
  const [todos, setTodos] = useState(JSON.parse(window.localStorage.getItem('todos')) || [])

  const handleNewTodo = (e) => {
    setTodoInput(e.target.value)
  }

  const handleAddTodo = (e) => {
    e.preventDefault()
    if (todoInput) {
      setTodoInput('')
      setTodos([...todos, {todo: todoInput, completed: false, id: uuidv4()}])
    } else {
      return 
    }
  }

  const handleDelete = (id) => {
    const updatedTodoList = todos.filter(el => el.id !== id)
    setTodos(updatedTodoList)
  }

  const updateTodo = (id, editValue) => {
    const updatedTodo = todos.map(todoObj => todoObj.id === id ? {...todoObj, todo: editValue} : todoObj)
    setTodos(updatedTodo)
  }

  const completedToggle = (id) => {
    const updatedTodo = todos.map(todoObj => todoObj.id === id ? {...todoObj, completed: !todoObj.completed} : todoObj)
    setTodos(updatedTodo)
  }

  useEffect(() => {
    window.localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  return (
    <div className="todos-container">
      <h1>Todo List</h1>
        <form className="todo-form" onSubmit={handleAddTodo}>
          <input className="todo-input" placeholder="Enter new todo" onChange={handleNewTodo} 
          type="text" name="todo" value={todoInput}></input>
          <button className="add-button">Add Todo</button>
        </form>

      <div className="todos-list">
      <ul style={{height: '100%'}}>
        {todos.length ? todos.map((todoObj, idx) => {
          return <li key={idx}>
          <TodoItem todo={todoObj.todo} id={todoObj.id} idx={idx} completed={todoObj.completed}
          handleDelete={handleDelete} updateTodo={updateTodo} completedToggle={completedToggle} />
          </li>
        }) : ''}
      </ul>
      </div>
     
    </div>
  )
}

export default Todo