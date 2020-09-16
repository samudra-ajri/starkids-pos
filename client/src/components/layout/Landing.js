import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

import Spinner from '../layout/Spinner';
import { getItems } from '../../actions/items';
import { basketItems, cleanBasket } from '../../actions/transactions';

import { Card, Container, Image, Search, Button } from 'semantic-ui-react';


const Landing = ({ isAuthenticated, getItems, basketItems, cleanBasket, item: { items, loading }, basket }) => {
  const [select, setSelect] = useState(basket);
  const [selectID, setSelectID] = useState(basket.map(item => item._id));
  const [search, setSearch] = useState('');
 
  useEffect(() => {
    getItems();
    basketItems(select);
  }, [getItems, select]);

  const onSearchChange = e => {
    setSearch(e.target.value)
  }

  const onClick = (e, {detailitem}) => {
    if (isAuthenticated) {
      if (!selectID.includes(detailitem._id) && detailitem.quantity !== 0) {
        setSelectID([detailitem._id,...selectID]);
        setSelect([detailitem,...select]);
      } else {
        setSelectID(selectID.filter(item => item !== detailitem._id));
        setSelect(select.filter(item => item._id !== detailitem._id));
      }
    } 
  }

  const onClickBasket = (e, {id} )=> {
    cleanBasket(basket, id);
    setSelect(select.filter(item => item._id !== id));
    setSelectID(selectID.filter(item => item !== id));

  }

  const renderBasket = item => {
    return <Button key={item._id} id={item._id} size='mini' color='orange' content={item.name} icon='x' labelPosition='right' onClick={onClickBasket}/>
  }

  const renderItem = item => {
    if ( search !== "" && item.name.toLowerCase().indexOf( search.toLowerCase() ) === -1 ){
      return null;
    }

    return (
      <Card key={item.name} detailitem={item} onClick={onClick}> 
        <Image src={require(`../../img/${item.image}`)} />
        <Card.Content textAlign='center' style={selectID.includes(item._id) ? { backgroundColor: '#B7FFC9' } : {}}>
          <Card.Header>{item.name}</Card.Header>
            <Card.Description>
              <NumberFormat value={item.price.retail} displayType={'text'} thousandSeparator={true} prefix={'Rp '}/>/pcs
            </Card.Description>
            <Card.Description>
              <NumberFormat value={item.price.wholesale} displayType={'text'} thousandSeparator={true} prefix={'Rp '}/>/kodi
            </Card.Description>
            <Card.Description>
              <small>stok: {item.quantity}</small>
            </Card.Description>
        </Card.Content>
      </Card>
    )
  }

  return (
    <Fragment>
      <Container textAlign='center' style={{marginTop: '0rem'}}>
        <h1>Produk</h1>
        <Search input={{ fluid: true }} onSearchChange={onSearchChange} />
      </Container>

      {basket.length !== 0 &&
      <Container fluid style={{marginTop: '0rem', paddingTop: '0rem', paddingBottom: '0rem'}}>
          {basket.map(basket => (renderBasket(basket)))}
      </Container>
      }

      {loading ? <Spinner /> : (
      <Container fluid style={{marginTop: '0rem', paddingTop: '1rem', paddingBottom: '1rem'}}>
        <Card.Group itemsPerRow={8}>
          {items.map(item => (renderItem(item)))}
        </Card.Group>
      </Container>
      )}
    </Fragment>
  );
};

Landing.propTypes = {
  getItems: PropTypes.func.isRequired,
  basketItems: PropTypes.func.isRequired,
  cleanBasket: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool,
  basket: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  item: state.item,
  isAuthenticated: state.auth.isAuthenticated,
  basket: state.transaction.transactions
});

export default connect(mapStateToProps, { getItems, basketItems, cleanBasket })(Landing);
