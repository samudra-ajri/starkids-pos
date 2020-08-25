import api from '../utils/api';
import { setAlert } from './alert';

import {
    BASKET_TRANSACTIONS,
    GET_TRANSACTIONS,
    ERROR_TRANSACTION,
    BASKET_CLEAN,
    CLEAR_TRANSACTION
} from './types';

// Send item to basket
export const basketItems = (items) => async dispatch => {
  try {

    dispatch({
      type: BASKET_TRANSACTIONS,
      payload: items
    });

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: ERROR_TRANSACTION,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Remove item from basket
export const cleanBasket = (items, itemID) => async dispatch => {
  try {
    const newItems = items.filter(item => item._id !== itemID);

    dispatch({
      type: BASKET_CLEAN,
      payload: newItems
    });

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: ERROR_TRANSACTION,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create a transaction
export const createTransaction = (formData, history, sent=false) => async dispatch => {
  try {
    await api.post('/transactions', formData);

    dispatch({
      type: CLEAR_TRANSACTION
    });

    dispatch(setAlert('Transaksi Berhasil', 'success'));

    history.push('/')

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: ERROR_TRANSACTION,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get all transactions with complete attributes
export const getTransactions = (page) => async dispatch => {
  try {
    const res = await api.get(`/transactions?page=${page}&pagination=20`);

    dispatch({
      type: GET_TRANSACTIONS,
      payload: res.data
    });

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: ERROR_TRANSACTION,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get all transactions in date range
export const getRangeTransactions = (from, to) => async dispatch => {
  try {
    const res = await api.get(`/transactions?from=${from}&to=${to}&page=1&pagination=20`);

    dispatch({
      type: GET_TRANSACTIONS,
      payload: res.data
    });

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: ERROR_TRANSACTION,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};