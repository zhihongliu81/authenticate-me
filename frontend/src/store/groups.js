
const LOAD_GROUPS = 'groups/LOAD_GROUPS';
const GET_GROUP = 'groups/GET_GROUP';


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
const initialState = {}
const groupsReducer = (state = initialState, action) => {
    let newState
    switch (action.type) {
        case LOAD_GROUPS: {
            const groups = {};
            action.groups.map(group => groups[group.id] = group);
            newState = { ...groups }
            return newState;
        }
        case GET_GROUP: {
            newState = {...state};
            newState[action.group.id] = action.group;
            return newState;
        }
        default:
            return state;
    }
};

export default groupsReducer;
