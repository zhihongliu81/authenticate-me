import { csrfFetch } from './csrf';

const GET_MEMBERS = 'members/GET_MEMBERS';
const REQUEST_MEMBER = 'members/REQUEST_MEMBER';
const DELETE_MEMBER = 'members/DELETE_MEMBER';
const UPDATE_MEMBER = 'members/UPDATE_MEMBER';

const getMembers = (members) => {
    return {
        type: GET_MEMBERS,
        members
    }
}

const requestMember = (member) => {
    return {
        type: REQUEST_MEMBER,
        member
    }
}

const deleteMember = (membershipId) => {
    return {
        type: DELETE_MEMBER,
        membershipId
    }
}

const updateMember = (member) => {
    return {
        type: UPDATE_MEMBER,
        member
    }
}

export const getMembersThunk = (groupId) => async dispatch => {
    const response = await fetch(`/api/groups/${groupId}/members`);
    const data = await response.json();
    if (response.ok) {
        const members = {}
        data.Members.forEach(member => {
            members[member.id] = member
        })
        dispatch(getMembers(members));
    }
    return data;
}

export const requestMemberThunk = (groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    if (response.ok) {
        dispatch(requestMember(data))
    }

    return data
}

export const deleteMemberThunk = (groupId, memberId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/membership/membershipId`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({memberId})
    })
    const data = await response.json();
    if (response.ok) {
        dispatch(deleteMember(data.membershipId))
    }

    return data;
}

export const updateMemberThunk = (groupId, member, status) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/membership`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({member, status})
    })
    const data = await response.json();
    if (response.ok) {
        dispatch(updateMember(data))
    }

    return data;
}





const initialState = {};
const membersReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case GET_MEMBERS: {
            newState = action.members
            return newState
        }
        case REQUEST_MEMBER: {
            newState = {...state};
            newState[action.member.id] = action.member;
            return newState
        }
        case UPDATE_MEMBER: {
            newState = {...state};
            newState[action.member.id] = action.member;
            return newState
        }
        case DELETE_MEMBER: {
                newState = {...state};
                delete newState[action.membershipId];
                return newState
        }

        default:
            return state;
    }
}


export default membersReducer;
