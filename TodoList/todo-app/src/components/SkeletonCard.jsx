import React from 'react'

// 스켈레톤 카드
// : 데이터 로딩되는 동안 "진짜 카드 모양의 가짜 틀" 먼저 보여주는 UI
const SkeletonCard = () => {
  return (
    <li className='todoItem skeleton-item'>
        <div className='item'>
            <div className='skeleton skeleton-circle'></div>
            <div className='skeleton skeleton-text'></div>
        </div>
        <div className='item'>
            <div className='skeleton skeleton-btn'></div>
        </div>
    </li>
  )
}

export default SkeletonCard