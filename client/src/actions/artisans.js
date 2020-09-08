import api from '../utils/api';
import { setAlert } from './alert';

import {
  GET_ARTISANS,
  GET_ARTISAN,
  IS_EDIT_ARTISAN,
  ERROR_ARTISAN,
  CLEAR_ARTISAN,
} from './types';

// Get all artisans
export const getArtisans = () => async dispatch => {
  try {
    const res = await api.get('/artisans');

    dispatch({
      type: GET_ARTISANS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: ERROR_ARTISAN,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create a artisan
export const createArtisan = (formData, artisanID, history) => async dispatch => {
  try {
    if (artisanID !== '') {
      await api.put(`/artisans/${artisanID}`, formData);
      dispatch(setAlert('Perubahan Data Berhasil', 'success'));
      dispatch({ type: CLEAR_ARTISAN });
    } else {
      await api.post('/artisans', formData);
      dispatch(setAlert('Pengrajin Berhasil Ditambahkan', 'success'));
    }

    history.push('/dashboard/pengrajin');

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: ERROR_ARTISAN,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get artisan by ID
export const getArtisan = (artisanID) => async dispatch => {
  try {
    if (artisanID){
      const res = await api.get(`/artisans/${artisanID}`);
      
      dispatch({
        type: GET_ARTISAN,
        payload: res.data
      });
    }

  } catch (err) {
      const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: ERROR_ARTISAN,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get artisan by name
export const getArtisanByName = (name) => async dispatch => {
  try {
    if (name){
      const res = await api.get(`/artisans?name=${name}`);
      
      dispatch({
        type: GET_ARTISAN,
        payload: res.data[0]
      });
    }

  } catch (err) {
      const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: ERROR_ARTISAN,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get artisan editID
export const getEditID = (artisanID) => async dispatch => {
  try {
    dispatch({ type: CLEAR_ARTISAN });

    dispatch({
      type: IS_EDIT_ARTISAN,
      payload: artisanID
    });

  } catch (err) {
      const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: ERROR_ARTISAN,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete a artisan
export const deleteArtisan = (artisanID) => async dispatch => {
  try {
    await api.delete(`/artisans/${artisanID}`);

    dispatch(setAlert('Data Pengrajin Dihapus'));

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: ERROR_ARTISAN,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Update artisan debt
export const patchDebt = (body, artisanID) => async dispatch => {
  dispatch({ type: CLEAR_ARTISAN });

  try {
    const res = await api.patch(`/artisans/${artisanID}`, body);

    dispatch({
      type: GET_ARTISAN,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: ERROR_ARTISAN,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};