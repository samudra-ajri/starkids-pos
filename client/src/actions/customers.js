import api from '../utils/api';
import { setAlert } from './alert';

import {
  GET_CUSTOMERS,
  ERROR_CUSTOMER,
  CLEAR_CUSTOMER
} from './types';

// Get all customers
export const getCustomers = () => async dispatch => {
  dispatch({ type: CLEAR_CUSTOMER });

  try {
    const res = await api.get('/customers');

    dispatch({
      type: GET_CUSTOMERS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: ERROR_CUSTOMER,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create a customer
export const createCustomer = (formData, history) => async dispatch => {
  try {
    await api.post('/customers', formData);

    dispatch(setAlert('Pelanggan Berhasil Ditambahkan', 'success'));

    history.push('/dashboard/pelanggan');

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: ERROR_CUSTOMER,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};