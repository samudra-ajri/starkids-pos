import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Alert from '../layout/Alert';
import NotFound from '../layout/NotFound';
import CreateItem from '../items/CreateItem';
import Transaction from '../transactions/Transaction';
import PrivateRoute from '../routing/PrivateRoute';
import { Container } from 'semantic-ui-react';

const Routes = props => {
  return (
    <Container>
      <Alert />
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/create-item" component={CreateItem} />
        <PrivateRoute exact path="/create-transaction" component={Transaction} />
        <Route component={NotFound} />
      </Switch>
    </Container>
  );
};

export default Routes;
