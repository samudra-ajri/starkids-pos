import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import item from './item';
import transaction from './transaction';

export default combineReducers({
  alert,
  auth,
  item,
  transaction
});
