import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import { Container, Icon, Card, Form, Button } from 'semantic-ui-react';

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    login(email, password);
  };

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <Fragment>
      <Container textAlign='center' style={{paddingTop: '1px', paddingBottom: '1px'}}>
        <Card centered>
          <Card.Content>
          <Icon name='user circle' size='huge' color='teal'/>
          <h1 style={{color:'teal', marginTop: '5px'}}>Sign In</h1>
            <Form onSubmit={onSubmit} id="login-form">
                <Form.Field>
                  <input
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                  />
                </Form.Field>
                <Form.Field>
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    minLength="6"
                  />
                </Form.Field>
            </Form>
            <br/>
            <small> Don't have an account? <Link to="/register">Sign Up</Link> </small>
          </Card.Content>
          <Button form="login-form" color='teal' type='submit'>Login</Button>
        </Card>
      </Container>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);
