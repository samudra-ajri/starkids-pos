import React, { Fragment, useState,useEffect } from 'react';
import { Button, Form, Icon, Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { createCustomer, getCustomer } from '../../actions/customers';

const initialState = {
    name: '',
    email: '',
    address: '',
    phone: '',
    debt: 0
};

const CreateCustomer = ({ createCustomer, getCustomer, history, customer:{customer, editID, loading} }) => {
    
    const [formData, setFormData] = useState(initialState);
    
    useEffect(() => {
        if (!customer) getCustomer(editID);
        if (!loading && customer) {
            const profileData = { ...initialState };
            for (const key in customer) {
                if (key in profileData) profileData[key] = customer[key];
            }
            setFormData(profileData);
        }
    }, [loading, getCustomer, editID, customer]);
    
    const { name, email, address, phone, debt } = formData;
    
    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    
    const onSubmit = async e => {
        e.preventDefault();
        createCustomer(formData, editID, history);
    }
    
    console.log(formData);
    
    return (
        <Fragment>
            
            <Menu.Item position="right" href="/dashboard/pelanggan">
                <Icon name="arrow left" size="large" />
            </Menu.Item>
            <h3>
                { editID === 'false' ? 'Tambah ' : 'Update ' }Pelanggan
            </h3>
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
                <div>
                    <Button primary type='submit'>{ editID === 'false' ? 'Tambah' : 'Update' }</Button>
                </div>
            </Form>
        </Fragment>
    )
};

CreateCustomer.propTypes = {
    createCustomer: PropTypes.func.isRequired,
    getCustomer: PropTypes.func.isRequired,
    customer: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    customer: state.customer
});

export default connect(mapStateToProps, { createCustomer, getCustomer })(CreateCustomer);