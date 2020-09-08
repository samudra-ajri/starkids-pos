import api from '../utils/api';
import { setAlert } from './alert';

import {
  GET_MATERIAL,
  GET_MATERIALS,
  ERROR_MATERIAL,
  CLEAR_MATERIAL,
  EDIT_MATERIAL
} from './types';

// Create a material
export const createMaterial = (formData, materialID, history) => async dispatch => {
  try {
    if (materialID !== '') {
      await api.put(`/materials/${materialID}`, formData);
      dispatch(setAlert('Perubahan Data Berhasil', 'success'));
      dispatch({ type: CLEAR_MATERIAL });
    } else {
      await api.post('/materials', formData);
      dispatch(setAlert('Bahan Baku Berhasil Ditambahkan', 'success'));
    }

    history.push('/dashboard/bahan');

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: ERROR_MATERIAL,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get material by ID
export const getMaterial = (materialID) => async dispatch => {
  try {
    if (materialID) {
      const res = await api.get(`/materials/${materialID}`);
      
      dispatch({
        type: GET_MATERIAL,
        payload: res.data
      });
    }

  } catch (err) {
      const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: ERROR_MATERIAL,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get all materials
export const getMaterials = () => async dispatch => {
  dispatch({ type: CLEAR_MATERIAL });

  try {
    const res = await api.get('/materials');

    dispatch({
      type: GET_MATERIALS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: ERROR_MATERIAL,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Update material quantity
export const patchQuantity = (body, materialID) => async dispatch => {
  let updatedBody = body;

  dispatch({ type: CLEAR_MATERIAL });

  try {
    const res = await api.patch(`/materials/${materialID}`, updatedBody);

    dispatch({
      type: GET_MATERIAL,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: ERROR_MATERIAL,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get material editID
export const getMaterialEditID = (materialID) => async dispatch => {
  try {
    dispatch({ type: CLEAR_MATERIAL });

    dispatch({
      type: EDIT_MATERIAL,
      payload: materialID
    });

  } catch (err) {
      const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: ERROR_MATERIAL,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};