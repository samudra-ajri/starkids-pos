import {
    GET_ARTISAN,
    GET_ARTISANS,
    ERROR_ARTISAN,
    CLEAR_ARTISAN,
    UPDATE_ARTISAN,
    IS_EDIT_ARTISAN,
  } from '../actions/types';

  const initialState = {
    artisan: null,
    artisans: [],
    loading: true,
    editID: '',
    error: {}
  };

  export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
        case GET_ARTISANS:
            return {
            ...state,
            artisans: payload,
            loading: false
            };
            case GET_ARTISAN:
            return {
                ...state,
                artisan: payload,
                loading: false
            };
        case UPDATE_ARTISAN:
            return {
            ...state,
            artisan: payload,
            loading: false
            };
        case IS_EDIT_ARTISAN:
            return {
                ...state,
                editID: payload,
                loading: false
            };
        case ERROR_ARTISAN:
            return {
            ...state,
            error: payload,
            loading: false,
            artisan: null
            };
        case CLEAR_ARTISAN:
            return {
            ...state,
            editID: '',
            artisan: null
            };
        default:
            return state;
    }
  }