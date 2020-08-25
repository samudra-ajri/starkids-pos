import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { Menu, Icon } from 'semantic-ui-react';


const Navbar = ({ auth: { isAuthenticated, loading }, logout, basket }) => {
  const [activeItem, setActiveItem] = useState('produk');

  const onClick = (e, { name }) => {
    setActiveItem(name)
  }

  const authLinks = (
    <Fragment>
      {basket.length !== 0 ?
      (<Menu.Item name='basket' as={Link} to='/create-transaction' active={activeItem === 'basket'} onClick={onClick}>
        <Icon name='shopping basket' color='orange'/><b style={{color:'orange'}}>{basket.length}</b>
      </Menu.Item>) :
      (<Menu.Item name='basket' as={Link} to='/create-transaction' active={activeItem === 'basket'} onClick={onClick}>
        <Icon name='shopping basket' />
      </Menu.Item>)
      }
      <Menu.Item name='produk' as={Link} to='/' active={activeItem === 'produk'} onClick={onClick}/>
      <Menu.Item name='dashboard' as={Link} to='/dashboard' active={activeItem === 'dashboard'} onClick={onClick}/>
      <Menu.Item name='logout' active={activeItem === 'logout'} onClick={logout}/>
    </Fragment>
  );
    
  const guestLinks = (
    <Fragment>
        <Menu.Item name='produk' as={Link} to='/' active={activeItem === 'produk'} onClick={onClick}/>
        <Menu.Item name='login' as={Link} to='/login' active={activeItem === 'login'} onClick={onClick}/>
    </Fragment>
  );

  return (
      <Menu stackable secondary style={{borderRadius: '0px', borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: '#DEDEDE'}}>
        <Link to="/">
          <Menu.Item header>
            <img alt='logo' src={require(`../../img/logo2.png`)}/> STARKIDS
          </Menu.Item>
        </Link>
        <Menu.Menu position='right'>
        {!loading && (
          <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
        )}
        </Menu.Menu>
      </Menu>
  )
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  basket: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  basket: state.transaction.transactions
});

export default connect(mapStateToProps, { logout })(Navbar);