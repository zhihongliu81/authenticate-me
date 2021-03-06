import { csrfFetch } from './csrf';

const LOAD_GROUPS = 'groups/LOAD_GROUPS';
const GET_GROUP = 'groups/GET_GROUP';
const GROUP_EVENTS = 'groups/GROUP_EVENTS';
const GROUP_NEWEVENT = 'groups/GROUP_NEWEVENT';
const GET_MEMBERS = 'groups/GET_MEMBERS';


const loadGroups = (groups) => {
    return {
        type: LOAD_GROUPS,
        groups
    }
}

const getGroup = (group) => {
    return {
        type: GET_GROUP,
        group
    }
}

const groupEvents = (events, groupId) => {
    return {
        type: GROUP_EVENTS,
        events,
        groupId
    }
}

const newEvent = (newEvent) => {
    return {
        type: GROUP_NEWEVENT,
        newEvent
    }
}

const getMembers = (members, groupId) => {
    return {
        type: GET_MEMBERS,
        members,
        groupId
    }
}

export const loadGroupsThunk = () => async dispatch => {
    const response = await fetch('/api/groups');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadGroups(data.Groups));
        return data
    }
}

export const groupDetailsThunk = (groupId) => async dispatch => {
    const response = await fetch(`/api/groups/${groupId}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getGroup(data));
        return data
    }
}

export const getMembersThunk = (groupId) => async dispatch => {
    const response = await fetch(`/api/groups/${groupId}/members`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getMembers(data.Members, groupId));
        return data;
    }
}

export const groupEventsThunk = (groupId) => async dispatch => {
    const response = await fetch(`/api/groups/${groupId}/events`);


    if (response.ok) {
        const data = await response.json();
        dispatch(groupEvents(data.Events, groupId));
        return data;
    }
}

export const newEventThunk = (groupId, event) => async dispatch => {

    const response = await csrfFetch (`/api/groups/${groupId}/events/new`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(newEvent(data));
        return data;
    }

}

const initialState = {};
const groupsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_GROUPS: {
            const groups = {};
            action.groups.map(group => groups[group.id] = group);
            newState = { ...groups }
            return newState;
        }
        case GET_GROUP: {
            newState = {...state};
            newState[action.group.id] = {...newState[action.group.id], ...action.group};
            return newState;
        }
        case GROUP_EVENTS: {
            newState = {...state};
            newState[action.groupId] = {...newState[action.groupId], events:action.events};
            return newState
        }
        case GROUP_NEWEVENT: {
            newState = {...state};
            newState[action.newEvent.groupId] = {...newState[action.newEvent.groupId],
                                                 events: newState[action.newEvent.groupId].events ? [...newState[action.newEvent.groupId].events, action.newEvent ] : [ action.newEvent ]
                                                }
            return newState;
        }
        case GET_MEMBERS: {
            newState = {...state};
            const members = {};
            action.members.forEach(member => members[member.id] = member);
            newState[action.groupId] = {...newState[action.groupId], members}
            return newState;
        }
        default:
            return state;
    }
};

export default groupsReducer;
