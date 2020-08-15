import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Spinner from '../layout/Spinner';
import { getItems } from '../../actions/items'; 

import { Card, Container, Image } from 'semantic-ui-react'


const Landing = ({ isAuthenticated, getItems, item: { items, loading } }) => {
  useEffect(() => {
    getItems();
  }, [getItems]);

  return (
    <Fragment> 
      {loading ? <Spinner /> : (
      <Container fluid style={{marginTop: '1rem', paddingBottom: '1rem'}}>
        <h1>Produk</h1>
        <Card.Group itemsPerRow={8}>
          {items.map(item => (
            <Card> 
              <Image src={require(`../../img/${item.image}`)} />
              <Card.Content textAlign='center'>
                <Card.Header>{item.name}</Card.Header>
                <Card.Description>
                  Rp {item.price.retail}/pcs
                </Card.Description>
                <Card.Description>
                  Rp {item.price.wholesale}/kodi
                </Card.Description>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      </Container>
      )}
    </Fragment>
  );
};

Landing.propTypes = {
  getItems: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  item: state.item,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {getItems})(Landing);
