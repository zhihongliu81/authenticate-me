const LOAD_EVENTS = 'events/LOAD_EVENTS';


const loadEvents = (events) => {
    return {
        type: LOAD_EVENTS,
        events
    }
}

export const loadEventsThunk = () => async dispatch => {
    const response = await fetch('/api/events');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadEvents(data.Events));
        return data
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
        }
        default:
            return state;
    }
};

export default eventsReducer;
