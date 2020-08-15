import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { Segment } from 'semantic-ui-react';

const Footer = () => {
    var year = new Date();
    return (
        <Segment inverted style={{borderRadius: '0px', textAlign: 'center'}}> 
            Copyright © {year.getFullYear()}
        </Segment>
    )
}

export default Footer;