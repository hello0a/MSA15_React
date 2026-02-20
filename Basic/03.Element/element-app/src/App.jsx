import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { Component } from 'react'

// 클래스형 컴포넌트
// rcc
class App extends Component {
  render() {
    // React 엘리먼트 생성
    // 1. React JavaScript 로 엘리먼트 생성
    // <a href="...">구글 사이트...</a>
    const link = React.createElement('a', {
      href: 'http://www.google.com',
      target: '_blank',
      style: { color: 'blue'}  
    }, '구글 사이트 바로가기')
    // <div class="box">Box</div>
    const box = React.createElement('div', {
      className: 'box'
    }, 'Box')
    // <div> <h1> <p> <a> <div>.... </div>
    const element = React.createElement('div', null,
      React.createElement('h1', null, 'Hello Element'),
      React.createElement('p', null, 'This is an Element'),
      link,
      box
    )
    // 2. JSX로 엘리먼트 생성
    const element2 = (
      <div>
        <h1>Hello Element</h1>
        <p>This is an Element</p>
        <a href="http://www.google.com"
          target='_blank'
          style={{color: 'red'}}>구글 사이트 바로 가기</a>
        <div className='box'>Box</div>
      </div>
    )
    return (
      element2
    )
  }
}


export default App
