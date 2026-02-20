import React from 'react'

// home 에 있는 변수? 들 전달 받기
const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <div>
        <input type="checkbox" 
            checked={todo.completed}
            // 자식과 부모 이벤트 연결
            // 함수 호출 안하면 계속 호출되므로 함수 호출 필요!
            onChange={() => onToggle(todo.id)}
        />
        <span>
            {todo.text}
        </span>
        <button onClick={() => onDelete(todo.id)}>삭제</button>
    </div>
  )
}

export default TodoItem