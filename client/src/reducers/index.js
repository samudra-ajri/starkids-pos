import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import item from './item';
import transaction from './transaction';
import customer from './customer';
import material from './material';

export default combineReducers({
  alert,
  auth,
  item,
  transaction,
  customer,
  material
});
