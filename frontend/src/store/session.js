import { csrfFetch } from './csrf';

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const GET_YOURGROUPS = 'session/GET_YOURGROUPS';
const DELETE_GROUP = 'session/DELETE_GROUP';
// const setUser = (user) => {
//   return {
//     type: SET_USER,
//     payload: user,
//   };
// };

const setUser = (user) => {
  return {
    type: SET_USER,
    user
  }
}

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

const getYourGroups = (groups) => {
  return {
    type: GET_YOURGROUPS,
    groups
  }
};

const deleteGroup = (groupId) => {
  return {
    type: DELETE_GROUP,
    groupId
  }
}

export const login = (user) => async (dispatch) => {
  const { email, password } = user;
  const response = await csrfFetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  dispatch(getYourGroupsThunk(data.user));
  return response;
};

export const restoreUser = () => async dispatch => {
  const response = await csrfFetch('/api/session');
  const data = await response.json();
  dispatch(setUser(data.user));
  dispatch(getYourGroupsThunk(data.user));
  return response;
};

export const signup = (user) => async (dispatch) => {
  const { email, password, firstName, lastName } = user;
  const response = await csrfFetch("/api/users/signup", {
    method: "POST",
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data));
  return response;
};

export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });
  dispatch(removeUser());
  return response;
};

export const getYourGroupsThunk = (user) => async dispatch => {
  if (!user) return null;
  // const userId = user.id;
  const res = await fetch('/api/groups/current');
  if (res.ok) {
    const resbody = await res.json();
    const groups = {};

      for (let i = 0; i < resbody.Groups.length; i++) {
        let group = resbody.Groups[i];
        // const res1 = await fetch(`/api/groups/${group.id}/members`);
        // const data1 = await res1.json();
        // const member = data1.Members.find(ele => userId === ele.id);
        // const members = {};
        // data1.Members.forEach(member => members[member.id] = member);
        // if (member) {
        //   const status = member.Membership.status;
          groups[group.id] = group;
        // }
      }
    
    dispatch(getYourGroups(groups));
  }

  return res;
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

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.user;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    case GET_YOURGROUPS: {
      newState = { ...state };
      newState.groups = action.groups ;
      return newState;
    }
    case DELETE_GROUP: {
      newState = { ...state };
      delete newState.groups[action.groupId];
      newState.groups = {...newState.groups};
      return newState;
    }
    default:
      return state;
  }
};

export default sessionReducer;
