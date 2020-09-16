import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

import { Container, Form, Table, Button, Icon } from 'semantic-ui-react';

import { getTransactions } from '../../actions/transactions';
import { getArtisans } from '../../actions/artisans';
import { getCustomers } from '../../actions/customers';
import { getItems } from '../../actions/items';
import { getMaterials } from '../../actions/materials';

import Revenue from '../charts/Revenue';
import TopItems from '../charts/TopItems';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Laporan = ({ 
    getTransactions, getArtisans, getCustomers, getItems, getMaterials,
    transactions, artisans, customers, items, materials
}) => {
    
    const [dateRange, setDateRange] = useState({from: '', to: ''})
    const onChange = e => {
        setDateRange({ ...dateRange, [e.target.name]:e.target.value });
    }
    const { from, to } = dateRange;

    useEffect(() => {
        getTransactions(from, to, '', '', 'asc');
        getArtisans();
        getCustomers();
        getItems();
        getMaterials();
    }, [getTransactions, getArtisans, getCustomers, getItems, getMaterials, from, to]);

    let debtArtisans = 0;
    let debtCustomers = 0;
    let stockItems = 0;
    let stockMaterials = 0;
    
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
    
    const labels = [];
    const revenues = [];
    const cashs = [];
    const debts = [];

    const itemList = [];

    if (from || to) {
        if (transactions.length !== 0) {
            const initLabelDate = new Date(transactions[0].date);
            const initLabel = monthNames[initLabelDate.getMonth()] + " '" + initLabelDate.getFullYear().toString().substr(-2);
            labels.push(initLabel)
        }

        let date = '';
        let revenue = 0;
        let cash = 0;
        let debt = 0;

        transactions.forEach( (transaction, idx) => {
            date = new Date(transaction.date);
            const month = monthNames[date.getMonth()] + " '" + date.getFullYear().toString().substr(-2);

            if (transaction.payment_type !== 'pelunasan') {

                // Data for Line Chart
                if (labels.includes(month)){
                    revenue += transaction.total;
                    if (transaction.payment_type !== 'tunai') {
                        cash += transaction.total;
                    } else {
                        debt += transaction.total;
                    }
                } else {
                    labels.push(month);

                    revenues.push(revenue/1000000);
                    cashs.push(cash/1000000);
                    debts.push(debt/1000000);

                    revenue = transaction.total;

                    if (transaction.payment_type !== 'tunai') {
                        cash = transaction.total;
                        debt = 0;
                    } else {
                        cash = 0;
                        debt = transaction.total;
                    }
                }

                // Data for Doughnut Chart
                transaction.stuff.forEach(element => {

                    if (itemList.length === 0) {
                        itemList.push({name: element.item.name, value: 0});
                    } else {
                        let found = false;
                        for (let i = 0; i < itemList.length; i++) {
                            if (itemList[i].name === element.item.name) found = true;
                        }
                        if (found === false) itemList.push({name: element.item.name, value: 0});
                    }

                    const itemIdx = itemList.findIndex(obj => obj.name === element.item.name)

                    if (element.price_type === 'wholesale'){
                        itemList[itemIdx].value += element.qty*20;
                    } else {
                        itemList[itemIdx].value += element.qty;
                    }
                });
            }

            itemList.sort(function(a, b){return b.value - a.value});

            if (idx === transactions.length-1) {
                revenues.push(revenue/1000000);
                cashs.push(cash/1000000);
                debts.push(debt/1000000);
            }
        });
    };

    const onClick = () => {
        window.print();
    }
    

    return (
        <Fragment >
            <div id="section-to-print">
                <Form>
                    <h3>Laporan Stock Opname</h3>
                    <Button onClick={onClick} icon labelPosition='left' color='twitter'>
                        <Icon name='print' /> Cetak Laporan
                    </Button>
                    <Table basic='very' compact collapsing>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell><strong>Piutang Pelanggan</strong></Table.Cell>
                                <Table.Cell><NumberFormat value={debtCustomers} displayType={'text'} thousandSeparator={true} prefix={'Rp '}/></Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell><strong>Piutang Pengrajin</strong></Table.Cell>
                                <Table.Cell><NumberFormat value={debtArtisans} displayType={'text'} thousandSeparator={true} prefix={'Rp '}/></Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell><strong>Stok Produk</strong></Table.Cell>
                                <Table.Cell><NumberFormat value={stockItems} displayType={'text'} thousandSeparator={true} prefix={'Rp '}/></Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell><strong>Stok Bahan</strong></Table.Cell>
                                <Table.Cell><NumberFormat value={stockMaterials} displayType={'text'} thousandSeparator={true} prefix={'Rp '}/></Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
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
                <div id="chart">
                    <Container style={{marginTop:'0px', marginRight:'100px'}}>
                        <Revenue 
                            labelsData={labels} 
                            revenuesData={revenues}
                            cashsData={cashs}
                            debtsData={debts}
                        />
                
                        { itemList.length !== 0 && <h4>Top Produk</h4>}
                        <TopItems
                            itemsData={itemList.slice(0, 9)} 
                        />
                    </Container>
                </div>
            </div>
        </Fragment>
    );
};

Laporan.propTypes = {
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
})(Laporan);
