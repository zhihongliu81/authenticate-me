import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAttendeesThunk } from "../../store/attendees";

const ShowAttendees = ({eventId}) => {
    const dispatch = useDispatch();
    const attendees = useSelector(state => state.attendees[eventId]);

    useEffect(() => {
        dispatch(getAttendeesThunk(eventId));
    }, [dispatch])

    if (!attendees) return null;

    const attendeesArr = Object.values(attendees);

    return (
        <div>Attendees: 
            {attendeesArr.length > 0 && (
                attendeesArr.map(attendee => {
                    return (
                        <div key={attendee.id}>
                            <div>{attendee.id}</div>
                            <div>{attendee.firstName}</div>
                            <div>{attendee.lastName}</div>
                            <div>{attendee.Attendance.status}</div>
                        </div>
                    )
                })
            )}
        </div>
    )
}


export default ShowAttendees;
