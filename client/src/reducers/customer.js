import {
    GET_CUSTOMERS,
    ERROR_CUSTOMER,
    CLEAR_CUSTOMER
  } from '../actions/types';

  const initialState = {
    customer: null,
    customers: [],
    loading: true,
    error: {}
  };

  export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_CUSTOMERS:
        return {
          ...state,
          customers: payload,
          loading: false
        };
      case ERROR_CUSTOMER:
        return {
          ...state,
          error: payload,
          loading: false,
          customer: null
        };
      case CLEAR_CUSTOMER:
        return {
          ...state,
          customer: null
        };
      default:
        return state;
    }
  }