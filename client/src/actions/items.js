import api from '../utils/api';
import { setAlert } from './alert';

import {
  GET_ITEM,
  GET_ITEMS,
  ERROR_ITEM,
  CLEAR_ITEM
} from './types';

// Create an item
export const createItem = (formData) => async dispatch => {
  try {
    const res = await api.post('/items', formData);

    dispatch({
      type: GET_ITEM,
      payload: res.data
    });

    dispatch(setAlert('Product Created', 'success'));

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: ERROR_ITEM,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get all items
export const getItems = () => async dispatch => {
  dispatch({ type: CLEAR_ITEM });

  try {
    const res = await api.get('/items');

    dispatch({
      type: GET_ITEMS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: ERROR_ITEM,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

