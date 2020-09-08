import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Spinner from '../layout/Spinner';
import { getMaterials } from '../../actions/materials';
import { basketMaterials, cleanBasket } from '../../actions/artisantransactions';

import { Card, Container, Search, Button } from 'semantic-ui-react';


const Material = ({ isAuthenticated, getMaterials, basketMaterials, cleanBasket, materials: { materials, loading }, basket }) => {
  const [select, setSelect] = useState(basket);
  const [selectID, setSelectID] = useState(basket.map(material => material._id));
  const [search, setSearch] = useState('');
 
  useEffect(() => {
    getMaterials();
  }, [getMaterials]);

  const onSearchChange = e => {
    setSearch(e.target.value)
  }

  const onClick = (e, {detailmaterial}) => {
    if (isAuthenticated) {
      if (!selectID.includes(detailmaterial._id) && detailmaterial.quantity !== 0) {
        setSelectID([detailmaterial._id,...selectID]);
        setSelect([detailmaterial,...select]);
      } else {
        setSelectID(selectID.filter(material => material !== detailmaterial._id));
        setSelect(select.filter(material => material._id !== detailmaterial._id));
      }
    } 
  }
  
  basketMaterials(select);

  const onClickBasket = (e, {id} )=> {
    cleanBasket(basket, id);
    setSelect(select.filter(item => item._id !== id));
    setSelectID(selectID.filter(item => item !== id));

  }

  const renderBasket = material => {
    return <Button key={material._id} id={material._id} size='mini' color='purple' content={material.name} icon='x' labelPosition='right' onClick={onClickBasket}/>
  }

  const renderMaterial = material => {
    if ( search !== "" && material.name.toLowerCase().indexOf( search.toLowerCase() ) === -1 ){
      return null;
    }

    return (
      <Card key={material.name} detailmaterial={material} onClick={onClick}> 
        <Card.Content textAlign='center' style={selectID.includes(material._id) ? { backgroundColor: '#B7FFC9' } : {}}>
          <Card.Header>{material.name}</Card.Header>
            <Card.Description>
              stok: { material.quantity } { material.unit }
            </Card.Description>
        </Card.Content>
      </Card>
    )
  }

  return (
    <Fragment>
      <Container textAlign='center' style={{marginTop: '0rem'}}>
        <h1>Bahan Baku</h1>
        <Search input={{ fluid: true }} onSearchChange={onSearchChange} />
      </Container>

      {basket.length !== 0 &&
      <Container fluid style={{marginTop: '1rem', paddingTop: '0rem', paddingBottom: '0rem'}}>
        {basket.map(basket => (renderBasket(basket)))}
      </Container>
      }

      {loading ? <Spinner /> : (
      <Container fluid style={{marginTop: '0rem', paddingTop: '1rem', paddingBottom: '1rem'}}>
        <Card.Group itemsPerRow={8}>
          {materials.map(material => (renderMaterial(material)))}
        </Card.Group>
      </Container>
      )}
    </Fragment>
  );
};

Material.propTypes = {
    getMaterials: PropTypes.func.isRequired,
    basketMaterials: PropTypes.func.isRequired,
    cleanBasket: PropTypes.func.isRequired,
    materials: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    basket: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    materials: state.material,
    isAuthenticated: state.auth.isAuthenticated,
    basket: state.artisantransaction.transactions
});

export default connect(mapStateToProps, { getMaterials, basketMaterials, cleanBasket })(Material);
