import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Form, Table } from 'semantic-ui-react';

import { getTransactions } from '../../actions/transactions';
import { getArtisans } from '../../actions/artisans';
import { getCustomers } from '../../actions/customers';
import { getItems } from '../../actions/items';
import { getMaterials } from '../../actions/materials';

const ProgresProduk = ({ 
    getTransactions, getArtisans, getCustomers, getItems, getMaterials,
    transactions, artisans, customers, items, materials
}) => {
    
    const [dateRange, setDateRange] = useState({from: '', to: ''})
    const onChange = e => {
        setDateRange({ ...dateRange, [e.target.name]:e.target.value });
    }
    const { from, to } = dateRange;

    useEffect(() => {
        getTransactions(from, to, '', '');
        getArtisans();
        getCustomers();
        getItems();
        getMaterials();
    }, [getTransactions, getArtisans, getCustomers, getItems, getMaterials, from, to]);

    let omzet = '-';
    let debtArtisans = 0;
    let debtCustomers = 0;
    let stockItems = 0;
    let stockMaterials = 0;
    
    if (from || to) {
        omzet = 0;
        transactions.forEach(transaction => {
            if (transaction.payment_type !== 'pelunasan'){
                omzet += transaction.total;
            }
        });
    };

    artisans.forEach(artisan => {
        debtArtisans += artisan.debt;
    });

    customers.forEach(customer => {
        debtCustomers += customer.debt;
    });

    items.forEach(item => {
        stockItems += item.quantity/20 * item.price.wholesale;
    });

    materials.forEach(material => {
        stockMaterials += material.quantity * material.price;
    });

    return (
        <Fragment >
            <Form>
                <h3>Laporan Stock Opname</h3>
                <Form.Group>
                    <Form.Field width='3'>
                        <label>Omzet From</label>
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
            <Fragment>
                <Form>
                <Table basic='very' compact collapsing>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell><strong>Omzet</strong></Table.Cell>
                            <Table.Cell>{omzet}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><strong>Piutang Pelanggan</strong></Table.Cell>
                            <Table.Cell>{debtCustomers}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><strong>Piutang Pengrajin</strong></Table.Cell>
                            <Table.Cell>{debtArtisans}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><strong>Stok Produk</strong></Table.Cell>
                            <Table.Cell>{stockItems}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><strong>Stok Bahan</strong></Table.Cell>
                            <Table.Cell>{stockMaterials}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><strong>TOTAL</strong></Table.Cell>
                            <Table.Cell>{omzet !== '-' ? <b>{omzet + debtCustomers + debtArtisans + stockItems + stockMaterials}</b> : '-'}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                </Form>
            </Fragment>
        </Fragment>
    );
};

ProgresProduk.propTypes = {
    getTransactions: PropTypes.func.isRequired,
    getArtisans: PropTypes.func.isRequired,
    getCustomers: PropTypes.func.isRequired,
    getItems: PropTypes.func.isRequired,
    getMaterials: PropTypes.func.isRequired,
    transactions: PropTypes.array.isRequired,
    artisans: PropTypes.array.isRequired,
    customers: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    materials: PropTypes.array.isRequired
  };

const mapStateToProps = state => ({
    transactions: state.transaction.completeTransactions,
    artisans: state.artisan.artisans,
    customers: state.customer.customers,
    items: state.item.items,
    materials: state.material.materials
  });

export default connect(mapStateToProps, {
    getTransactions,
    getArtisans,
    getCustomers,
    getItems,
    getMaterials 
})(ProgresProduk);