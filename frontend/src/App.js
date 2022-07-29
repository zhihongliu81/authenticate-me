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
import LoginFormModal from "./components/LoginFormModal";
import SignupFormModal from "./components/SignupFormModal";

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
    <>
      <Navigation isLoaded={isLoaded} />
      <div>
        <NavLink to={'/allEvents'}>Events</NavLink>
        <NavLink to={'/allgroups'}>Groups</NavLink>
      </div>


      {isLoaded && (
        <Switch>
          <Route path={'/allEvents'}>
            <AllEvents />
          </Route>
          <Route path={'/allGroups'}>
            <AllGroups />
          </Route>
          {/* <Route path={'/login'}>
            <LoginFormModal />
          </Route>
          <Route path={'/signup'}>
            <SignupFormModal />
          </Route> */}
          <Route path={'/yourGroups'}>
            <YourGroups />
          </Route>
          {/* <Route path={'/createGroup'}>
            <CreateGroup />
          </Route> */}
          <Route path={'/api/groups/:groupId'}>
            <GroupDetails />
          </Route>
          <Route path={'/api/events/:eventId'}>
            <EventDetails />
          </Route>
        </Switch>
      )}

      <div>
        <div>Create your own Meetup Group</div>
        <button onClick={() => {if (user) { setShowCreateGroupModal(true)} else {history.push('/login')}}}>Get Stated</button>
        {showCreateGroupModal && (
        <Modal onClose={() => setShowCreateGroupModal(false)}>
          <CreateGroup close={() => setShowCreateGroupModal(false)}/>
        </Modal>)}
      </div>
    </>
  );
}

export default App;
