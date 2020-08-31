import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Spinner from '../layout/Spinner';
import { getItems } from '../../actions/items';
import { basketItems } from '../../actions/transactions';

import { Card, Container, Image, Search } from 'semantic-ui-react';


const Landing = ({ isAuthenticated, getItems, basketItems, item: { items, loading }, basket }) => {
  const [select, setSelect] = useState(basket);
  const [selectID, setSelectID] = useState(basket.map(item => item._id));
  const [search, setSearch] = useState('');
 
  useEffect(() => {
    getItems();
  }, [getItems]);

  // items.sort(function(a, b){
  //   var x = a.name.toLowerCase();
  //   var y = b.name.toLowerCase();
  //   if (x < y) {return -1;}
  //   if (x > y) {return 1;}
  //   return 0;
  // });

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
  
  basketItems(select);

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
              Rp {item.price.retail}/pcs
            </Card.Description>
            <Card.Description>
              Rp {item.price.wholesale}/kodi
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
      <Container textAlign='center'>
        <h1>Produk</h1>
        <Search input={{ fluid: true }} onSearchChange={onSearchChange} />
      </Container>
      {loading ? <Spinner /> : (
      <Container fluid style={{marginTop: '1rem', paddingTop: '1rem', paddingBottom: '1rem'}}>
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
  item: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool,
  basket: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  item: state.item,
  isAuthenticated: state.auth.isAuthenticated,
  basket: state.transaction.transactions
});

export default connect(mapStateToProps, { getItems, basketItems })(Landing);
