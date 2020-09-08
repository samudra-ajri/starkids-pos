import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import item from './item';
import transaction from './transaction';
import customer from './customer';
import material from './material';
import artisan from './artisan';
import artisantransaction from './artisantransaction';

export default combineReducers({
  alert,
  auth,
  item,
  transaction,
  customer,
  material,
  artisan,
  artisantransaction
});
