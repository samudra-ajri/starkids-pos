import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import { Form, Button, Icon, Table, Dropdown } from 'semantic-ui-react';

import Spinner from '../layout/Spinner';
import { getTransactions, getRangeTransactions } from '../../actions/transactions';

const Transaksi = ({ getTransactions, getRangeTransactions, transactions:{completeTransactions, loading} }) => {
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
 
    useEffect(() => {
        if (completeTransactions.length === 0) getTransactions(page);
        if (!loading && completeTransactions.length !== 0) {
            setData([...data, ...completeTransactions])
            console.log(data, completeTransactions);
            loading = true;
        }
    }, [loading, getTransactions, completeTransactions, data, page]);


    const [dateRange, setDateRange] = useState({from: '', to: ''})
    const { from, to } = dateRange;
    const onChange = e => {
        setDateRange({ ...dateRange, [e.target.name]:e.target.value });
    }

    const laba = {omzet: '', piutang: '', pelunasan: ''};
    let { omzet, piutang, pelunasan } = laba;

    const onSubmit = async e => {
        e.preventDefault();
        getRangeTransactions(from, to);
    }

    if (from !== '' && to !== '') {
        omzet = 0; pelunasan = 0; piutang = 0;
        data.forEach(transaction => {
            if (transaction.payment_type !== 'pelunasan') {
                omzet += transaction.total;
                if (transaction.payment_type === 'angsur') {
                    piutang += transaction.total;
                }
            } else {
                pelunasan += transaction.total;
            }
        });
    }

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
        <Fragment>
            <Form onSubmit={onSubmit}>
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
                    <Table basic='very' compact collapsing key={data._id}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Omzet</Table.HeaderCell>
                                <Table.HeaderCell>Piutang</Table.HeaderCell>
                                <Table.HeaderCell>Pelunasan</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>{omzet}</Table.Cell>
                                <Table.Cell>{piutang}</Table.Cell>
                                <Table.Cell>{pelunasan}</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                    
                    <Table basic='very' compact>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Tanggal</Table.HeaderCell>
                                <Table.HeaderCell>Pelanggan</Table.HeaderCell>
                                <Table.HeaderCell>Total</Table.HeaderCell>
                                <Table.HeaderCell>Jenis</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        {data.map(transaction => (renderTransaction(transaction)))}
                    </Table>
                </Fragment>
            )}
        </Fragment>
    );
};

Transaksi.propTypes = {
    getTransactions: PropTypes.func.isRequired,
    getRangeTransactions: PropTypes.func.isRequired,
    transactions: PropTypes.object.isRequired
  };

const mapStateToProps = state => ({
    transactions: state.transaction,
  });

export default connect(mapStateToProps, { getTransactions, getRangeTransactions })(Transaksi);