import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { loadEventsThunk } from '../../store/events';

const AllEvents = () => {
    const events = useSelector(state => Object.values(state.events));

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadEventsThunk());
    }, [dispatch]);

    if (events.length === 0) {
        return null
    }

    return events.map(event => (
        <div key={event.id}>{`Event ${event.id}: `}
            <NavLink to={`/api/events/${event.id}`}>{`Event ${event.id}`}</NavLink>
            <div>{event.id}</div>
            <div>{event.groupId}</div>
            <div>{event.venueId}</div>
            <div>{event.name}</div>
            <div>{event.type}</div>
            <div>{event.startDate}</div>
            <div>{event.numAttending}</div>
            <div>{event.previewImage}</div>
            <div>Group:
                <div>{event.Group.id}</div>
                <div>{event.Group.name}</div>
                <div>{event.Group.city}</div>
                <div>{event.Group.state}</div>

            </div>
            {event.Venue && (
                <div>Venue:
                <div>{event.Venue.id}</div>
                <div>{event.Venue.city}</div>
                <div>{event.Venue.state}</div>
                </div>
            )}
            
        </div>
    ))



}

export default AllEvents;
