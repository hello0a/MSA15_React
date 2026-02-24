import React, { useEffect, useRef } from 'react'
import Card from './Card'
import SkeletonCard from './SkeletonCard'

const List = ({ todoList, onToggle, onRemove, loading }) => {
  // const todoList = [
  //   { id: 1, name: '할일1', status: false },
  //   { id: 2, name: '할일2', status: true },
  //   { id: 3, name: '할일3', status: false },
  //   { id: 4, name: '할일4', status: false },
  //   { id: 5, name: '할일5', status: false },
  //   { id: 6, name: '할일6', status: false },
  //   { id: 7, name: '할일7', status: false },
  //   { id: 8, name: '할일8', status: false },
  //   { id: 9, name: '할일9', status: false }
  // ]

  // 스크롤 컨테이너 참조
  const todoListRef = useRef(null)
  const prevScrollTop = useRef(0)

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const { scrollHeight, scrollTop, clientHeight } = todoListRef.current

    // 이전 스크롤보다 현재 스크롤 위치가 더 크면, 스크롤 아래
    const isScrollDown = scrollTop > prevScrollTop.current
    // 이전 스크롤 위치 업데이트
    prevScrollTop.current = scrollTop

    // 스크롤 맨 마지막 도달
    if ( isScrollDown && clientHeight + scrollTop >= scrollHeight - 1) {
      alert('스크롤 맨 마지막입니다.')
    }
  }

  useEffect(() => {
    const todoListElement = todoListRef.current
    // 스크롤 이벤트 등록 - 마운트
    if ( todoListElement ) {
      todoListElement.addEventListener('scroll', handleScroll)
    }
    
    // 스크롤 이벤트 제거 - 언마운트
    return () => {
      if ( todoListElement ) {
        todoListElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])
  

  // fragment <></> 으로 묶기
  // - return 안에 하나의 부모 요소만 허용하므로 여러 요소는 감싸기!
  return (
    <div className='todoList' ref={todoListRef}>
      {
        loading
        ?
        ( 
          // 마운팅 전 - 스켈레톤 카드 3개
          // import 하자..!!!
          <ul className='initial-list'>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </ul>
        ) :
        todoList.length > 0 
        ? 
        (
          // 데이터가 있을 때 - 엘리먼트
          // js : 표현식 { } 으로 묶기
          // - 단, statement 문X
          // - { if (a) {} }
          <ul className='initial-list'>
            {
              // map : key 필요!
              todoList.map((todo) => (
                <Card key={todo.id} todo={todo} onToggle={onToggle} onRemove={onRemove}/>
              ))
            }
        </ul>
        ) : 
        (
          // 데이터가 없을 때 표시 - 엘리먼트
          <div className='empty-state'>
            <div className='empty-message'>
              <h3>할 일이 없습니다</h3>
              <p>새로운 할 일을 추가해보세요!</p>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default List