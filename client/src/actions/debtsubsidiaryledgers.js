import api from '../utils/api';

import {
    GET_DSLS,
    ERROR_DSL,
    CLEAR_DSL
} from './types';

// Create a debt subsidiary ledger (DSL)
export const createDSL = (formData) => async dispatch => {
  try {
    await api.post('/debtsubsidiaryledgers', formData);

    dispatch({
      type: CLEAR_DSL
    });

  } catch (err) {

    dispatch({
      type: ERROR_DSL,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get all debt subsidiary ledgers with complete attributes
export const getDSLs = (from, to, debtorID) => async dispatch => {
  try {
    dispatch({ type: CLEAR_DSL });

    if (from && to) {
        const res = await api.get(`/debtsubsidiaryledgers?from=${from}&to=${to}&debtor=${debtorID}`);
        
        dispatch({
            type: GET_DSLS,
            payload: res.data
        });
    }

  } catch (err) {

    dispatch({
      type: ERROR_DSL,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};