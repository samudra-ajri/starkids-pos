import api from '../utils/api';
import { setAlert } from './alert';

import {
    BASKET_ARTISAN_TRANSACTIONS,
    GET_ARTISAN_TRANSACTIONS,
    GET_ARTISAN_TRANSACTION,
    ERROR_ARTISAN_TRANSACTION,
    BASKET_ARTISAN_CLEAN,
    CLEAR_ARTISAN_TRANSACTION,
    ARTISAN_ID
} from './types';

// Send material to basket
export const basketMaterials = (materials) => async dispatch => {
  try {

    dispatch({
      type: BASKET_ARTISAN_TRANSACTIONS,
      payload: materials
    });

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: ERROR_ARTISAN_TRANSACTION,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Remove material from basket
export const cleanBasket = (materials, materialID) => async dispatch => {
  try {
    const newMaterial = materials.filter(material => material._id !== materialID);

    dispatch({
      type: BASKET_ARTISAN_CLEAN,
      payload: newMaterial
    });

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: ERROR_ARTISAN_TRANSACTION,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create a artisan transaction
export const createArtisanTransaction = (formData, history, artisanTransactionID) => async dispatch => {
  try {
    let back = ''
    if (artisanTransactionID !== '') {
      await api.put(`/artisantransactions/${artisanTransactionID}`, formData);
      dispatch(setAlert('Update Progres Produk Berhasil', 'success'));
      back = '/dashboard/progres';
    } else {
      await api.post('/artisantransactions', formData);
      dispatch(setAlert('Penambahan Transaksi Pengrajin Berhasil', 'success'));
      back = '/materials';
    }

    dispatch({
      type: CLEAR_ARTISAN_TRANSACTION
    });

    history.push(back)

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: ERROR_ARTISAN_TRANSACTION,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get artisan transaction by ID
export const getArtisanTransaction = (artisanTransactionID) => async dispatch => {
  try {
    if (artisanTransactionID) {
      const res = await api.get(`/artisantransactions/${artisanTransactionID}`);
      
      dispatch({
        type: GET_ARTISAN_TRANSACTION,
        payload: res.data
      });
    }

  } catch (err) {
      const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: ERROR_ARTISAN_TRANSACTION,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get all artisan transactions with complete attributes
export const getArtisanTransactions = (from, to, page, artisanName) => async dispatch => {
  try {
    dispatch({ type: CLEAR_ARTISAN_TRANSACTION });
    
    let pagination = 50;
    if (artisanName) pagination = 10;
    const res = await api.get(`/artisantransactions?artisan=${artisanName}&from=${from}&to=${to}&page=${page}&pagination=${pagination}`);

    dispatch({
      type: GET_ARTISAN_TRANSACTIONS,
      payload: res.data
    });

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: ERROR_ARTISAN_TRANSACTION,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get artisan transaction ID
export const getArtisanTransactionID = (artisanTransactionID) => async dispatch => {
  try {
    dispatch({ type: CLEAR_ARTISAN_TRANSACTION });

    dispatch({
      type: ARTISAN_ID,
      payload: artisanTransactionID
    });

  } catch (err) {
      const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: ERROR_ARTISAN_TRANSACTION,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};