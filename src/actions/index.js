import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  AUTH_ERROR,
  UNAUTH_USER,
  FETCH_MESSAGE
} from '../actions/types';

const ROOT_URL = 'http://localhost:3090';

export function signinUser({ email, password }) {
  return (dispatch) => {
    // submit to server
    axios.post(`${ROOT_URL}/signin`, { email, password })
      .then(response => {
        // If req is good
        // - update state to indicate user is authenticated
        dispatch({ type: AUTH_USER });
        // - save JWT token
        localStorage.setItem('token', response.data.token)
        // - redirect to route '/feature'
        browserHistory.push('/feature');
      })
      .catch(() => {
        // If req is bad
        // -show an error to user
        dispatch(authError('Bad Login info'));
      });
  }
}

export function signUpUser({ email, password }) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/signup`, { email, password })
      .then(response => {
        dispatch({ type: AUTH_USER });
        localStorage.setItem('token', response.data.token);
        browserHistory.push('/feature');
      })
      .catch(response => {
        dispatch(authError(response.response.data.error));
      });
  }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  }
}

export function signoutUser() {
  localStorage.removeItem('token');
  return {
    type: UNAUTH_USER
  };
}

export function fetchMessage() {
  return (dispatch) => {
    axios.get(ROOT_URL, {
      headers: {
        authorization: localStorage.getItem('token')
      }
    }).then(response => {
      dispatch({
        type: FETCH_MESSAGE,
        payload: response.data.message
      });
    });
  }
}
