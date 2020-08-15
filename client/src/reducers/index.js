import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import item from './item';

export default combineReducers({
  alert,
  auth,
  item
});
