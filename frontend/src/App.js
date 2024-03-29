// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Route, Switch, useHistory } from "react-router-dom";
import { Modal } from './context/Modal';
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllEvents from "./components/AllEventsList";
import AllGroups from "./components/AllGroupsList";
import GroupDetails from "./components/GroupDetails";
import EventDetails from "./components/Eventdetails";
import YourGroups from "./components/YourGroups";
import CreateGroup from "./components/CreateGroup";
import HomePage from "./components/HomePage";


function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const user = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div className="main-container">
      <Navigation isLoaded={isLoaded} />

      <div className="home-page-container">
        {isLoaded && (
          <Switch>
            <Route exact path={'/'}>
              <HomePage trigger={showCreateGroupModal} setTrigger={setShowCreateGroupModal} />
            </Route>
            <Route path={'/allEvents'}>
              <AllEvents />
            </Route>
            <Route path={'/allGroups'}>
              <AllGroups />
            </Route>
            <Route path={'/yourGroups'}>
              <YourGroups />
            </Route>
            <Route path={'/groups/:groupId'}>
              <GroupDetails />
            </Route>
            <Route path={'/events/:eventId'}>
              <EventDetails />
            </Route>
          </Switch>
        )}
      </div>
      <div className="homepage-empty-div"></div>
      <div className="homepage-bottom-link">
        <div className="homepage-bottom-link-para">
          <p>Create your own Meetnature Group</p>
          <button onClick={() => { if (user) { setShowCreateGroupModal(true) } else { alert("Please Log in!") } }}>Get Stated</button>
        </div>

        {showCreateGroupModal && (
          <Modal onClose={() => setShowCreateGroupModal(false)}>
            <CreateGroup close={() => setShowCreateGroupModal(false)} />
          </Modal>)}
        <div className="homepage-bottom-link-a">
          <a href={'https://github.com/zhihongliu81/authenticate-me'} rel="noreferrer" target="_blank">GitHub Repository</a>
          <a href='https://www.linkedin.com/in/zhihong-liu81/' rel="noreferrer" target="_blank">LinkedIn</a>
        </div>
      </div>

    </div>
  );
}

export default App;
