import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Form, Icon, Container, Table } from 'semantic-ui-react';

import { getArtisans } from '../../actions/artisans';
import { getItems } from '../../actions/items';
import { patchQuantity } from '../../actions/materials';
import { cleanBasket, createArtisanTransaction } from '../../actions/artisantransactions';

const initialState = {
    artisan: '',
    item: '',
    unit: 'kodi',
    addquantity: 0,
    qty_order: 0,
    status: 'On Progress',
}

const Artisan = ({ basket, artisans, items, getArtisans, cleanBasket, createArtisanTransaction, getItems, patchQuantity, history }) => {

    useEffect(() => {
        getArtisans();
        getItems();
    }, [getArtisans, getItems]);

    const [ formData, setFormData ] = useState(initialState);
    let { unit, addquantity, qty_order } = formData;

    if (unit === 'kodi') {
        qty_order += addquantity * 20; 
    } else {
        qty_order += addquantity * 1;
    }

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const initQtyMaterials = {};
    basket.forEach(material => {
        initQtyMaterials[material._id] = 1;
    });

    const [ qtyMaterial, setQtyMaterial ] = useState(initQtyMaterials);

    const onChangeMaterial = (e) => {
        setQtyMaterial({ ...qtyMaterial, [e.target.name]: e.target.value });
    }

    const onClick = (e, {id}) => {
        cleanBasket(basket, id);
        delete qtyMaterial[id];
    }

    const onSubmit = async e => {
        e.preventDefault();

        const materials = [];
        for (const id in qtyMaterial) {
            materials.push({ 'qty': qtyMaterial[id], 'material': id });
        }

        formData.qty_order = qty_order; 
        formData.materials = materials;

        createArtisanTransaction(formData, history, '');

        basket.forEach(material => {
            patchQuantity( {'quantity': material.quantity - qtyMaterial[material._id]}, material._id);
        });
    }

    const renderMaterial = (material) => {
        return (
            <Table.Body key={material._id}>
                <Table.Row>
                    <Table.Cell>{material.name}</Table.Cell>
                    <Table.Cell>{material.unit}</Table.Cell>
                    <Table.Cell>
                        <Form.Field>
                            <input 
                                type="number"
                                placeholder='qty'
                                name={material._id}
                                value={qtyMaterial[material._id]}
                                min="1"
                                max={material.quantity}
                                onChange={onChangeMaterial}
                                required
                            />
                        </Form.Field>
                    </Table.Cell>
                    <Table.Cell>
                        <Button icon style={{backgroundColor:'transparent', padding:'0px'}} id={material._id} onClick={onClick}>
                            <Icon name='x' size='small' />
                        </Button>
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
        );
    }

    return ( 
        <Fragment>
            <Container style={{marginTop: '0rem'}}>
            <h1>Transaksi Pengrajin</h1> <br/>
            {basket.length !== 0 &&
                <Table basic='very' compact>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Bahan</Table.HeaderCell>
                            <Table.HeaderCell>Unit</Table.HeaderCell>
                            <Table.HeaderCell width={3}>Jumlah</Table.HeaderCell>
                            <Table.HeaderCell width={1}></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    {basket.map((material) => (renderMaterial(material)))}
                </Table>
            }
            <br/>
            <Form style={{paddingBottom:'3rem'}} onSubmit={onSubmit}>
                <Form.Field style={{marginTop:'1rem'}}>
                    <label>Pengrajin</label>
                    <select
                        name="artisan"
                        onChange={onChange}
                        required
                    >
                        <option value=''>--pilih pengrajin--</option>
                        {artisans.map((artisan) => { 
                            return <option key={artisan._id} value={artisan._id}>{artisan.name}</option>
                        })}
                    </select>
                </Form.Field>
                <Form.Field style={{marginTop:'1rem'}}>
                    <label>Produk</label>
                    <select
                        name="item"
                        onChange={onChange}
                        required
                    >
                        <option value=''>--produk yang dikerjakan--</option>
                        {items.map(item => { 
                            return <option key={item._id} value={item._id}>{item.name}</option>
                        })}
                    </select>
                </Form.Field>
                <Form.Field>
                    <label>Order dalam:</label>
                    <Form.Group>
                        <Form.Field
                            type='radio'
                            name='unit'
                            label='Kodi'
                            value='kodi'
                            control='input'
                            onChange={onChange}
                        />
                        <Form.Field
                            type='radio'
                            name='unit'
                            label='Satuan'
                            value='satuan'
                            control='input'
                            onChange={onChange}
                            required
                        />
                    </Form.Group>
                </Form.Field>
                <Form.Field>
                    <label>Jumlah Order ({unit})</label>
                    <input 
                        type="number"
                        placeholder='Jumlah Order'
                        name="addquantity"
                        value={addquantity}
                        onChange={onChange}
                        required
                    />
                </Form.Field>
                <div>
                    <Button as={Link} to='/materials'>Kembali</Button>
                    <Button primary type='submit'>Submit</Button>
                </div>
            </Form>
            </Container>
        </Fragment>
    )
};

Artisan.propTypes = {
    basket: PropTypes.array.isRequired,
    artisans: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    getArtisans: PropTypes.func.isRequired,
    cleanBasket: PropTypes.func.isRequired,
    createArtisanTransaction: PropTypes.func.isRequired,
    patchQuantity: PropTypes.func.isRequired,
    getItems: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    basket: state.artisantransaction.transactions,
    artisans: state.artisan.artisans,
    items: state.item.items
});

export default connect(mapStateToProps, { getArtisans, cleanBasket, createArtisanTransaction, getItems, patchQuantity })(Artisan);
