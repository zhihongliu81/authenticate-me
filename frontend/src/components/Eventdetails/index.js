import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { eventDetailsThunk } from "../../store/events";
import EditEvent from "../EditEvent";

const EventDetails = () => {
    const {eventId} = useParams();
    const dispatch = useDispatch();
    const event = useSelector(state => state.events[eventId]);
    const user = useSelector(state => state.session.user);
    const groups = useSelector(state => state.session.groups);
    const [showForm, setShowForm] = useState(false);


    let showEditEventButton = false;
    if (user && event && groups) {
        const groupId = event.groupId;
        if(groups[groupId] && Object.keys(groups[groupId]).length > 0){
            if (groups[groupId].status === 'organizer'
            || groups[groupId].status === 'co-host') {
             showEditEventButton = true;
         }
        }
    }


    useEffect(() => {
        dispatch(eventDetailsThunk(eventId));

    }, [dispatch, eventId]);


    if (!event) return null;
    return (
        <>
            <div>
                {`Event ${event.id}: `}

                 {showEditEventButton && <button onClick={() => setShowForm(true)}>Edit Event</button>}
                 <div>
                {showForm && (
                    <EditEvent hiddenForm = {() => setShowForm(false)} eventId = {eventId}/>
                )}
            </div>

            </div>
            <div>{ event.id }</div>
            <div>{ event.description }</div>
        </>

    );
}


export default EventDetails;
