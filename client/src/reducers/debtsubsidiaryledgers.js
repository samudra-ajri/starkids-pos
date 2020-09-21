import {
    GET_DSLS,
    ERROR_DSL,
    CLEAR_DSL
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
      case GET_DSLS:
        return {
          ...state,
          transactions: payload,
          loading: false
        };
      case ERROR_DSL:
        return {
          ...state,
          error: payload,
          loading: false,
          transaction: null,
          transactions: []
        };
      case CLEAR_DSL:
        return {
          ...state,
          transaction: null,
          transactions: []
        };
      default:
        return state;
    }
  }