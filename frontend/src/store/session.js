import { csrfFetch } from './csrf';

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const GET_YOURGROUPS = 'session/GET_YOURGROUPS'
// const setUser = (user) => {
//   return {
//     type: SET_USER,
//     payload: user,
//   };
// };

const setUser = (user, groups) => {
  return {
    type: SET_USER,
    user,
    groups
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

  // Get all Groups joined or organized by the Current User
  const res = await fetch('/api/groups/current');
  const resbody = await res.json();
  const groups = {};
  if (!resbody.Groups || resbody.Groups.length === 0) return dispatch(setUser(data.user));
  resbody.Groups.forEach(async group => {

    //get member status
    const res1 = await fetch(`/api/groups/${group.id}/members`);
    const data1 = await res1.json();
    const member = data1.Members.find(ele => data.user.id === ele.id);
    if (!member) return dispatch(setUser(data.user));
    const status = member.Membership.status;
    groups[group.id] = { ...group, status };

    dispatch(setUser(data.user, groups));
  })



  // dispatch(setUser(data.user));
  return response;
};

export const restoreUser = () => async dispatch => {
  const response = await csrfFetch('/api/session');
  const data = await response.json();

  // Get all Groups joined or organized by the Current User
  if (Object.keys(data).length === 0) {
    return dispatch(setUser(data.user))
  }
  const res = await fetch('/api/groups/current');
  const resbody = await res.json();
  if (!resbody.Groups || resbody.Groups.length === 0) return dispatch(setUser(data.user));
  const groups = {};
  resbody.Groups.forEach( async group => {

    //get member status
    const res1 = await fetch(`/api/groups/${group.id}/members`);
    const data1 = await res1.json();
    const member = data1.Members.find(ele => data.user.id === ele.id);
    if (!member) return dispatch(setUser(data.user));
    const status = member.Membership.status;
    groups[group.id] = { ...group, status };
    dispatch(setUser(data.user, groups));
  })

// console.log(groups);


  // dispatch(setUser(data.user));
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
  const userId = user.id;
  const res = await fetch('/api/groups/current');
  const resbody = await res.json();
  const groups = {};
  if (resbody.Groups && resbody.Groups.length > 0) {
    // console.log(resbody.Groups);
    const addMember = () => {
      resbody.Groups.forEach(async group => {
        //get member status
        const res1 = await fetch(`/api/groups/${group.id}/members`);
        const data1 = await res1.json();
        const member = data1.Members.find(ele => userId === ele.id);
        if (member) {
          const status = member.Membership.status;
          groups[group.id] = { ...group, status };
          dispatch(getYourGroups(groups));
        }
      })
    }
    await addMember();

  }


}

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.user;
      newState.groups = action.groups;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    case GET_YOURGROUPS: {
      newState = { ...state };
      newState.groups ={...newState.groups, ...action.groups} ;
      return newState;
    }
    default:
      return state;
  }
};

export default sessionReducer;
