import React, { Fragment, useState, useEffect } from 'react';
import { Button, Form, Menu, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { createMaterial, getMaterial } from '../../actions/items';

const initialState = {
    name: '',
    unit: '',
    quantity: 0
}

const CreateMaterial = ({ createMaterial, getMaterial, history, material:{material, editID, loading} }) => {
    
    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (!material) getMaterial(editID);
        if (!loading && material) {
            const profileData = { ...initialState };
            for (const key in material) {
                if (key in profileData) profileData[key] = material[key];
            }
            setFormData(profileData);
        }
    }, [loading, getMaterial, editID, material]);

    let { name, unit, quantity } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const onSubmit = async e => {
        e.preventDefault();
        createMaterial(formData, editID, history);
    }

    return (
        <Fragment>
            <Menu.Item position="right" href="/dashboard/produk">
                <Icon name="arrow left" size="large" />
            </Menu.Item>
            <h3> 
                { editID ? 'Update ' : 'Tambah ' }Bahan Baku
            </h3>
            <Form style={{paddingBottom:'3rem'}} onSubmit={onSubmit}>
                <Form.Field>
                    <label>Nama Bahan</label>
                    <input 
                        type="text"
                        placeholder='Nama Bahan'
                        name="name"
                        value={name}
                        onChange={onChange}
                        required 
                    />
                </Form.Field>
                <Form.Field>
                    <label>Unit</label>
                    <input 
                        type="text"
                        placeholder='Unit Bahan' 
                        name="unit"
                        value={unit}
                        onChange={onChange}
                        required
                    />
                    <small>cth: meter, liter, atau botol</small>
                </Form.Field>
                <Button primary type='submit'>{ editID ? 'Update' : 'Tambah' }</Button>
            </Form>
        </Fragment>
    )
};

CreateMaterial.propTypes = {
    createMaterial: PropTypes.func.isRequired,
    getMaterial: PropTypes.func.isRequired,
    material: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    material: state.material
});

export default connect(mapStateToProps, { createMaterial, getMaterial })(CreateMaterial);