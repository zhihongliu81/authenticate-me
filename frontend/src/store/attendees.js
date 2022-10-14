import { csrfFetch } from './csrf';

const GET_ATTENDEES = 'attendees/GET_ATTENDEES';


const getAttendees = (attendees) => {
    return {
        type: GET_ATTENDEES,

        attendees
    }
}


export const getAttendeesThunk = (eventId) => async dispatch => {
    const response = await fetch(`/api/events/${eventId}/attendees`);
    if (response.ok) {
        const data = await response.json();
        const attendees = {};
        data.Attendees.forEach(attendee => attendees[attendee.id] = attendee);
        dispatch(getAttendees(attendees))
    }
    return response;
}

const initialState = {};
const attendeesReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case GET_ATTENDEES: {
            newState= action.attendees;
            return newState;
        }
        default:
            return state;
    }
}


export default attendeesReducer;
