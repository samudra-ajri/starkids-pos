import {
    BASKET_ARTISAN_TRANSACTIONS,
    GET_ARTISAN_TRANSACTIONS,
    GET_ARTISAN_TRANSACTION,
    BASKET_ARTISAN_CLEAN,
    ERROR_ARTISAN_TRANSACTION,
    CLEAR_ARTISAN_TRANSACTION,
    ARTISAN_ID
  } from '../actions/types';

const initialState = {
    completeTransactions: [],
    transaction: null,
    transactions: [],
    loading: true,
    editID: '',
    error: {}
};

export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case BASKET_ARTISAN_TRANSACTIONS:
        return {
          ...state,
          transactions: payload,
          loading: false
        };
      case GET_ARTISAN_TRANSACTIONS:
        return {
          ...state,
          completeTransactions: payload,
          loading: false
        };
      case GET_ARTISAN_TRANSACTION:
        return {
          ...state,
          transaction: payload,
          loading: false
        };
      case ARTISAN_ID:
        return {
          ...state,
          editID: payload,
          loading: false
        };
      case BASKET_ARTISAN_CLEAN:
        return {
          ...state,
          transactions: payload,
          loading: false
        };
      case ERROR_ARTISAN_TRANSACTION:
        return {
          ...state,
          error: payload,
          loading: false,
          transaction: null,
          transactions: []
        };
      case CLEAR_ARTISAN_TRANSACTION:
        return {
          ...state,
          transaction: null,
          transactions: []
        };
      default:
        return state;
    }
  }