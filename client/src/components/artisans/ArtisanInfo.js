import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { Switch, Route, Link } from 'react-router-dom';
import { Button, Form, Icon, Menu } from 'semantic-ui-react';

import History from './History';
import DebtBook from '../DSL/DebtBook';
import { getArtisan } from '../../actions/artisans';
import { getArtisanTransactions, getArtisanTransactionID } from '../../actions/artisantransactions';

const Transaksi = ({ getArtisan, artisan:{artisan, editID} }) => {
    
    const [dateRange, setDateRange] = useState({from: '', to: ''})
    const onChange = e => {
        setDateRange({ ...dateRange, [e.target.name]:e.target.value });
    }
    const { from, to } = dateRange;

    useEffect(() => {
        if (!artisan) getArtisan(editID);;
    }, [getArtisan, artisan, editID]);

    return (
        <Fragment>
                <Menu.Item position="right" href="/dashboard/pengrajin">
                    <Icon name="arrow left" size="large" />
                </Menu.Item>
                <h3>Detail Pengrajin</h3>
                {artisan && 
                   <p>
                       <strong>{artisan.name}</strong><br/>
                       {artisan.email && <Fragment>{artisan.email}<br/></Fragment>}
                       {artisan.phone && <Fragment>{artisan.phone}<br/></Fragment>}
                       {artisan.address && <Fragment>{artisan.address}<br/></Fragment>}
                       <strong>Saldo hutang: <NumberFormat value={artisan.debt} displayType={'text'} thousandSeparator={true} prefix={'Rp '}/></strong>
                   </p>
                }
                <hr style={{color:'#F2F2F2'}}/>
                <br/>
                <div>
                    <Button as={Link} to='/dashboard/pengrajin/info' color='twitter'>Riwayat Transaksi</Button>
                    <Button as={Link} to='/dashboard/pengrajin/info/debtbook' color='twitter'>BBP Hutang</Button>
                </div>
                <br/>
            <Form>
                <Form.Group>
                    <Form.Field width='3'>
                        <label>From</label>
                        <input 
                            type='date'
                            placeholder='from'
                            name='from'
                            value={from}
                            onChange={onChange}
                            required 
                        />
                    </Form.Field>
                    <Form.Field width='3'>
                        <label>To</label>
                        <input 
                            type='date'
                            placeholder='to'
                            name='to'
                            value={to}
                            onChange={onChange}
                            required 
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
           
            <Switch>
                <Route exact path="/dashboard/pengrajin/info" render={(props) => <History {...props} artisan={artisan} from={from} to={to} />} />
                <Route exact path="/dashboard/pengrajin/info/debtbook" render={(props) => <DebtBook {...props} debtor={artisan} from={from} to={to} />} />
            </Switch>

        </Fragment>
    );
};

Transaksi.propTypes = {
    getArtisan: PropTypes.func.isRequired,
    getArtisanTransactions: PropTypes.func.isRequired,
    getArtisanTransactionID: PropTypes.func.isRequired,
    artisan: PropTypes.object.isRequired,
    transactions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    artisan: state.artisan,
    transactions: state.artisantransaction
});

export default connect(mapStateToProps, { getArtisan, getArtisanTransactions, getArtisanTransactionID })(Transaksi);

