import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import NumberFormat from 'react-number-format';

import { Form, Icon, Table, Dropdown, Menu, Container, Pagination } from 'semantic-ui-react';

import Spinner from '../layout/Spinner';
import { getCustomer } from '../../actions/customers';
import { getTransactions } from '../../actions/transactions';
import { Link } from 'react-router-dom';

const Transaksi = ({ getCustomer, getTransactions, customer:{customer, editID}, transactions:{completeTransactions, loading} }) => {
    
    const [dateRange, setDateRange] = useState({from: '', to: ''})
    const onChange = e => {
        setDateRange({ ...dateRange, [e.target.name]:e.target.value });
    }
    const { from, to } = dateRange;

    const [pagination, setPagination] = useState({page: 1, totalPages:1000});

    const onPageChange = (e, {activePage}) => {
        if (page !== 1 && completeTransactions.length === 0){
            setPagination({ ...pagination, 'page':1 });
        } else if (completeTransactions.length !== 0) {
            setPagination({ ...pagination, 'page':activePage });
        }
    }
    const {page, totalPages} = pagination;

    useEffect(() => {
        if (!customer) getCustomer(editID);
        getTransactions(from, to, page, editID, 'desc');
    }, [getTransactions, getCustomer, customer, editID, from, to, page]);

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
            <Form>
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
                       <strong>Piutang: <NumberFormat value={customer.debt} displayType={'text'} thousandSeparator={true} prefix={'Rp '}/></strong>
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
                        {completeTransactions.map(transaction => (renderTransaction(transaction)))}
                    </Table>
                    <Container textAlign='center' style={{marginTop:'0px'}}>
                    <Pagination
                        boundaryRange={0}
                        activePage={page}
                        ellipsisItem={null}
                        firstItem={null}
                        lastItem={null}
                        siblingRange={1}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                    </Container>
                </Fragment>
            )}
        </Fragment>
    );
};

Transaksi.propTypes = {
    getTransactions: PropTypes.func.isRequired,
    getCustomer: PropTypes.func.isRequired,
    customer: PropTypes.object.isRequired,
    transactions: PropTypes.object.isRequired
  };

const mapStateToProps = state => ({
    customer: state.customer,
    transactions: state.transaction
  });

export default connect(mapStateToProps, { getCustomer, getTransactions })(Transaksi);