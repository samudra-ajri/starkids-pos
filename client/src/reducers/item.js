import {
    GET_ITEMS,
    ERROR_ITEM,
    CLEAR_ITEM,
  } from '../actions/types';

  const initialState = {
    item: null,
    items: [],
    loading: true,
    error: {}
  };

  export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_ITEMS:
        return {
          ...state,
          items: payload,
          loading: false
        };
      case ERROR_ITEM:
        return {
          ...state,
          error: payload,
          loading: false,
          profile: null
        };
      case CLEAR_ITEM:
        return {
          ...state,
          profile: null,
        };
      default:
        return state;
    }
  }