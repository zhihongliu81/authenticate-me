import { csrfFetch } from "./csrf";

const LOAD_EVENTS = 'events/LOAD_EVENTS';
const GET_EVENT = 'events/GET_EVENT';
const UPDATE_EVENT = 'events/UPDATE_EVENT';


const loadEvents = (events) => {
    return {
        type: LOAD_EVENTS,
        events
    }
}

const getEvent = (event) => {
    return {
        type: GET_EVENT,
        event
    }
}

const updateEvent = (event) => {
    return {
        type: UPDATE_EVENT,
        event
    }
}

export const loadEventsThunk = () => async dispatch => {
    const response = await fetch('/api/events');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadEvents(data.Events));
        return data
    }
};

export const eventDetailsThunk = (eventId) => async dispatch => {
    const response = await fetch(`/api/events/${eventId}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getEvent(data));
        return data
    }
};

export const updateEventThunk = (eventId, updatedEvent) => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedEvent)
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(updateEvent(data))
        return data;
    }
}

const initialState = {}
const eventsReducer = (state = initialState, action) => {
    let newState
    switch (action.type) {
        case LOAD_EVENTS: {
            const events = {};
            action.events.map(event => events[event.id] = event);
            newState = { ...events }
            return newState;
        };
        case GET_EVENT: {
            newState = {...state};
            newState[action.event.id] = {...newState[action.event.id], ...action.event};
            return newState;
        };
        case UPDATE_EVENT: {
            newState = {...state};
            newState[action.event.id] = action.event;
            return newState;
        }
        default:
            return state;
    }
};

export default eventsReducer;
