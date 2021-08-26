import React, { Fragment, useState,useEffect } from 'react';
import { Button, Form, Icon, Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { createArtisan, getArtisan } from '../../actions/artisans';

const initialState = {
    name: '',
    email: '',
    address: '',
    phone: '',
    debt: 0
};

const CreateArtisan = ({ createArtisan, getArtisan, history, artisan:{artisan, editID, loading} }) => {
    
    const [formData, setFormData] = useState(initialState);
    
    useEffect(() => {
        if (!artisan) getArtisan(editID);
        if (!loading && artisan) {
            const profileData = { ...initialState };
            for (const key in artisan) {
                if (key in profileData) profileData[key] = artisan[key];
            }
            setFormData(profileData);
        }
    }, [loading, getArtisan, editID, artisan]);
    
    const { name, email, address, phone, debt } = formData;
    
    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    
    const onSubmit = async e => {
        e.preventDefault();
        createArtisan(formData, editID, history);
    }
    
    return (
        <Fragment>
            
            <Menu.Item position="right" href="/dashboard/pengrajin">
                <Icon name="arrow left" size="large" />
            </Menu.Item>
            <h3>
                { editID ? 'Update ' :'Tambah ' }Pengrajin
            </h3>
            <Form style={{paddingBottom:'3rem'}} onSubmit={onSubmit}>
                <Form.Field>
                    <label>Nama</label>
                    <input 
                        type="text"
                        placeholder='Nama Pengrajin'
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
                        placeholder='Email Pengrajin'
                        name="email"
                        value={email}
                        onChange={onChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Alamat</label>
                    <input 
                        type="text"
                        placeholder='Alamat Pengrajin' 
                        name="address"
                        value={address}
                        onChange={onChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>No. Telephon/HP</label>
                    <input 
                        type="text"
                        placeholder='Telephon/HP Pengrajin' 
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
                    <Button primary type='submit'>{ editID ? 'Update' : 'Tambah' }</Button>
                </div>
            </Form>
        </Fragment>
    )
};

CreateArtisan.propTypes = {
    createArtisan: PropTypes.func.isRequired,
    getArtisan: PropTypes.func.isRequired,
    artisan: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    artisan: state.artisan
});

export default connect(mapStateToProps, { createArtisan, getArtisan })(CreateArtisan);