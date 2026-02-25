import React, { useEffect, useRef, useState } from 'react'
import Card from './Card'
import SkeletonCard from './SkeletonCard'
import Page from './Page'
import { throttle } from 'lodash'

// 쓰로틀
// const throttle = (fn, delay) => {
//   let timer = null
//   return (...args) => {
//     if (!timer) {
//       timer = setTimeout(() => {
//         fn(...args) // 원본 함수 호출
//         timer = null  // 타이머 제거
//       }, delay)
//     }
//   }
// } - 라이브러리 설치

const List = ({ todoList, onToggle, onRemove, loading,getList, initialPagination }) => {
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
  // 이전 스크롤 위치
  const prevScrollTop = useRef(0)
  
  // state
  const [currentPage, setCurrentPage] = useState(1)   // 현재 페이지
  const [pages, setPages] = useState([])   // 현재 페이지
  const [lastPage, setLastPage] = useState(initialPagination?.last || null)

  // 페이지 고정X
  // currentPage 접근하기 위해서는 state 아래 있어야 함
  const currentPageRef = useRef(currentPage)
  const lastPageRef = useRef(lastPage)
  const pagesRef = useRef(pages)

  // 페이지 + 1 누적시키기
  useEffect( () => { currentPageRef.current = currentPage }, [currentPage])
  useEffect( () => { lastPageRef.current = lastPage }, [lastPage])
  useEffect( () => { pagesRef.current = pages }, [pages])

  // 초기 데이터 페이지로 설정
  useEffect(() => {
    if( todoList.length > 0 || (todoList.length === 0) && initialPagination ) {
      const initialPage = {
        // pageNum인 이유
        // 초기 데이터(todoList): Container 에서 이미 가져온 첫 화면용 데이터
        // -> List 의 pages 구조에 맞춰 넣으려고, 초기 페이지 만든 것
        pageNum: 0,   // 초기 데이터는 pageNum 을 0으로 설정
        data: todoList,   
        pagination: initialPagination || {
          page: 1,
          size: initialPagination.size,
          total: initialPagination.total,
          count: initialPagination.count,
          start: initialPagination.start,
          end: initialPagination.end,
          first: 1,
          last: initialPagination.last
        }
      }
      console.log(`초기 페이지: ${initialPage}`)
      // 초기 페이지가 이미 있는지 확인
      setPages(prev => {
        // [].some( 조건 ): 배열 안에 조건을 만족하는 요소가 하나라도 있으면 true 반환
        // - prev 배열 안에 pageNum 이 0인 페이지 하나라도 있다면 true
        const hasInitialPage = prev.some(page => page.pageNum === 0)
        // 기존 초기 페이지 업데이트
        if (hasInitialPage) {
          return prev.map(page => page.pageNum === 0 ? initialPage : page)
        } else {
          // 새로운 초기 페이지 추가
          return [initialPage, ...prev]
        }
      })
    }
  },[todoList, initialPagination])

  // 다음 페이지 데이터 추가 함수
  const addPage = (pageNum) => {
    // 이미 불러와진 페이지이면 스킵
    if ( pages.some(page => page.pageNum === pageNum )) {
      return 
    }
    const url= `http://localhost:8080/todos?page=${pageNum}`
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('응답 데이터: ', data)
        // data: { list: [], pagination: { currentPage, size, start, end, first, last, total } }

        // 마지막 페이지 데이터 저장
        setLastPage(data.pagination.last)
        // 마지막 페이지 초과하면 중단
        if ( pageNum > data.pagination.last ) {
          alert('마지막 페이지입니다.')
          return
        }

        // 새 페이지 데이터 추가
        const newPage = {
          pageNum: pageNum,   // 현재 페이지
          data: data.list,    // 할 일 목록
          pagination: data.pagination   // 페이지 정보
        }

        setPages( prev => [...prev, newPage] )  // 이전 상태에 새 페이지 데이터 누적
        setCurrentPage(pageNum)   // 현재 페이지 업데이트
      })
      .catch( error => { console.error() })
  }


  
  // 스크롤 이벤트를 마운팅 될 때 1번만 정의 및 등록
  // : 쓰로틀 적용
  useEffect(() => {
    const todoListElement = todoListRef.current

    // 스크롤 이벤트 핸들러
    const handleScroll = throttle( () => {
      const { scrollHeight, scrollTop, clientHeight } = todoListRef.current

      // 이전 스크롤보다 현재 스크롤 위치가 더 크면, 스크롤 아래
      const isScrollDown = scrollTop > prevScrollTop.current
      // 이전 스크롤 위치 업데이트
      prevScrollTop.current = scrollTop

      // 스크롤 맨 마지막 도달
      if ( isScrollDown && clientHeight + scrollTop >= scrollHeight - 1) {
        // alert('스크롤 맨 마지막입니다.')
        const nextPage = currentPageRef.current + 1
        // 마지막 페이지를 초과하면 요청하지 않음
        if( lastPageRef.current === null || nextPage <= lastPageRef.current) {
          addPage(nextPage)
        }
        if( lastPageRef.current != null && nextPage > lastPageRef.current ) {
          alert('마지막 페이지입니다.')
        }
      }
    }, 2000 )
    
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
        pages.length > 0 
        ? 
        (
          // 수정
          [...pages]
            .map(page => {
              const isInitialPage = page.pageNum === 0
              return (
                <Page 
                  key={`page-${page.pageNum}`}
                  page={page}
                  onToggle={onToggle}
                  onRemove={onRemove}
                  isInitialPage={isInitialPage}
                  getList = { getList }
                />
              )
            })
          // 데이터가 있을 때 - 엘리먼트
          // js : 표현식 { } 으로 묶기
          // - 단, statement 문X
          // - { if (a) {} }
        //   <ul className='initial-list'>
        //     {
        //       // map : key 필요!
        //       todoList.map((todo) => (
        //         <Card key={todo.id} todo={todo} onToggle={onToggle} onRemove={onRemove}/>
        //       ))
        //     }
        // </ul>
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