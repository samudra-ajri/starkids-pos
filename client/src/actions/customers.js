import api from '../utils/api';
import { setAlert } from './alert';

import {
  GET_CUSTOMERS,
  GET_CUSTOMER,
  IS_EDIT,
  ERROR_CUSTOMER,
  CLEAR_CUSTOMER,
} from './types';

// Get all customers
export const getCustomers = () => async dispatch => {
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
export const createCustomer = (formData, customerID, history) => async dispatch => {
  try {
    if (customerID !== 'false') {
      await api.put(`/customers/${customerID}`, formData);
      dispatch(setAlert('Perubahan Data Berhasil', 'success'));
      dispatch({ type: CLEAR_CUSTOMER });
    } else {
      await api.post('/customers', formData);
      dispatch(setAlert('Pelanggan Berhasil Ditambahkan', 'success'));
    }

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

// Get customer by ID
export const getCustomer = (customerID) => async dispatch => {
  try {
    const res = await api.get(`/customers/${customerID}`);

    dispatch({
      type: GET_CUSTOMER,
      payload: res.data
    });

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

// Get customer editID
export const getEditID = (customerID) => async dispatch => {
  try {
    dispatch({ type: CLEAR_CUSTOMER });

    dispatch({
      type: IS_EDIT,
      payload: customerID
    });

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

// Delete a customer
export const deleteCustomer = (customerID) => async dispatch => {
  try {
    await api.delete(`/customers/${customerID}`);

    dispatch(setAlert('Data Pelanggan Dihapus'));

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

// Update customer debt
export const patchDebt = (body, customerID) => async dispatch => {
  dispatch({ type: CLEAR_CUSTOMER });

  try {
    const res = await api.patch(`/customers/${customerID}`, body);

    dispatch({
      type: GET_CUSTOMER,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: ERROR_CUSTOMER,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};