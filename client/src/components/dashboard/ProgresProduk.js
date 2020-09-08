import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';

import { Form, Table, Pagination, Container, Button, Icon } from 'semantic-ui-react';

import Spinner from '../layout/Spinner';
import { getArtisanTransactions, getArtisanTransactionID} from '../../actions/artisantransactions';

const ProgresProduk = ({ getArtisanTransactions, getArtisanTransactionID, artisantransactions:{completeTransactions, loading} }) => {
    
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
        getArtisanTransactions(from, to, page, '');
    }, [getArtisanTransactions, from, to, page]);

    const onClick = (e, {id}) => {
        getArtisanTransactionID(id);
    };

    const renderColor = text => {
        let color='';
        if (text === 'On Progress') {
            color = 'orange';
        } else if (text === 'Selesai') {
            color = 'green';
        } else {
            color = 'red';
        }

        return (
            <b style={{color: color }}>{text}</b>
        );
    }

    const renderTransaction = transaction => {
        return (
            <Table.Body key={transaction._id}>
                <Table.Row>
                    <Table.Cell><Moment format="DD-MM-YYYY">{transaction.order_date}</Moment></Table.Cell>
                    <Table.Cell>
                        {transaction.finish_date ? 
                        <Moment format="DD-MM-YYYY">{transaction.finish_date}</Moment> : "-" }
                    </Table.Cell>
                    <Table.Cell>{transaction.item}</Table.Cell>
                    <Table.Cell>{transaction.artisan}</Table.Cell>
                    <Table.Cell>{renderColor(transaction.status)}</Table.Cell>
                    <Table.Cell textAlign='center'>
                        <Button as={Link} to='/dashboard/progres/action' icon style={{backgroundColor:'transparent', padding:'0px'}} id={transaction._id} onClick={onClick}>
                            <Icon name='arrow right' size='large' color='teal' />
                        </Button>
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
        );
    }

    return (
        <Fragment >
            <Form>
                <h3>Progres Produk</h3>
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
                                <Table.HeaderCell>Tgl Pengerjaan</Table.HeaderCell>
                                <Table.HeaderCell>Tgl Selesai</Table.HeaderCell>
                                <Table.HeaderCell>Produk</Table.HeaderCell>
                                <Table.HeaderCell>Pengrajin</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                <Table.HeaderCell textAlign='center'>Tindakan</Table.HeaderCell>
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

ProgresProduk.propTypes = {
    getArtisanTransactions: PropTypes.func.isRequired,
    getArtisanTransactionID: PropTypes.func.isRequired,
    artisantransactions: PropTypes.object.isRequired
  };

const mapStateToProps = state => ({
    artisantransactions: state.artisantransaction,
  });

export default connect(mapStateToProps, { getArtisanTransactions, getArtisanTransactionID })(ProgresProduk);