import React from 'react'

// todo 할당 (props 전달받음)
// - props 객체에서 구조분해 할당한 것!
const Card = ({ todo, onToggle, onRemove }) => {
  let { id, name, status } = todo
  let isActive = status ? 'todoItem active' : 'todoItem'
  // 각 변수 가져왔으므로, todo.name 아닌 name 가능
  return (
    <li className={isActive}>
      <div className='item'>
        <input type="checkbox" 
          id={id}
          checked={status}
          // 매개변수 - todo
          onChange={() => onToggle(todo)}
        />
        {/* <label for="" /> 와 동일 
          라벨만 클릭해도 체크 가능해짐*/}
        <label htmlFor={id}></label>
        <span>{name}</span>
      </div>
      <div className='item'>
        <button className='btn' onClick={() => onRemove(id)}>삭제</button>
      </div>
    </li>
  )
}

export default Card