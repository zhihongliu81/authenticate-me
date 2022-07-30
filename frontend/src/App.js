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
      {/* <div>
        <NavLink to={'/allEvents'}>Events</NavLink>
        <NavLink to={'/allGroups'}>Groups</NavLink>
      </div> */}
      <div className="home-page-container">
      {isLoaded && (
        <Switch>
          <Route exact path={'/'}>
            <HomePage trigger={showCreateGroupModal} setTrigger={setShowCreateGroupModal}/>
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
          <Route path={'/api/groups/:groupId'}>
            <GroupDetails />
          </Route>
          <Route path={'/api/events/:eventId'}>
            <EventDetails />
          </Route>
        </Switch>
      )}
</div>
      <div className="homepage-bottom-link">
        <div className="homepage-bottom-link-para">Create your own Meetup Group</div>
        <button onClick={() => {if (user) { setShowCreateGroupModal(true)} else {alert("Please Log in!")}}}>Get Stated</button>
        {showCreateGroupModal && (
        <Modal onClose={() => setShowCreateGroupModal(false)}>
          <CreateGroup close={() => setShowCreateGroupModal(false)}/>
        </Modal>)}

      </div>
    </div>
  );
}

export default App;
