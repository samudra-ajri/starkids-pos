import api from '../utils/api';
import { setAlert } from './alert';
import { createDSL } from './debtsubsidiaryledgers';

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
export const createTransaction = (formData, history) => async dispatch => {
  try {

    if (formData.payment_type !== 'tunai') {

      let credit = 0;
      let debit = 0;

      if (formData.payment_type === 'angsur') {
        credit = formData.total;
      } else {
        debit = formData.total;
      }

      const dslData = {
        debtor: formData.customer,
        credit, 
        debit, 
        balance: formData.balance, 
        description: formData.description
      }

      dispatch(createDSL(dslData));
    }
    
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
export const getTransactions = (from, to, page, customerID, dateSort) => async dispatch => {
  try {
    dispatch({ type: CLEAR_TRANSACTION });
    let res = {};
    if (page) {
      res = await api.get(`/transactions?customer=${customerID}&from=${from}&to=${to}&page=${page}&pagination=10&sortdate=${dateSort}`);
    } else {
      if (from || to) res = await api.get(`/transactions?from=${from}&to=${to}&sortdate=${dateSort}`);
    }

    let payload;
    if (res.data ? payload=res.data : payload=[]);

    dispatch({
      type: GET_TRANSACTIONS,
      payload: payload
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