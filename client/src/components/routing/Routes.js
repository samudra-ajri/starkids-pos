import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from '../auth/Register';
import Login from '../auth/Login';
import NotFound from '../layout/NotFound';
import Transaction from '../transactions/Transaction';
import Artisan from '../transactions/Artisan';
import Dashboard from '../dashboard/Dashboard';
import PrivateRoute from '../routing/PrivateRoute';

const Routes = props => {
  return (
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/create-transaction" component={Transaction} />
        <PrivateRoute exact path="/artisan-transaction" component={Artisan} />
        <PrivateRoute component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
  );
};

export default Routes;
