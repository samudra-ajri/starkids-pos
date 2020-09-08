import api from '../utils/api';
import { setAlert } from './alert';

import {
  GET_ITEM,
  GET_ITEMS,
  ERROR_ITEM,
  CLEAR_ITEM,
  EDIT_ITEM
} from './types';

// Create an item
export const createItem = (formData, itemID, history) => async dispatch => {
  try {
    if (itemID !== '') {
      await api.put(`/items/${itemID}`, formData);
      dispatch(setAlert('Perubahan Data Berhasil', 'success'));
      dispatch({ type: CLEAR_ITEM });
    } else {
      await api.post('/items', formData);
      dispatch(setAlert('Produk Berhasil Ditambahkan', 'success'));
    }

    history.push('/dashboard/produk');

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

// Get item by ID
export const getItem = (itemID) => async dispatch => {
  try {
    if (itemID) {
      const res = await api.get(`/items/${itemID}`);

      dispatch({
        type: GET_ITEM,
        payload: res.data
      });
    }

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

// Get item by name
export const getItemByName = (name) => async dispatch => {
  try {
    if (name) {
      const res = await api.get(`/items?name=${name}`);

      dispatch({
        type: GET_ITEM,
        payload: res.data[0]
      });
    }

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

// Update item quantity
export const patchQuantity = (body, itemID) => async dispatch => {
  let updatedBody = body;
  updatedBody.date = Date.now();

  dispatch({ type: CLEAR_ITEM });

  try {
    const res = await api.patch(`/items/${itemID}`, updatedBody);

    dispatch({
      type: GET_ITEM,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: ERROR_ITEM,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get item editID
export const getItemEditID = (itemID) => async dispatch => {
  try {
    dispatch({ type: CLEAR_ITEM });

    dispatch({
      type: EDIT_ITEM,
      payload: itemID
    });

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