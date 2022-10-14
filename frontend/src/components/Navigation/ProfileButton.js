// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import {NavLink, useHistory} from 'react-router-dom';
import * as sessionActions from '../../store/session';
import './ProfileButton.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout()).then(() => {history.push('/')});
  };

  return (
    <div className="profile-button-container">
      <button className="profile-button-icon" onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>
      {showMenu && (
        <div className="profile-dropdown">
          {/* <li><NavLink to=''>Your events</NavLink></li> */}
          <NavLink className={"profile-dropdown-navlink"} to='/yourGroups'>Your groups</NavLink>
          <p>{user.firstName} {user.lastName}</p>
          <p>{user.email}</p>
          <p className="profile-dropdown-logout" onClick={logout}>Log Out</p>
        </div>
      )}
    </div>
  );
}

export default ProfileButton;
