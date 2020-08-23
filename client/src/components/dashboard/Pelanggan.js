import React, { Fragment } from 'react';
import { Icon, Button} from 'semantic-ui-react';

const Pelanggan = () => {
    return (
        <Fragment>
            <h3 style={{flexGrow:'0'}}>Daftar Pelanggan</h3>
            <div>
                <Button href='/create-customer' icon labelPosition='left' color='twitter'>
                    <Icon name='user plus' /> Tabmbah Pelanggan
                </Button>
            </div>
        </Fragment>
    );
};

export default Pelanggan;