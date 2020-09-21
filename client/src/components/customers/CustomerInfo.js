import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { Switch, Route, Link } from 'react-router-dom';
import { Form, Icon, Menu, Button } from 'semantic-ui-react';

import History from './History';
import DebtBook from '../DSL/DebtBook';
import { getCustomer } from '../../actions/customers';

const Transaksi = ({ getCustomer, customer:{customer, editID} }) => {
    
    const [dateRange, setDateRange] = useState({from: '', to: ''})
    const onChange = e => {
        setDateRange({ ...dateRange, [e.target.name]:e.target.value });
    }
    const { from, to } = dateRange;

    useEffect(() => {
        if (!customer) getCustomer(editID);
    }, [getCustomer, customer, editID]);

    return (
        <Fragment>
            <Form>
                <Menu.Item position="right" href="/dashboard/pelanggan">
                    <Icon name="arrow left" size="large" />
                </Menu.Item>
                <h3>Detail Pelanggan</h3>
                {customer && 
                   <p>
                       <strong>{customer.name}</strong><br/>
                       {customer.email && <Fragment>{customer.email}<br/></Fragment>}
                       {customer.phone && <Fragment>{customer.phone}<br/></Fragment>}
                       {customer.address && <Fragment>{customer.address}<br/></Fragment>}
                       <strong>Saldo hutang: <NumberFormat value={customer.debt} displayType={'text'} thousandSeparator={true} prefix={'Rp '}/></strong>
                   </p>
                }
                <hr style={{color:'#F2F2F2'}}/>
                <br/>
                <div>
                    <Button as={Link} to='/dashboard/pelanggan/info' color='twitter'>Riwayat Transaksi</Button>
                    <Button as={Link} to='/dashboard/pelanggan/info/debtbook' color='twitter'>BBP Hutang</Button>
                </div>
                <br/>
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
                <Route exact path="/dashboard/pelanggan/info" render={(props) => <History {...props} customer={customer} from={from} to={to} />} />
                <Route exact path="/dashboard/pelanggan/info/debtbook" render={(props) => <DebtBook {...props} debtor={customer} from={from} to={to} />} />
            </Switch>

        </Fragment>
    );
};

Transaksi.propTypes = {
    getCustomer: PropTypes.func.isRequired,
    customer: PropTypes.object.isRequired
  };

const mapStateToProps = state => ({
    customer: state.customer
  });

export default connect(mapStateToProps, { getCustomer })(Transaksi);