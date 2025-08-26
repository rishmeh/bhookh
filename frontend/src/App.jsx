import React from 'react'
import './css/App.css'
import { useNavigate } from 'react-router-dom';


const App = () => {
  const navigate = useNavigate();
  return (
    <div className='MainContainer'>
      <h1>Bhookh</h1>
      <h2>One man's waste is another man's treasure....</h2>
      <button onClick={()=>navigate("/donate")}>Donate food</button>
      <button onClick={()=>navigate("/find")}>Find food</button>
      <button
        onClick={() => navigate('/about')}
        style={{
          position: 'fixed',
          right: '1.25rem',
          bottom: '1.25rem',
          padding: '0.8rem 1rem',
          borderRadius: '9999px',
          background: '#111827',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
        }}
      >
        About Us
      </button>
    </div>
  )
}

export default App