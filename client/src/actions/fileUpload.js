import api from '../utils/api';
import { setAlert } from './alert';

import {
  ERROR_ITEM,
  IMAGE_ITEM
} from './types';


// Upload item image
export const addImage = (file, nameItem) => async dispatch => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('nameItem', nameItem);
    try {
        const res = await api.post('/items/upload', formData);
      
        dispatch({
            type: IMAGE_ITEM,
            payload: res.data
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
  }