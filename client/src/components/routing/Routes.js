import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from '../auth/Register';
import Login from '../auth/Login';
import NotFound from '../layout/NotFound';
import CreateItem from '../items/CreateItem';
import CreateCustomer from '../customers/CreateCustomer';
import Transaction from '../transactions/Transaction';
import Dashboard from '../dashboard/Dashboard';
import PrivateRoute from '../routing/PrivateRoute';

const Routes = props => {
  return (
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/create-item" component={CreateItem} />
        <PrivateRoute exact path="/create-customer" component={CreateCustomer} />
        <PrivateRoute exact path="/create-transaction" component={Transaction} />
        <PrivateRoute component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
  );
};

export default Routes;
