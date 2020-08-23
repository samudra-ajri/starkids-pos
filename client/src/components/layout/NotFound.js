import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react';

const NotFound = () => {
  return (
    <Container textAlign='center'>
      <h1 className='x-large text-primary'>
        <i className='fas fa-exclamation-triangle' /> Page Not Found
      </h1>
      <p className='large'>Sorry, this page does not exist</p>
    </Container>
  );
};

export default NotFound;
