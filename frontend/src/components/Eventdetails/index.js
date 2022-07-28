import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { deleteEventThunk, eventDetailsThunk } from "../../store/events";
import EditEvent from "../EditEvent";
import ShowAttendees from "../ShowAttendees";
import RequestAttendee from "../RequestAttendee";
import "./EventDetails.css"

const EventDetails = () => {
    const {eventId} = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const event = useSelector(state => state.events[eventId]);
    const user = useSelector(state => state.session.user);
    const groups = useSelector(state => state.session.groups);
    const [showForm, setShowForm] = useState(false);
    const [showAttendees, setShowAttendees] = useState(false);
    const [eventDetailsIsLoaded, setEeventDetailsIsLoaded] = useState(false);


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
        dispatch(eventDetailsThunk(eventId)).then(() => {setEeventDetailsIsLoaded(true)});

    }, [dispatch, eventId]);


    if (!event) return null;
    return (<> {eventDetailsIsLoaded && <div className="event-detail-main-container">
    <div className="event-detail-top-container">
        <h2 className="event-detail-start-date">{event.startDate}</h2>
        <h1 className="event-detail-name">{event.name}</h1>
        <div>
            <p className="event-detail-organizer-header">Hosted By</p>
            <p className="event-detail-organizer"></p>
        </div>

    </div>
    <div className="event-detail-bottom-container">
        <div className="event-detail-bottom-left">
            <img className="event-detail-image" alt="event-detail-image" src="https://res.cloudinary.com/zhihongliu/image/upload/v1658940428/cld-sample-2.jpg" />
            <div>
                <h2 className="event-detail-description-header">Details</h2>
                <p className="event-detail-description">{event.description}</p>
                <div>
                    <h2 className="event-detail-attendees-list-header">Attendees</h2>
                    <div className="event-detail-attendees-list"></div>
                </div>
            </div>

        </div>
        <div className="event-detail-bottom-right">
            <div>
                <p className="event-detail-group-name">{event.Group.name}</p>
                <p className="event-detail-group-private">{event.Group.private? "private" : "public"}</p>
            </div>
            <div>
                <p className="event-detail-start-end-date">{event.startDate} to {event.endDate}</p>
                <p className="event-detail-venue-address">{event.Venue.address}.{event.Venue.city}, {event.Venue.state}</p>
            </div>
            {showEditEventButton && (
                <div>
                    <button className="event-detail-delete-button" onClick={() => handleDelete(event.id)}>Delete</button>
                </div>

            )}


        </div>

    </div>
</div>}
    </>

    )
            // {/* <div>
            //     {`Event ${event.id}: `}

            //     {showEditEventButton && (
            //         <div>
            //             <button onClick={() => setShowForm(true)}>Edit Event</button>
            //             <button onClick={() => handleDelete(event.id)}>Delete</button>
            //         </div>

            //     )}
            //     <div>

            //         <button onClick={() => RequestAttendee(event, user)}>Request to Attend</button>

            //     </div>
            //     <div>
            //         {showForm && (
            //             <EditEvent hiddenForm={() => setShowForm(false)} eventId={eventId} />
            //         )}
            //     </div>

            // </div>
            // <div>{event.id}</div>
            // <div>{event.description}</div>
            // <div>
            //     <ShowAttendees eventId={eventId}/>
            // </div> */}



}


export default EventDetails;
