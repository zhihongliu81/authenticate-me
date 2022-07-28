// frontend/src/components/LoginFormModal/index.js
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Modal } from '../../context/Modal';
import LoginForm from './LoginForm';

function LoginFormModal() {
  const [showLoginModal, setShowLoginModal] = useState(false);


  // useEffect(() => {
  //   setShowLoginModal(true);
  // }, [])

  return (
    <>
      <button onClick={() => setShowLoginModal(true)}>Log In</button>
      {/* <NavLink onClick={() => setShowLoginModal(true)}  to={'/login'} className='navlink-login'>Log In</NavLink> */}
      {showLoginModal && (
        <Modal onClose={() => setShowLoginModal(false)}>
          <LoginForm close={() => setShowLoginModal(false)}/>
        </Modal>
      )}
    </>
  );
}

export default LoginFormModal;
