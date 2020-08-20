import {
    GET_ITEM,
    GET_ITEMS,
    ERROR_ITEM,
    CLEAR_ITEM,
    IMAGE_ITEM
  } from '../actions/types';

  const initialState = {
    item: null,
    items: [],
    loading: true,
    file: null,
    error: {}
  };

  export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case IMAGE_ITEM:
        return {
          ...state,
          file: payload,
          loading: false
        };
      case GET_ITEM:
        return {
          ...state,
          item: payload,
          loading: false
        };
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
          item: null
        };
      case CLEAR_ITEM:
        return {
          ...state,
          item: null
        };
      default:
        return state;
    }
  }