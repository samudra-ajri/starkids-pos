import React, { Fragment, useState } from 'react';
import { Button, Form, Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { createCustomer } from '../../actions/customers';

const CreateCustomer = ({ createCustomer, history }) => {
    const initialState = {
        name: '',
        email: '',
        address: '',
        phone: '',
        debt: 0
    }
    const [formData, setFormData] = useState(initialState);
    const { name, email, address, phone, debt } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const onSubmit = async e => {
        e.preventDefault();
        createCustomer(formData, history);
    }

    return (
        <Fragment>
            <Container>
            <h1>Tambah Pelanggan</h1>
            <Form style={{paddingBottom:'3rem'}} onSubmit={onSubmit}>
                <Form.Field>
                    <label>Nama</label>
                    <input 
                        type="text"
                        placeholder='Nama Pelanggan'
                        name="name"
                        value={name}
                        onChange={onChange}
                        required 
                    />
                </Form.Field>
                <Form.Field>
                    <label>Email</label>
                    <input 
                        type='email'
                        placeholder='Email Pelanggan'
                        name="email"
                        value={email}
                        onChange={onChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Alamat</label>
                    <input 
                        type="text"
                        placeholder='Alamat Pelanggan' 
                        name="address"
                        value={address}
                        onChange={onChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>No. Telephon/HP</label>
                    <input 
                        type="text"
                        placeholder='Telephon/HP Pelanggan' 
                        name="phone"
                        value={phone}
                        onChange={onChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Piutang</label>
                    <input 
                        type="number"
                        placeholder='Tanggungan Hutang' 
                        name="debt"
                        value={debt}
                        onChange={onChange}
                    />
                    <small>cth: 15000</small>
                </Form.Field>
                <Button primary type='submit'>Submit</Button>
            </Form>
            </Container>
        </Fragment>
    )
};

CreateCustomer.propTypes = {
    createCustomer: PropTypes.func.isRequired
};

export default connect(null, { createCustomer })(CreateCustomer);