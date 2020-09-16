import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Button, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import NumberFormat from 'react-number-format';

import Spinner from '../layout/Spinner';
import { getCustomers, getEditID } from '../../actions/customers';


const Pelanggan = ({ getCustomers, getEditID, customers: {loading, customers}}) => {

    useEffect(() => {
        getCustomers();
    }, [getCustomers]);

    const onClick = (e, {id}) => {
        getEditID(id);
    };

    const renderCustomer = customer => {
        return (
            <Table.Body key={customer._id}>
                <Table.Row>
                    <Table.Cell>{customer.name}</Table.Cell>
                    <Table.Cell>{customer.email}</Table.Cell>
                    <Table.Cell>{customer.address}</Table.Cell>
                    <Table.Cell>{customer.phone}</Table.Cell>
                    <Table.Cell><NumberFormat value={customer.debt} displayType={'text'} thousandSeparator={true}/></Table.Cell>
                    <Table.Cell textAlign='center'>
                        <Button as={Link} to='/dashboard/pelanggan/create-customer' icon style={{backgroundColor:'transparent', padding:'0px'}} id={customer._id} onClick={onClick}>
                            <Icon name='edit outline' size='large' />
                        </Button>
                        <Button as={Link} to='/dashboard/pelanggan/info' icon style={{backgroundColor:'transparent', padding:'0px'}} id={customer._id} onClick={onClick}>
                            <Icon name='arrow right' size='large' color='teal' />
                        </Button>
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
        );
    }

    return (
        <Fragment>
            <h3 style={{flexGrow:'0'}}>Daftar Pelanggan</h3>
            <div>
                <Button as={Link} to='/dashboard/pelanggan/create-customer' icon labelPosition='left' color='twitter'>
                    <Icon name='user plus' /> Tambah Pelanggan
                </Button>
                <br/><br/>
                {loading ? <Spinner /> : (
                    <Fragment>
                        <Table basic='very' compact>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Nama</Table.HeaderCell>
                                    <Table.HeaderCell>Email</Table.HeaderCell>
                                    <Table.HeaderCell>Alamat</Table.HeaderCell>
                                    <Table.HeaderCell>Telp/HP</Table.HeaderCell>
                                    <Table.HeaderCell>Piutang (Rp)</Table.HeaderCell>
                                    <Table.HeaderCell>Edit/Info</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            {customers.map(customer => (renderCustomer(customer)))}
                        </Table>
                    </Fragment>
                )}
            </div>
        </Fragment>
    );
};

Pelanggan.propTypes = {
    getCustomers: PropTypes.func.isRequired,
    getEditID: PropTypes.func.isRequired,
    customers: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    customers: state.customer
});

export default connect(mapStateToProps, { getCustomers, getEditID })(Pelanggan);