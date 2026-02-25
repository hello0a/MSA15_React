import React, { useEffect, useState, useRef } from 'react'
import Header from './Header'
import Input from './Input'
import List from './List'
import Footer from './Footer'
import Petals from "./Petals"
import Toast from "./Toast";

const Container = () => {

  // state - import 매우 중요!!
  const [input, setInput] = useState('')    // input: 문자열 ''
  const [todoList, setTodoList] = useState([])  // todoList: 배열 []
  const [loading, setLoading] = useState(true)  // 초기값 true
  const [initialPagination, setInitialPagination] = useState(null) // 초기 페이지 정보
  const [listKey, setListKey] = useState(0) // List 컴포넌트 리셋하기 위한 key
  const [celebrate, setCelebrate] = useState(false)  // 꽃잎
  const [toast, setToast] = useState(false) // toast

  const prevAllDoneRef = useRef(false)

  // 데이터 목록 요청
  const getList = () => {
    console.log('할 일 목록 데이터 요청합니다...');

    const url = 'http://localhost:8080/todos'
    // fetch: 서버에서 데이터 가져오는 코드
    // Promise 체인 방식 : .then()
    fetch(url)  // 1. 서버 요청
      .then( response => response.json() )  // 2. 응답 받아서 JSON 반환 -> 서버 응답 처음에 JSON '문자열' 형태이므로, JS 객체로 변환
      .then( data => {  // 3. data 받음 -> 이거 진짜 중요! 
        console.log('응답 데이터: ', data)
        // data.list: 할 일 목록
        // data.pagination: 페이지 정보
        setTodoList( data.list )  // 3. state 저장 -> 렌더링 다시 실행(자동) (React 핵심 코드: state 바뀌면 자동 렌더링)
        setInitialPagination( data.pagination)
      })
      .catch( error => {
        console.error('error: ', error);
      })
      // 요청 완료되면 성공하든 실패하든 상관 없이 setLoading 받기
      .finally( () => {
        setLoading(false)
      })
  }


  // 할 일 추가
  const onSubmit = async (e) => {
    e.preventDefault()  // 기본 이벤트 동작 방지 - form 이 아닌 fetch 비동기로 가져오기
    let name = input
    if( input == '' ) name = '제목없음'

    // 데이터 등록 요청
    const data = {
      name: name,
      status: false,
      seq: 1
    }
    const option = {
      method: 'POST',
      // headers: 서버에게 요청 보낼 때 같이 보내는 '정보 설명서'
      headers: {
        'Content-Type': 'application/json'
      },
      // 문자열 JSON 형태로 변환
      // 흐름 중요!
      // 1. 프론트 : JS 객체 -> JSON.stringify -> JSON 문자열 보냄
      // 2. 서버 : JSON 문자열 -> 자동 파싱(@RequestBody) -> Java 객체
      // 즉, 서버와 브라우저는 문자열(JSON)로 통신!
      body: JSON.stringify(data)
    }
    try {
      const url = 'http://localhost:8080/todos'
      // Promise 기다리는 문법 : async / await 방식
      // .then 과 동일
      const response = await fetch(url, option) // 서버 응답 올 때까지 기다림 - url로 요청 보내고, option은 요청 방법 설명서
      const msg = await response.text() // 응답 변환 끝날 때까지 기다림 - SUCCESS, FAIL
      console.log('응답 메세지: ', msg)
      // 할 일 등록 성공
      if( response.ok ) {
        console.log('할 일 등록 성공')
        // 할 일 목록 요청
        getList()
        // List 컴포넌트 리셋
        setListKey(prev => prev + 1)
        // 입력 값 비우기
        setInput('')
      } else {
        // 할 일 등록 실패
        console.log('할 일 등록 실패')
      }
    } catch (error) {
      console.error(error)
    }
  }
  // 할 일 입력 변경 함수
  const onChange = (e) => {
    // e.target: <input> 자체 접근
    // e.target.value: input 에서 입력한 value 접근
    console.log(e.target.value)
    setInput( e.target.value )
  }


  // 할 일 완료 - todo 객체 매개변수로 전달!
  const onToggle = async (todo) => {
    // 할 일 완료 수정 요청
    // 기존 todo는 그대로 복사하고, status 값만 반대로 바꾼 새 객체 만들기
    const data = {
      ...todo,  // 스프레드 문법: todo 객체 안의 내용을 펼쳐서 복사
      status: !todo.status  // todo.status 반대로 바꾸기 - React는 state 직접 수정 금지하므로 새 객체 만들어야함
      // 새 객체 생성 -> 변경 감지 -> 리렌더링 (즉, 복사본 만들어서 수정) / react 불변성 개념
    }
    const option = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    }
    try {
      const url = 'http://localhost:8080/todos'
      const response = await fetch(url, option)
      const msg = await response.text()
      console.log('응답 메세지: ', msg)
      if ( response.ok ) {
        console.log('할 일 수정 성공')
        getList()
      } else {
        console.log('할 일 수정 실패')
      }
    } catch (error) {
      console.error('응답 실패: ', error)
    }
  }
  

  // 할 일 삭제
  const onRemove = async (id) => {
    const option = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application.json'}
    }

    try {
      const url = `http://localhost:8080/todos/${id}`
      const response = await fetch(url, option)
      const msg = await response.text()
      console.log('응답 메시지: ', msg)
      if (response.ok) {
        console.log('할 일 삭제 성공')
        getList()
      } else {
        console.log('할 일 삭제 실패')
      }
    } catch (error) {
      console.error('응답 실패: ', error)
    }
  }

  // 전체 완료
  const onCompleteAll = async () => {
    const url = 'http://localhost:8080/todos/bulk'
    const option = { method: 'PUT' }
    try {
      const response = await fetch(url, option)
      const msg = await response.text()
      console.log('응답 메시지: ', msg)
      if ( response.ok ) {
        console.log('전체 완료 성공')
        getList()
      } else {
        console.log('전체 완료 실패')
      }
    } catch (error) {
      console.error('응답 실패: ', error)
    }
  }


  // 전체 삭제
  const onRemoveAll = async () => {
    const url = 'http://localhost:8080/todos/bulk'
    const option = { method: 'DELETE' }
    try {
      const response = await fetch(url, option)
      const msg = await response.text()
      console.log('응답 메시지: ', msg)
      if ( response.ok ) {
        console.log('전체 삭제 성공')
        getList()
      } else {
        console.log('전체 삭제 실패')
      }
    } catch (error) {
      console.error('응답 실패: ', error)
    }
  }


  // 꽃잎
  const triggerPetals = () => {
    console.log("🌸 triggerPetals");
    setCelebrate(false)
    requestAnimationFrame(() => setCelebrate(true))
  }
  useEffect(() => {
  const hasItems = todoList.length > 0;
  const allDone = hasItems && todoList.every(t => t.status === true);

  // ✅ 이전에는 전체완료가 아니었는데, 이번에 전체완료가 됐을 때만 1회 터짐
  if (!prevAllDoneRef.current && allDone) {
    triggerPetals();
    triggerToast();
  }

  prevAllDoneRef.current = allDone;
  }, [todoList]);


  // toast 
  const triggerToast = () => {
    setToast(false)
    requestAnimationFrame(() => setToast(true))
  }


  // 컴포넌트가 마운트 될 때, 할 일 목록 요청
  // 처음 렌더링(마운트) 될 때 한 번 실행
  useEffect(() => {
    getList()
  }, [])  // 핵심: [] 의존성 배열 -> 없으면 렌더링될 때마다 계속 실행
  // [todoList] -> 값 넣으면 바뀔 때마다 실행
  
  return (
    <div className='container'>
      <Toast show={toast} message="할 일 완성!" />
      <Petals show={celebrate} />
      <Header />
      <Input input={input} onChange={onChange} onSubmit={onSubmit} />
      <List 
        key={listKey}
        todoList={todoList}
        onToggle={onToggle}
        onRemove={onRemove}
        loading={loading}
        getList={getList}
        initialPagination={initialPagination}
      />
      <Footer onCompleteAll = {onCompleteAll} onRemoveAll={onRemoveAll} />
    </div>
  )
}

export default Container