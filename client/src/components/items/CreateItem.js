import React, { Fragment, useState, useEffect } from 'react';
import { Button, Form, Menu, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { createItem, getItem } from '../../actions/items';
import { addImage } from '../../actions/fileUpload';


const initialState = {
    name: '',
    unit: 'kodi',
    addquantity: 0,
    quantity: 0,
    retail: '',
    wholesale: '',
    image: 'default.jpg'
}

const CreateItem = ({ createItem, addImage, getItem, history, item:{item, editID, loading} }) => {
    
    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (!item) getItem(editID);
        if (!loading && item) {
            const profileData = { ...initialState };
            for (const key in item) {
                if (key in profileData) profileData[key] = item[key];
            }
            for (const key in item.price) {
                if (key in profileData) profileData[key] = item.price[key];
            }
            setFormData(profileData);
        }
    }, [loading, getItem, editID, item]);

    let { name, unit, addquantity, quantity, retail, wholesale } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    if (unit === 'kodi') {
        quantity += addquantity * 20; 
    } else {
        quantity += addquantity * 1;
    }

    const [file, setFile] = useState('');

    const onChangeFile = e => {
        setFile(e.target.files[0]);
        setFormData({ ...formData, [e.target.name]: name+'_'+e.target.files[0].name });
    }

    const onSubmit = async e => {
        e.preventDefault();
        formData.quantity = quantity;
        if (formData.image !== 'default.jpg') addImage(file, name);
        createItem(formData, editID, history);
    }

    return (
        <Fragment>
            <Menu.Item position="right" href="/dashboard/produk">
                <Icon name="arrow left" size="large" />
            </Menu.Item>
            <h3> 
                { editID ? 'Update ' : 'Tambah ' }Produk
            </h3>
            <Form style={{paddingBottom:'3rem'}} onSubmit={onSubmit}>
                <Form.Field>
                    <label>Nama Produk</label>
                    <input 
                        type="text"
                        placeholder='Nama Produk'
                        name="name"
                        value={name}
                        onChange={onChange}
                        required 
                    />
                </Form.Field>
                <Form.Field>
                    <label>Tambah Stok</label>
                    <Form.Group>
                        <Form.Field
                            type='radio'
                            name='unit'
                            label='Kodi'
                            value='kodi'
                            control='input'
                            onChange={onChange}
                            required={editID ? false : true}
                        />
                        <Form.Field
                            type='radio'
                            name='unit'
                            label='Satuan'
                            value='satuan'
                            control='input'
                            onChange={onChange}
                        />
                    </Form.Group>
                </Form.Field>
                <Form.Field>
                    <input 
                        type="number"
                        placeholder='Tambah Stok'
                        name="addquantity"
                        value={addquantity}
                        onChange={onChange}
                        required={editID ? false : true}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Jumlah Stok (pcs)</label>
                    <input 
                        type="number"
                        placeholder='Jumlah Stok'
                        name="quantity"
                        value={quantity}
                        onChange={onChange}
                        required
                        disabled
                    />
                </Form.Field>
                <Form.Field>
                    <label>Harga Eceran</label>
                    <input 
                        type="number"
                        placeholder='Harga Eceran' 
                        name="retail"
                        value={retail}
                        onChange={onChange}
                        required
                    />
                    <small>cth: 15000</small>
                </Form.Field>
                <Form.Field>
                    <label>Harga Grosir</label>
                    <input 
                        type="number"
                        placeholder='Harga Grosir' 
                        name="wholesale"
                        value={wholesale}
                        onChange={onChange}
                        required
                    />
                    <small>cth: 15000</small>
                </Form.Field>
                <Form.Field>
                    <label>Gambar Produk</label>
                    <input 
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={onChangeFile}
                    />
                </Form.Field>
                <Button primary type='submit'>{ editID ? 'Update' : 'Tambah' }</Button>
            </Form>
        </Fragment>
    )
};

CreateItem.propTypes = {
    createItem: PropTypes.func.isRequired,
    getItem: PropTypes.func.isRequired,
    addImage: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    item: state.item
});

export default connect(mapStateToProps, { createItem, addImage, getItem })(CreateItem);