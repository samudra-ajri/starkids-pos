import React from 'react';
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