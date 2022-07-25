import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { deleteEventThunk, eventDetailsThunk } from "../../store/events";
import EditEvent from "../EditEvent";
import ShowAttendees from "../ShowAttendees";
import RequestAttendee from "../RequestAttendee";

const EventDetails = () => {
    const {eventId} = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const event = useSelector(state => state.events[eventId]);
    const user = useSelector(state => state.session.user);
    const groups = useSelector(state => state.session.groups);
    const [showForm, setShowForm] = useState(false);
    const [showAttendees, setShowAttendees] = useState(false);


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

    const handleDelete = async (eventId) => {
        const response = await dispatch(deleteEventThunk(eventId));
        if (response) {
            history.push('/allEvents');
        }
    };


    useEffect(() => {
        dispatch(eventDetailsThunk(eventId));

    }, [dispatch, eventId]);


    if (!event) return null;
    return (
        <>
            <div>
                {`Event ${event.id}: `}

                {showEditEventButton && (
                    <div>
                        <button onClick={() => setShowForm(true)}>Edit Event</button>
                        <button onClick={() => handleDelete(event.id)}>Delete</button>
                    </div>

                )}
                <div>

                    <button onClick={() => RequestAttendee(event, user)}>Request to Attend</button>

                </div>
                <div>
                    {showForm && (
                        <EditEvent hiddenForm={() => setShowForm(false)} eventId={eventId} />
                    )}
                </div>

            </div>
            <div>{event.id}</div>
            <div>{event.description}</div>
            <div>
                <ShowAttendees eventId={eventId}/>
            </div>
        </>

    );
}


export default EventDetails;
