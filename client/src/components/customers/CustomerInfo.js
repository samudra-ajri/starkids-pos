import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import { Form, Button, Icon, Table, Dropdown, Menu } from 'semantic-ui-react';

import Spinner from '../layout/Spinner';
import { getCustomer } from '../../actions/customers';
import { getTransactions, getRangeTransactions } from '../../actions/transactions';
import { Link } from 'react-router-dom';

const Transaksi = ({ getCustomer, getTransactions, getRangeTransactions, customer:{customer, editID}, transactions:{completeTransactions, loading} }) => {
    useEffect(() => {
        if (!customer) getCustomer(editID);;
        getTransactions();
    }, [getTransactions, getCustomer, customer, editID]);

    let customerTransactions = [];
    if (customer) customerTransactions = completeTransactions.filter(transaction => transaction.customer.name === customer.name);

    customerTransactions.sort(function(a, b){
        var x = a.date.toLowerCase();
        var y = b.date.toLowerCase();
        if (x < y) {return 1;}
        if (x > y) {return -1;}
        return 0;
    });



    const [dateRange, setDateRange] = useState({from: '', to: ''})
    const { from, to } = dateRange;
    const onChange = e => {
        setDateRange({ ...dateRange, [e.target.name]:e.target.value });
    }

    const onSubmit = async e => {
        e.preventDefault();
        getRangeTransactions(from, to);
    }

    const renderTransaction = transaction => {
        return (
            <Table.Body key={transaction._id}>
                <Table.Row>
                    <Table.Cell><Moment format="DD-MM-YYYY">{transaction.date}</Moment></Table.Cell>
                    <Table.Cell>{transaction.stuff.length === 0 ? transaction.total : 
                        <Dropdown text={transaction.total.toString()} floating>
                            <Dropdown.Menu>
                                {transaction.stuff.map(product => {
                                    if (product.price_type === 'retail') {
                                        return <Dropdown.Item key={product._id} description={product.qty+' pcs'} text={product.item.name} />
                                    }
                                    return <Dropdown.Item key={product._id} description={product.qty+' kodi'} text={product.item.name} />
                                })}
                            </Dropdown.Menu>
                        </Dropdown>
                    }</Table.Cell>
                    <Table.Cell>{transaction.payment_type}</Table.Cell>
                </Table.Row>
            </Table.Body>
        );
    }

    return (
        <Fragment>
            <Form onSubmit={onSubmit}>
                <Menu.Item position="right" as={Link} to="/dashboard/pelanggan">
                    <Icon name="arrow left" size="large" />
                </Menu.Item>
                <h3>Detail Pelanggan</h3>
                {customer && 
                   <p>
                       <strong>{customer.name}</strong><br/>
                       {customer.email && <Fragment>{customer.email}<br/></Fragment>}
                       {customer.phone && <Fragment>{customer.phone}<br/></Fragment>}
                       {customer.address && <Fragment>{customer.address}<br/></Fragment>}
                       <strong>Piutang: {customer.debt}</strong>
                   </p>
                }
                <hr style={{color:'#F2F2F2'}}/>
                <h3>Riwayat Transaksi</h3>
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
                    <Button icon type='submit' style={{backgroundColor:'transparent', paddingTop:'30px'}} >
                        <Icon name='arrow circle right' size='large' color='teal' />
                    </Button>
                </Form.Group>
            </Form>
            {loading ? <Spinner /> : (
                <Fragment>
                    <Table basic='very' compact>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Tanggal</Table.HeaderCell>
                                <Table.HeaderCell>Total</Table.HeaderCell>
                                <Table.HeaderCell>Jenis</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        {customerTransactions.map(transaction => (renderTransaction(transaction)))}
                    </Table>
                </Fragment>
            )}
        </Fragment>
    );
};

Transaksi.propTypes = {
    getTransactions: PropTypes.func.isRequired,
    getCustomer: PropTypes.func.isRequired,
    getRangeTransactions: PropTypes.func.isRequired,
    customer: PropTypes.object.isRequired,
    transactions: PropTypes.object.isRequired
  };

const mapStateToProps = state => ({
    customer: state.customer,
    transactions: state.transaction
  });

export default connect(mapStateToProps, { getCustomer, getTransactions, getRangeTransactions })(Transaksi);