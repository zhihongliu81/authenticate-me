import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { deleteEventThunk, eventDetailsThunk } from "../../store/events";
import { getMembersThunk } from "../../store/members";
import { getAttendeesThunk } from "../../store/attendees";
import { groupDetailsThunk } from "../../store/groups";
import {Modal} from '../../context/Modal';
import EditEvent from "../EditEvent";
import ShowAttendees from "../ShowAttendees";
import RequestAttendee from "../RequestAttendee";
import "./EventDetails.css";
import CreateNewEvent from "../CreateNewEvent";
import hostImage from '../../images/host.jpg';
import timerIcon from '../../images/timer.png';
import locationIcon from '../../images/location.png';

const EventDetails = () => {
    const {eventId} = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const event = useSelector(state => state.events[eventId]);
    const user = useSelector(state => state.session.user);
    const groups = useSelector(state => state.groups);
    const members = useSelector(state => state.members);
    const attendees = useSelector(state => state.attendees);
    // const [showForm, setShowForm] = useState(false);
    // const [showAttendees, setShowAttendees] = useState(false);
    const [eventDetailsIsLoaded, setEeventDetailsIsLoaded] = useState(false);
    const [attendeesIsLoaded, setAttendeesIsLoaded] = useState(false);
    const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);
    const [showEditEventModal, setShowEditEventModal] = useState(false);

    useEffect(() => {
        dispatch(eventDetailsThunk(eventId)).then(() => {setEeventDetailsIsLoaded(true)});
        dispatch(getAttendeesThunk(eventId)).then(() => setAttendeesIsLoaded(true));

    }, [dispatch, eventId]);

    useEffect(() => {
        if (event) {
            dispatch(getMembersThunk(event.groupId));
            dispatch(groupDetailsThunk(event.groupId));
        }
    }, [dispatch, event])


    let showEditEventButton = false;
    if (user && event && members) {
        const memberList = Object.values(members);
        const userMembership = memberList.filter(member => member.memberId ===user.id && (member.status === 'organizer' || member.status === 'co-host'));
        if (userMembership.length > 0) {
            showEditEventButton = true;
        }
    }

    const handleDelete = async (eventId) => {
        const response = await dispatch(deleteEventThunk(eventId));
        if (response) {
            history.push('/allEvents');
        }
    };

    const formattedDate = (t) => {
        const time = new Date(t);
        const DAYS = {0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday'};
        const MONTHS = {0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June', 6: 'July', 7: 'Auguest', 8: 'September', 9: 'October', 10: 'November', 11: 'December'};
        const day = time.getDay();
        const date = time.getDate();
        const month = time.getMonth();
        const year = time.getFullYear();
        let hour = time.getHours();
        const ampm = hour >=12 ? 'PM':'AM';
        hour = hour % 12;
        hour = hour ? hour : 12;
        let minute = time.getMinutes();
        minute = minute < 10 ? `0${minute}` : minute;

        return `${DAYS[day]}, ${MONTHS[month]} ${date} ${year} at ${hour}:${minute} ${ampm}`
    }


    if (!event) return null;

    const organizer = groups[event.groupId]?.Organizer;
    const attendeeList = Object.values(attendees);
    const group = groups[event.groupId];

    return (<> {eventDetailsIsLoaded && attendeesIsLoaded &&
        <div className="event-detail-main-container">
            <div className="event-detail-top-container">
                <h1 className="event-detail-name">{event.name}</h1>
                <div className="event-detail-organizer-container">
                    <img alt="host" src={hostImage} />
                    <div>
                    <p className="event-detail-organizer-header">Hosted By</p>
                    <p className="event-detail-organizer">{organizer?.firstName} {organizer?.lastName[0].toUpperCase()}.</p>
                    </div>
                </div>
            </div>
            <div className="event-detail-bottom-container">
                <div className="event-detail-bottom-left">
                    <img className="event-detail-image" alt="event-detail-image" src="https://res.cloudinary.com/zhihongliu/image/upload/v1658940428/cld-sample-2.jpg" />
                    <div>
                        <h2 className="event-detail-description-header">Details</h2>
                        <p className="event-detail-description">{event.description}</p>
                        <div>
                            <h2 className="event-detail-attendees-list-header">Attendees ({attendeeList.length})</h2>
                            <div className="event-detail-attendees-list">
                                {attendeeList.map((attendee, idx) => {
                                    return <div key={idx}>
                                        <p>{attendee.firstName} {attendee.lastName[0].toUpperCase()}.</p>
                                        <p className="event-detail-attendance">{attendee.Attendance.status}</p>
                                    </div>

                                })}
                            </div>
                        </div>
                    </div>

                </div>
                <div className="event-detail-bottom-right">
                    {group &&
                        <div className="event-detail-group-container">
                            <img alt="" src={group.previewImage} />
                            <div>
                                <p className="event-detail-group-name">{group.name}</p>
                                <p className="event-detail-group-private">{group.private ? "Private group" : "Public group"}</p>
                            </div>
                        </div>}
                    <div className="event-detail-time-address">
                        <div>
                            <img alt="" src={timerIcon} />
                            <div>
                            <p className="event-detail-start-end-date">{formattedDate(event.startDate)} to</p>
                            <p className="event-detail-start-end-date">{formattedDate(event.endDate)}</p>
                            </div>

                        </div>
                        <div>
                            <img alt="" src={locationIcon} />
                            {event.Venue && <p className="event-detail-venue-address">{event.Venue.address}.{event.Venue.city}, {event.Venue.state}</p>}
                        </div>



                    </div>
                    {showEditEventButton && (
                        <div className="event-detail-buttons">
                            <button className="event-detail-button" onClick={() => setShowEditEventModal(true)}>Edit</button>
                            <button className="event-detail-button" onClick={() => setShowDeleteEventModal(true)}>Delete</button>
                        </div>
                    )}
                </div>
                <>
                    {showDeleteEventModal &&
                        <Modal onClose={() => setShowDeleteEventModal(false)}>
                            <div className='delete-modal-container'>
                                <h2>Are you sure you would like to delete event: {event.name}?</h2>
                                <div>
                                    <button className='delete-modal-button' onClick={() => { handleDelete(eventId) }}>Delete</button>
                                    <button className='delete-modal-button' onClick={() => setShowDeleteEventModal(false)}>Cancle</button>
                                </div>
                            </div>
                        </Modal>
                    }
                </>
                <>
                {showEditEventModal &&
                <Modal onClose={() => setShowEditEventModal(false)}>
                    <CreateNewEvent action='edit' event={event} close={() => setShowEditEventModal(false)} />
                </Modal>
                }
                </>

            </div>
        </div>}
    </>

    )

}


export default EventDetails;
