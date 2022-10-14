import { csrfFetch } from './csrf';

const LOAD_GROUPS = 'groups/LOAD_GROUPS';
const GET_GROUP = 'groups/GET_GROUP';
const CREATE_GROUP = 'groups/CREATE_GROUP';
const UPDATE_GROUP = 'groups/UPDATE_GROUP';
const DELETE_GROUP = 'groups/DELETE_GROUP';
const GROUP_EVENTS = 'groups/GROUP_EVENTS';
const GROUP_NEWEVENT = 'groups/GROUP_NEWEVENT';
const GET_MEMBERS = 'groups/GET_MEMBERS';


export const loadGroups = (groups) => {
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

const createGroup = (group) => {
    return {
        type: CREATE_GROUP,
        group
    }
}

const updateGroup = (group) => {
    return {
        type: UPDATE_GROUP,
        group
    }
}

const deleteGroup = (groupId) => {
    return {
      type: DELETE_GROUP,
      groupId
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

// const getMembers = (members, groupId) => {
//     return {
//         type: GET_MEMBERS,
//         members,
//         groupId
//     }
// }

export const loadGroupsThunk = () => async dispatch => {
    const response = await fetch('/api/groups');
    if (response.ok) {

        const resbody = await response.json();
        const groups = {};
        if (resbody.Groups && resbody.Groups.length > 0) {
            for (let i = 0; i < resbody.Groups.length; i++) {
                let group = resbody.Groups[i];
                // const res1 = await fetch(`/api/groups/${group.id}/members`);
                // const data1 = await res1.json();
                const members = {};
                // data1.Members.forEach(member => members[member.id] = member);
                group.members = members;
                groups[group.id] = group;
            }
        }
        dispatch(loadGroups(groups));
    }
    return response;
}

export const groupDetailsThunk = (groupId) => async dispatch => {
    const response = await fetch(`/api/groups/${groupId}`);
    if (response.ok) {
        const data = await response.json();
        // const res1 = await fetch(`/api/groups/${groupId}/members`);
        // const data1 = await res1.json();
        // const members = {};
        // data1.Members.forEach(member => members[member.id] = member);
        dispatch(getGroup(data));
        return data
    }
}

export const newGroupThunk = (newGroup) => async dispatch => {

    const response = await csrfFetch(`/api/groups`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newGroup)
    });
    if (response.ok) {

        const data = await response.json();
        dispatch(createGroup(data));
        return data;
    }
    return response;
}

export const updateGroupThunk = (newGroup, groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newGroup)
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(updateGroup(data));
        return data;
    }
}

export const deleteGroupThunk = (groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      dispatch(deleteGroup(groupId));
    }
    return response;

  }

// export const getMembersThunk = (groupId) => async dispatch => {
//     const response = await fetch(`/api/groups/${groupId}/members`);
//     if (response.ok) {
//         const data = await response.json();
//         dispatch(getMembers(data.Members, groupId));
//         return data;
//     }
// }

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
    return response;

}

const initialState = {};
const groupsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_GROUPS: {
            newState = action.groups
            return newState;
        }
        case GET_GROUP: {
            newState = {...state};
            newState[action.group.id] = action.group;
            return newState;
        }
        case CREATE_GROUP: {
            newState = {...state};
            newState[action.group.id] = action.group;
            return newState;
        }
        case UPDATE_GROUP: {
            newState = {...state};
            newState[action.group.id] = {...newState[action.group.id], ...action.group };
            return newState;
        }
        case DELETE_GROUP: {
            newState = { ...state };
            delete newState[action.groupId];
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
