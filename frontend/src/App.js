// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { NavLink, Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllEvents from "./components/AllEventsList";
import AllGroups from "./components/AllGroupsList";
import GroupDetails from "./components/GroupDetails";
import EventDetails from "./components/Eventdetails";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
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
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route path={'/allEvents'}>
            <AllEvents />
          </Route>
          <Route path={'/allGroups'}>
            <AllGroups />
          </Route>
          <Route path={'/api/groups/:groupId'}>
            <GroupDetails />
          </Route>
          <Route path={'/api/events/:eventId'}>
            <EventDetails />
          </Route>


        </Switch>
      )}
    </>
  );
}

export default App;
