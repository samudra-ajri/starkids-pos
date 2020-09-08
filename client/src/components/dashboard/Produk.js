import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Button, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

import Spinner from '../layout/Spinner';
import { getItems, getItemEditID } from '../../actions/items';


const Produk = ({ getItems, getItemEditID, items: {loading, items}}) => {

    useEffect(() => {
        getItems();
    }, [getItems]);

    const onClick = (e, {id}) => {
        getItemEditID(id);
    };

    const renderItem = item => {
        return (
            <Table.Body key={item._id}>
                <Table.Row>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{item.quantity}</Table.Cell>
                    <Table.Cell>{item.price.retail}</Table.Cell>
                    <Table.Cell>{item.price.wholesale}</Table.Cell>
                    <Table.Cell><Moment format="DD-MM-YYYY HH:mm">{item.date}</Moment></Table.Cell>
                    <Table.Cell>
                        <Button as={Link} to='/dashboard/produk/create-item' icon style={{backgroundColor:'transparent', padding:'0px'}} id={item._id} onClick={onClick}>
                            <Icon name='edit outline' size='large' />
                        </Button>
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
        );
    }

    return (
        <Fragment>
            <h3 style={{flexGrow:'0'}}>Daftar Produk</h3>
            <div>
                <Button as={Link} to='/dashboard/produk/create-item' icon labelPosition='left' color='twitter'>
                    <Icon name='box' /> Tambah Produk
                </Button>
                <br/><br/>
                {loading ? <Spinner /> : (
                    <Fragment>
                        <Table basic='very' compact>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Produk</Table.HeaderCell>
                                    <Table.HeaderCell>Stok</Table.HeaderCell>
                                    <Table.HeaderCell>Harga Eceran</Table.HeaderCell>
                                    <Table.HeaderCell>Harga Grosir</Table.HeaderCell>
                                    <Table.HeaderCell>Terakhir Update</Table.HeaderCell>
                                    <Table.HeaderCell>Edit</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            {items.map(item => (renderItem(item)))}
                        </Table>
                    </Fragment>
                )}
            </div>
        </Fragment>
    );
};

Produk.propTypes = {
    getItems: PropTypes.func.isRequired,
    getItemEditID: PropTypes.func.isRequired,
    items: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    items: state.item
});

export default connect(mapStateToProps, { getItems, getItemEditID })(Produk);