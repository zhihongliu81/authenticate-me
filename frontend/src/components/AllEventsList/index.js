import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { loadEventsThunk } from '../../store/events';
import EventCard from './EventCard';
import EventsGroupsBar from '../EventsGroupsBar/EventsGroupsBar';
import './index.css'

const AllEvents = () => {
    const events = useSelector(state => Object.values(state.events));
    const [allEventsIsLoaded, setAllEventsIsLoaded] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadEventsThunk()).then(() => setAllEventsIsLoaded(true));
    }, [dispatch]);

    if (events.length === 0) {
        return null
    }

    return <>


        {allEventsIsLoaded && (<>
        <div><EventsGroupsBar /></div>
        <div className='all-events-list-container'>{ events.map(event => (
            <div key={event.id}>
                <EventCard event={event} />
            </div>
        ))}
        </div>
        </>)

       }
    </>
}

export default AllEvents;
