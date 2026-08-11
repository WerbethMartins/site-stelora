import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import googleIcon from '../assets/img/google.png';

function CustomGoogleButton({ onSuccess, onError }) {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('Token:', tokenResponse);
      onSuccess?.(tokenResponse);
    },
    onError: () => {
      console.log('Falha na autenticação');
      onError?.();
    },
    flow: 'implicit',
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'none',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        cursor: 'pointer',
      }}
    >
      <img src={googleIcon} alt="Google" style={{ width: '40px', height: '40px' }} />
    </button>
  );
}

export default CustomGoogleButton;