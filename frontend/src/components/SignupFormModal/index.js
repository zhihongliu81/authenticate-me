import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Modal } from '../../context/Modal';
import SignupForm from './SignupForm';

function SignupFormModal() {
  const [showModal, setShowModal] = useState(false);

  // useEffect(() => {
  //   setShowModal(true)

  // }, [])

  return (
    <>
      <button onClick={() => setShowModal(true)}>Sign up</button>
      {/* <NavLink onClick={() => setShowModal(true)}  to={'/signup'} className='navlink-signup'>Sign up</NavLink> */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <SignupForm close={() => setShowModal(false)}/>
        </Modal>
      )}
    </>
  );
}

export default SignupFormModal;
