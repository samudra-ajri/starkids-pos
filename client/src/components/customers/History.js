import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import NumberFormat from 'react-number-format';

import { Table, Dropdown, Container, Pagination } from 'semantic-ui-react';

import Spinner from '../layout/Spinner';
import { getTransactions } from '../../actions/transactions';

const Transaksi = ({ getTransactions, customer, from, to, transactions:{completeTransactions, loading} }) => {
    
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
        if (customer) getTransactions(from, to, page, customer._id, 'desc');
    }, [getTransactions, customer, from, to, page]);

    const renderTransaction = transaction => {
        return (
            <Table.Body key={transaction._id}>
                <Table.Row>
                    <Table.Cell><Moment format="DD-MM-YYYY">{transaction.date}</Moment></Table.Cell>
                    <Table.Cell>{transaction.stuff.length === 0 ? <NumberFormat value={transaction.total} displayType={'text'} thousandSeparator={true}/> : 
                        
                        <NumberFormat value={transaction.total} displayType={'text'} thousandSeparator={true} renderText={value => 
                            <Dropdown text={value} floating>
                                <Dropdown.Menu>
                                    {transaction.stuff.map(product => {
                                        if (product.price_type === 'retail') {
                                            return <Dropdown.Item key={product._id} description={product.qty+' pcs'} text={product.item.name} />
                                        }
                                        return <Dropdown.Item key={product._id} description={product.qty+' kodi'} text={product.item.name} />
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                        }/>
                    }</Table.Cell>
                    <Table.Cell>{transaction.payment_type}</Table.Cell>
                </Table.Row>
            </Table.Body>
        );
    }

    return (
        <Fragment>
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
    transactions: PropTypes.object.isRequired
  };

const mapStateToProps = state => ({
    transactions: state.transaction
  });

export default connect(mapStateToProps, { getTransactions })(Transaksi);