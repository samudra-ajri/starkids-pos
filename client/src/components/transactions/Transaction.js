import React, { Fragment, useState, useEffect } from 'react';
import { Button, Form, Image, Card, Icon, Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { getCustomers, patchDebt } from '../../actions/customers';
import { cleanBasket, createTransaction } from '../../actions/transactions';
import { patchQuantity } from '../../actions/items';

const Transaction = ({ basket, getCustomers, patchDebt, customers: {customers}, cleanBasket, createTransaction, patchQuantity, history }) => {
    useEffect(() => {
        getCustomers();
    }, [getCustomers]);
    
    customers.sort(function(a, b){
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });

    let initialState = {};
    basket.forEach(item => {
        initialState['qty_'+item._id] = 1;
        initialState['rd_'+item._id] = item.price.retail;
        initialState['ttl_'+item._id] = item.price.retail;
    });
    
    initialState['customer'] = '5f42206e4398bc7741e47983';
    initialState['payment_type'] = 'tunai';
    initialState['stuff'] = basket;
    initialState['total'] = 0;
    
    const [formData, setFormData] = useState(initialState);
    const { payment_type } = formData; 
    
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    
    basket.forEach(item => {
        formData['ttl_'+item._id] = formData[['qty_'+item._id]] * formData[['rd_'+item._id]];

    });
    
    if (formData['payment_type'] !== 'pelunasan') {
        formData['total'] = 0;
        basket.forEach(item => {
            formData['total'] += formData['ttl_'+item._id]
        }); 
    }
    
    const onClick = e => {
        cleanBasket(basket, e.target.id);
        delete formData[`qty_${e.target.id}`];
        delete formData[`rd_${e.target.id}`];
        delete formData[`ttl_${e.target.id}`];
    }
    
    formData['stuff'] = basket;
    
    const onSubmit = async e => {
        e.preventDefault();
        
        // Update quantity of items
        let leftQty = 0;
        const completeStuff = [];
        formData['stuff'].forEach(item => {

            let typ = '';
            if (Number(formData['rd_'+item._id]) === item.price.retail) {
                typ = 'retail';
                leftQty = item.quantity - formData['qty_'+item._id];
            } else {
                typ = 'wholesale';
                leftQty = item.quantity - (formData['qty_'+item._id] * 20);
            }
            completeStuff.push({ 'qty': formData['qty_'+item._id], 'price_type': typ, 'item': item._id });
            patchQuantity({ 'quantity': leftQty }, item._id);
        });

        // Update debt of the customer
        let debt = 0; let i = 0;
        if (formData['payment_type'] === 'pelunasan') {
            for(i = 0; i < customers.length; i++) {
                if (customers[i]._id === formData['customer']) {
                    debt = customers[i].debt;
                    break;
                }
            }
            debt -= formData['total'];
            patchDebt({'debt':debt}, formData['customer']);
        } else if (formData['payment_type'] === 'angsur') {
            for(i = 0; i < customers.length; i++) {
                if (customers[i]._id === formData['customer']) {
                    debt = customers[i].debt;
                    break;
                }
            }
            debt += formData['total'];
            patchDebt({'debt':debt}, formData['customer']);
        }

        // Create transaction
        const finalData = {
            customer: formData['customer'],
            payment_type: formData['payment_type'],
            stuff: completeStuff,
            total: formData['total']
        }
        createTransaction(finalData, history, true);
    }


    const renderItem = item => {
        return (
            <Card key={item._id}>
                <Card.Content>
                    <Image
                    floated='left'
                    size='mini'
                    src={require(`../../img/${item.image}`)}
                    />
                    <Card.Header>{item.name}</Card.Header>
                    <Card.Meta>Stok: {item.quantity}</Card.Meta>
                    <Card.Description>
                        <Form.Group>
                            <Form.Field
                                type='radio'
                                label={'Satuan (Rp '+item.price.retail+')'}
                                value={item.price.retail}
                                control='input'
                                name={'rd_'+item._id}
                                onChange={onChange}
                                required
                            />
                            <Form.Field
                                type='radio'
                                label={'Kodi (Rp '+item.price.wholesale+')'}
                                value={item.price.wholesale}
                                control='input'
                                name={'rd_'+item._id}
                                onChange={onChange}
                            />
                        </Form.Group>
                        <input
                            type="number"
                            name={'qty_'+item._id}
                            value={formData['qty_'+item._id]}
                            min="1"
                            max={Number(formData['rd_'+item._id]) === item.price.retail ? item.quantity : item.quantity/20}
                            placeholder='quantity' 
                            onChange={onChange}
                        />
                    </Card.Description>
                    <Card.Description>
                        <br/>
                        Total: {formData['ttl_'+item._id]}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Button icon id={item._id} style={{backgroundColor:'transparent'}} onClick={onClick}>
                        <Icon name='x' /> Keluarkan dari keranjang
                    </Button>
                </Card.Content>
            </Card>
        )
    }

    return ( 
        <Fragment>
            <Container>
            <h1>Transaksi</h1> <br/>
            <Form style={{paddingBottom:'3rem'}} onSubmit={onSubmit}>
                <Card.Group>

                    {formData['stuff'].map(item => (renderItem(item)))}
                </Card.Group>
                <Form.Field style={{marginTop:'1rem'}}>
                    <label>Pelanggan</label>
                    <select
                        placeholder='Nama Pelanggan' 
                        name="customer"
                        onChange={onChange}
                        required
                    >
                        {customers.map(customer => { 
                            return <option key={customer._id} value={customer._id}>{customer.name}</option>
                        })}
                    </select>
                </Form.Field>
                <Form.Field>
                    <label>Jenis Pembayaran</label>
                    <select
                        placeholder='Jenis Pembayaran' 
                        name="payment_type"
                        onChange={onChange}
                        required
                    >
                        <option value="tunai">Tunai</option>
                        <option value="angsur">Angsur</option>
                        <option value="pelunasan">Pelunasan</option>
                    </select>
                </Form.Field>
                <Form.Field>
                    <label>Total</label>
                    <input 
                        type="number"
                        placeholder='Harga Total' 
                        name="total"
                        value={formData['total']}
                        onChange={onChange}
                        disabled={payment_type === 'pelunasan' ? false : true}
                    />
                </Form.Field>
                <div>
                    <Button as={Link} to='/'>Kembali</Button>
                    <Button primary type='submit'>Submit</Button>
                </div>
            </Form>
            </Container>
        </Fragment>
    )
};

Transaction.propTypes = {
    basket: PropTypes.array.isRequired,
    customers: PropTypes.object.isRequired,
    getCustomers: PropTypes.func.isRequired,
    patchDebt: PropTypes.func.isRequired,
    cleanBasket: PropTypes.func.isRequired,
    createTransaction: PropTypes.func.isRequired,
    patchQuantity: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    basket: state.transaction.transactions,
    customers: state.customer
});

export default connect(mapStateToProps, { getCustomers, patchDebt, cleanBasket, createTransaction, patchQuantity })(Transaction);