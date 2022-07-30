import {NavLink, useLocation} from "react-router-dom";
import { useState } from "react";
import './EventsGroupsBar.css'

const EventsGroupsBar = () => {
    let togger
    const location = useLocation();
    if (location.pathname === '/allEvents') togger = true;

    return (
        <div className="events-groups-bar-container">
            <NavLink className={togger ? 'navilink-focused': 'events-groups-bar-events'} to={'/allEvents'}>Events</NavLink>
            <NavLink className={togger ? 'events-groups-bar-groups': 'navilink-focused'} to={'/allGroups'}>Groups</NavLink>
        </div>
    )
}


export default EventsGroupsBar;
