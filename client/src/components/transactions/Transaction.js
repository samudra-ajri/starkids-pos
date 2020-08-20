import React, { Fragment, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Transaction = ({ basket }) => {
    const initialState = {
        customer: '',
        payment_type: '',
        stuff: basket,
        total: 0
    }
    const [formData, setFormData] = useState(initialState);

    const { customer, payment_type, total } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const onSubmit = async e => {
        e.preventDefault();
    }

    return ( 
        <Fragment>
            <h1>Transaksi</h1>
            <Form style={{paddingBottom:'3rem'}} onSubmit={onSubmit}>
                <Form.Field>
                    <label>Pelanggan</label>
                    <input 
                        type="text"
                        placeholder='Nama Pelanggan'
                        name="customer"
                        value={customer}
                        onChange={onChange}
                        required 
                    />
                </Form.Field>
                <Form.Field>
                    <label>Jenis Pembayaran</label>
                    <input 
                        type="text"
                        placeholder='Jenis Pembayaran Stok'
                        name="payment_type"
                        value={payment_type}
                        onChange={onChange}
                        required
                    />
                </Form.Field>
                <Form.Field>
                    <label>Total</label>
                    <input 
                        type="number"
                        placeholder='Harga Total' 
                        name="total"
                        value={total}
                        onChange={onChange}
                        disabled
                    />
                </Form.Field>
                <Button primary type='submit'>Submit</Button>
            </Form>
        </Fragment>
    )
};

Transaction.propTypes = {
    basket: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    basket: state.transaction.transactions
});

export default connect(mapStateToProps)(Transaction);