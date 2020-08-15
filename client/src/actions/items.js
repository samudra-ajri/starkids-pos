import api from '../utils/api';
import { setAlert } from './alert';

import {
  GET_ITEMS,
  ERROR_ITEM,
  CLEAR_ITEM
} from './types';

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