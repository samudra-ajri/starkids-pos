import React, { Fragment, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { createItem } from '../../actions/items';
import { addImage } from '../../actions/fileUpload';

const CreateItem = ({ createItem, addImage }) => {
    const initialState = {
        name: '',
        quantity: '',
        retail: '',
        wholesale: '',
        image: 'default.jpg'
    }
    const [formData, setFormData] = useState(initialState);
    const { name, quantity, retail, wholesale } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const [file, setFile] = useState('');

    const onChangeFile = e => {
        setFile(e.target.files[0]);
        setFormData({ ...formData, [e.target.name]: name+'_'+e.target.files[0].name });
    }

    const onSubmit = async e => {
        e.preventDefault();
        addImage(file, name);
        createItem(formData);
    }

    return (
        <Fragment>
            <h1>Tambah Produk</h1>
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
                    <label>Jumlah Stok</label>
                    <input 
                        type="number"
                        placeholder='Jumlah Stok'
                        name="quantity"
                        value={quantity}
                        onChange={onChange}
                        required
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
                <Button primary type='submit'>Submit</Button>
            </Form>
        </Fragment>
    )
};

CreateItem.propTypes = {
    createItem: PropTypes.func.isRequired,
    addImage: PropTypes.func.isRequired
};

export default connect(null, { createItem, addImage })(CreateItem);