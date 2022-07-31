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
        <ul className="profile-dropdown">
          {/* <li><NavLink to=''>Your events</NavLink></li> */}
          <li><NavLink className={"profile-dropdown-navlink"} to='/yourGroups'>Your groups</NavLink></li>
          <li>{user.firstName}</li>
          <li>{user.lastName}</li>
          <li>{user.email}</li>
          <li>
            <button className="profile-dropdown-logout-buttom" onClick={logout}>Log Out</button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;
