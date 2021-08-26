import {
    GET_CUSTOMER,
    GET_CUSTOMERS,
    ERROR_CUSTOMER,
    CLEAR_CUSTOMER,
    UPDATE_CUSTOMER,
    IS_EDIT,
  } from '../actions/types';

  const initialState = {
    customer: null,
    customers: [],
    loading: true,
    editID: '',
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
        case GET_CUSTOMER:
          return {
            ...state,
            customer: payload,
            loading: false
          };
      case UPDATE_CUSTOMER:
        return {
          ...state,
          customer: payload,
          loading: false
        };
      case IS_EDIT:
        return {
          ...state,
          editID: payload,
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
          editID: '',
          customer: null
        };
      default:
        return state;
    }
  }