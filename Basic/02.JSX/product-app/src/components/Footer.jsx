import React from 'react'

const Footer = () => {
  return (
    <footer style={ styles.footer }>
        <p>Shopping Mall - All rights reserved.</p>
    </footer>
  )
}

const styles = {
    footer: {
        padding: '20px',
        backgroundColor: '#eee',
        marginTop : '50px',
        color: 'black'
    }
}
export default Footer