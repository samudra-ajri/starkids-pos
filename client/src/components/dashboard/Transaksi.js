import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import { Form, Table, Dropdown, Pagination, Container } from 'semantic-ui-react';

import Spinner from '../layout/Spinner';
import { getTransactions} from '../../actions/transactions';

const Transaksi = ({ getTransactions, transactions:{completeTransactions, loading} }) => {
    
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
        getTransactions(from, to, page, '');
    }, [getTransactions, from, to, page]);

    const renderTransaction = transaction => {
        return (
            <Table.Body key={transaction._id}>
                <Table.Row>
                    <Table.Cell><Moment format="DD-MM-YYYY">{transaction.date}</Moment></Table.Cell>
                    <Table.Cell>{transaction.customer.name}</Table.Cell>
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
        <Fragment >
            <Form>
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
                                <Table.HeaderCell>Pelanggan</Table.HeaderCell>
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
    transactions: PropTypes.object.isRequired
  };

const mapStateToProps = state => ({
    transactions: state.transaction,
  });

export default connect(mapStateToProps, { getTransactions })(Transaksi);