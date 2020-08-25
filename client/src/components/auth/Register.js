import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';
import { Container, Card, Form, Button } from 'semantic-ui-react';

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      register({ name, email, password });
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <Container textAlign='center' style={{paddingTop: '1px', paddingBottom: '1px'}}>
        <Card centered>
          <Card.Content>
            <h1 style={{color:'teal', marginTop: '5px'}}>Sign Up</h1>
            <Form onSubmit={onSubmit} id="register-form">
              <Form.Field>
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={name}
                  onChange={onChange}
                />
              </Form.Field>
              <Form.Field>
                <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={email}
                  onChange={onChange}
                />
              </Form.Field>
              <Form.Field>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={onChange}
                />
              </Form.Field>
              <Form.Field>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="password2"
                  value={password2}
                  onChange={onChange}
                />
              </Form.Field>
            </Form>
            <br/>
            <small>Already have an account? <Link to="/login">Sign In</Link></small> 
          </Card.Content>
          <Button form="register-form" color='teal' type='submit'>Register</Button>
        </Card>
      </Container>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, register })(Register);
