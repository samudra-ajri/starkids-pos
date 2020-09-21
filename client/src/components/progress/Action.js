import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Icon, Table, Menu, Button } from 'semantic-ui-react';
import Moment from 'react-moment';

import { patchDebt } from '../../actions/artisans'
import { patchQuantity } from '../../actions/items'
import { createArtisanTransaction, getArtisanTransaction } from '../../actions/artisantransactions';

const initialState = {
    status: 'On Progress',
    item: '',
    artisan: '',
    qty_order: 0,
    qty_finish: 0,
    order_date: '',
    finish_date: '',
    materials:[],

    action: 'Selesai', 
    repayment_type: 'barang', 
    unit: 'kodi', 
    addquantity: 0, 
    qty_repayment: 0, 
    qty_debt: 0, 
    debt: 0,
    description: ''
}

const Artisan = ({ 
    createArtisanTransaction, 
    getArtisanTransaction,
    history,
    patchQuantity,
    patchDebt,  
    artisantransaction:{transaction, editID, loading} 
}) => {
    const [ formData, setFormData ] = useState(initialState);

    let {
        status, item, artisan, qty_order, qty_finish, order_date, finish_date, materials,
        action, repayment_type, unit, addquantity, qty_repayment, qty_debt, debt, description
    } = formData;

    if (status === 'Pelunasan') action = 'Pelunasan';

    useEffect(() => {
        if (!transaction) getArtisanTransaction(editID);
        if (!loading && transaction) {
            const profileData = { ...initialState };
            for (const key in transaction) {
                if (key in profileData) profileData[key] = transaction[key];
            }
            setFormData(profileData);
        }
    }, [loading, getArtisanTransaction, editID, transaction, artisan, item]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    if (transaction && action === 'Pelunasan') {
        if (unit === 'kodi') {
            qty_repayment = addquantity * 20;
            qty_debt = (qty_order-qty_finish-qty_repayment)/20;
            debt = qty_debt * transaction.item.price.wholesale;
        } else {
            qty_repayment = addquantity * 1;
            qty_debt = (qty_order-qty_finish-qty_repayment);
            debt = qty_debt/20 * transaction.item.price.wholesale;
        }
    }

    const onSubmit = async e => {
        e.preventDefault();
        if (action === 'Selesai') {
            formData.qty_finish = formData.qty_order;
            patchQuantity({ 'quantity': item.quantity + formData.qty_finish }, item._id);
        } else {
            formData.qty_finish = qty_finish + qty_repayment;
            if (status === 'On Progress') {
                patchDebt({ 'debt': artisan.debt + debt }, artisan._id);
                formData.balance = artisan.debt + debt;
                formData.total = debt;
                formData.status_dsl = 'credit';
            } else if (status === 'Pelunasan') {
                patchDebt({ 'debt': artisan.debt - (qty_repayment/20 * item.price.wholesale) }, artisan._id);
                formData.balance = artisan.debt - (qty_repayment/20 * item.price.wholesale);
                formData.total = (qty_repayment/20 * item.price.wholesale);
                formData.status_dsl = 'debit';
            }
            
            if (repayment_type === 'barang') patchQuantity({ 'quantity': item.quantity + qty_repayment }, item._id);
        }
        
        if (qty_order === formData.qty_finish) {
            formData.status = 'Selesai';
        } else {
            formData.status = 'Pelunasan';
        }
        
        formData.artisan = artisan._id;
        formData.item = item._id;
        formData.finish_date = Date.now();
        createArtisanTransaction(formData, history, editID);
    }

    const renderColor = text => {
        let color='';
        if (text === 'On Progress') {
            color = 'orange';
        } else if (text === 'Selesai') {
            color = 'green';
        } else {
            color = 'red';
        }

        return (
            <b style={{ color: color }}>{text}</b>
        );
    }

    const renderMaterial = (material) => {
        return (
            <Table.Body key={material._id}>
                <Table.Row>
                    <Table.Cell>{material.material.name}</Table.Cell>
                    <Table.Cell>{material.material.unit}</Table.Cell>
                    <Table.Cell>{material.qty}</Table.Cell>
                </Table.Row>
            </Table.Body>
        );
    }

    return ( 
        <Fragment>
            <Menu.Item position="right" href="/dashboard/progres">
                <Icon name="arrow left" size="large" />
            </Menu.Item>
            <h3>Progres Produk</h3> <br/>
            <Form>
                <Table basic='very' compact collapsing>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell><strong>Status</strong></Table.Cell>
                            <Table.Cell>{renderColor(status)}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><strong>Produk</strong></Table.Cell>
                            <Table.Cell>{item.name}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><strong>Pengrajin</strong></Table.Cell>
                            <Table.Cell>{artisan.name}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><strong>Jumlah Order</strong></Table.Cell>
                            <Table.Cell>{qty_order/20} kodi</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><strong>Jumlah Diselesaikan</strong></Table.Cell>
                            <Table.Cell> {qty_finish/20} kodi</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><strong>Tgl Pengerjaan</strong></Table.Cell>
                            <Table.Cell>{ order_date && <Moment format="DD-MM-YYYY">{order_date}</Moment>}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><strong>Tgl Selesai</strong></Table.Cell>
                            <Table.Cell>{ finish_date ? <Moment format="DD-MM-YYYY">{finish_date}</Moment> : '-' }</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>

                <hr style={{color:'#F2F2F2'}}/>
                {materials.length !== 0 &&
                    <Table basic='very' compact >
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Bahan Baku</Table.HeaderCell>
                                <Table.HeaderCell>Unit</Table.HeaderCell>
                                <Table.HeaderCell>Jumlah</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        {materials.map((material) => (renderMaterial(material)))}
                    </Table>
                }
                <hr style={{color:'#F2F2F2'}}/>
            </Form>
            {status !== 'Selesai' &&
            <Form style={{paddingBottom:'3rem'}} onSubmit={onSubmit}>
                <Form.Field style={{marginTop:'1rem'}}>
                    <label>Tindakan</label>
                    <select
                        name="action"
                        onChange={onChange}
                        required
                    >
                        {status !== 'Pelunasan' && <option value='Selesai'>selesai</option>}
                        <option value='Pelunasan'>pelunasan</option>
                    </select>
                </Form.Field>
                {action === 'Pelunasan' &&
                    <Fragment>
                    <Form.Field>
                            <label>Tipe Pelunasan:</label>
                            <Form.Group>
                                <Form.Field
                                    type='radio'
                                    name='repayment_type'
                                    label='Barang'
                                    value='barang'
                                    control='input'
                                    onChange={onChange}
                                />
                                <Form.Field
                                    type='radio'
                                    name='repayment_type'
                                    label='Uang'
                                    value='Rp'
                                    control='input'
                                    onChange={onChange}
                                    required={action === 'Pelunasan' ? true : false}
                                />
                            </Form.Group>
                        </Form.Field>
                        <Form.Field>
                            <label>Pelunasan dalam:</label>
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
                                    required={action === 'Pelunasan' ? true : false}
                                />
                            </Form.Group>
                        </Form.Field>
                        <Form.Field>
                            <label>Jumlah Pelunasan ({unit})</label>
                            <input 
                                type="number"
                                placeholder='Jumlah Diselesaikan'
                                name="addquantity"
                                value={addquantity}
                                min = "0"
                                max = {unit === 'kodi' ? (qty_order-qty_finish)/20 : (qty_order-qty_finish) }
                                onChange={onChange}
                                required={action === 'Pelunasan' ? true : false}
                            />
                        </Form.Field>
                        <hr style={{color:'#F2F2F2'}}/>
                        <br/>
                        <Form.Field>
                            <label>Sisa Piutang Produk ({unit})</label>
                            <input 
                                type="number"
                                name="qty_debt"
                                value={qty_debt}
                                onChange={onChange}
                                disabled
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Sisa Piutang Produk (Rp)</label>
                            <input 
                                type="number"
                                name="debt"
                                value={debt}
                                onChange={onChange}
                                disabled
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Uraian Transaksi</label>
                            <input 
                                type="text"
                                placeholder='Uraian Transaksi' 
                                name="description"
                                value={description}
                                onChange={onChange}
                                required
                            />
                        </Form.Field>
                    </Fragment>
                }
                <div>
                    <Button primary type='submit'>Submit</Button>
                </div>
            </Form>
            }
        </Fragment>
    )
};

Artisan.propTypes = {
    artisantransaction: PropTypes.object.isRequired,
    getArtisanTransaction: PropTypes.func.isRequired,
    createArtisanTransaction: PropTypes.func.isRequired,
    patchQuantity: PropTypes.func.isRequired,
    patchDebt: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    artisantransaction: state.artisantransaction,
});

export default connect(mapStateToProps, { 
    createArtisanTransaction, 
    getArtisanTransaction, 
    patchQuantity,
    patchDebt 
})(Artisan);
