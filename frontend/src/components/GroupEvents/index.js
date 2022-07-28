import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { groupEventsThunk } from "../../store/groups";
import EventCard from "../AllEventsList/EventCard";

const GroupEvents = () => {

    const {groupId} = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups[groupId]);
    let events
    if (group) {
        events = group.events;
    }

    useEffect(() => {
        dispatch(groupEventsThunk(groupId));

    }, [dispatch, groupId]);

    if (!events) return null;

    return events.map(event => {
            return (
                <div key={event.id}>
                    <EventCard event={event}/>
                </div>
            )
        })

}


export default GroupEvents;
