import {
    GET_MATERIAL,
    GET_MATERIALS,
    ERROR_MATERIAL,
    CLEAR_MATERIAL,
    EDIT_MATERIAL
  } from '../actions/types';

  const initialState = {
    material: null,
    materials: [],
    loading: true,
    editID: '',
    error: {}
  };

  export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_MATERIAL:
        return {
          ...state,
          material: payload,
          loading: false
        };
      case EDIT_MATERIAL:
        return {
          ...state,
          editID: payload,
          loading: false
        };
      case GET_MATERIALS:
        return {
          ...state,
          materials: payload,
          loading: false
        };
      case ERROR_MATERIAL:
        return {
          ...state,
          error: payload,
          loading: false,
          material: null
        };
      case CLEAR_MATERIAL:
        return {
          ...state,
          editID: '',
          material: null
        };
      default:
        return state;
    }
  }