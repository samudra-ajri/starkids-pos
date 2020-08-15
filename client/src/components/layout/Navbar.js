import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { Menu, Icon } from 'semantic-ui-react';

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const [activeItem, setActiveItem] = useState('produk');

  const onClick = (e, { name }) => {
    setActiveItem(name)
  }

  const authLinks = (
    <Fragment>
      <Link to="/create-item">
        <Menu.Item name='' onClick={onClick}><Icon name="add" color={activeItem === '' && 'green'}/></Menu.Item> 
      </Link>
      <Link to="/">
        <Menu.Item name='produk' active={activeItem === 'produk'} onClick={onClick}/>
      </Link>
      <Link to="/dashboard">
        <Menu.Item name='dashboard' active={activeItem === 'dashboard'} onClick={onClick}/>
      </Link>
      <a onClick={logout} href='#!'>
        <Menu.Item name='logout' active={activeItem === 'logout'} onClick={onClick}/>
      </a>
    </Fragment>
  );
    
  const guestLinks = (
    <Fragment>
      <Link to="/">
        <Menu.Item name='produk' active={activeItem === 'produk'} onClick={onClick}/>
      </Link>
      <Link to="/login">
        <Menu.Item name='login' active={activeItem === 'login'} onClick={onClick}/>
      </Link>
    </Fragment>
  );

  return (
      <Menu pointing secondary style={{borderRadius: '0px'}}>
        <Link to="/">
          <Menu.Item header><Icon name='fly'/>STARKIDS</Menu.Item>
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
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);