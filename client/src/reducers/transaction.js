import {
    BASKET_TRANSACTIONS,
    ERROR_TRANSACTION,
    CLEAR_TRANSACTION
} from '../actions/types';

const initialState = {
    transaction: null,
    transactions: [],
    loading: true,
    error: {}
};

export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case BASKET_TRANSACTIONS:
        return {
          ...state,
          transactions: payload,
          loading: false
        };
      case ERROR_TRANSACTION:
        return {
          ...state,
          error: payload,
          loading: false,
          transaction: null,
          transactions: []
        };
      case CLEAR_TRANSACTION:
        return {
          ...state,
          transaction: null,
          transactions: []
        };
      default:
        return state;
    }
  }