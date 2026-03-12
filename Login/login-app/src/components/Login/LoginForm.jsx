import React from 'react'
import './LoginForm.css'
import useAuth from '../../hooks/useAuth'

const LoginForm = () => {

    const { login } = useAuth()
    
    const onLogin = (e) => {
        e.preventDefault()
        const form = e.target
        const username = form.username.value
        const password = form.password.value

        login ( username, password )
    }

  return (
    <div className="form">
        <h2 className="login-title">로그인</h2>
        <form className="login-form" onSubmit={ (e) => onLogin(e) }>
            {/*username*/}
            <div>
                <label htmlFor="username">username</label>
                <input type="text" 
                    id='username'
                    placeholder='username'
                    name='username'
                    autoComplete='username'
                    required
                />
            </div>
            {/*password*/}
            <div>
                <label htmlFor="password">password</label>
                <input type="text" 
                    id='password'
                    placeholder='password'
                    name='password'
                    autoComplete='password'
                    required
                />
            </div>
            <button><img src="/img/kakao_login.png" alt="" /></button>
            <button type='submit' className='btn btn--form btn-login'>로그인</button>
        </form>
    </div>
  )
}

export default LoginForm