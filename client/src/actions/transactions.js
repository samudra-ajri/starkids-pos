import { setAlert } from './alert';

import {
    BASKET_TRANSACTIONS,
    ERROR_TRANSACTION,
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