import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Button, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import Spinner from '../layout/Spinner';
import { getArtisans, getEditID } from '../../actions/artisans';


const Pengrajin = ({ getArtisans, getEditID, artisans: {loading, artisans} }) => {

    useEffect(() => {
        getArtisans();
    }, [getArtisans]);

    const onClick = (e, {id}) => {
        getEditID(id);
    };


    const renderArtisan = artisan => {
        return (
            <Table.Body key={artisan._id}>
                <Table.Row>
                    <Table.Cell>{artisan.name}</Table.Cell>
                    <Table.Cell>{artisan.email}</Table.Cell>
                    <Table.Cell>{artisan.address}</Table.Cell>
                    <Table.Cell>{artisan.phone}</Table.Cell>
                    <Table.Cell>{artisan.debt}</Table.Cell>
                    <Table.Cell textAlign='center'>
                        <Button as={Link} to='/dashboard/pengrajin/create-artisan' icon style={{backgroundColor:'transparent', padding:'0px'}} id={artisan._id} onClick={onClick}>
                            <Icon name='edit outline' size='large' />
                        </Button>
                        <Button as={Link} to='/dashboard/pengrajin/info' icon style={{backgroundColor:'transparent', padding:'0px'}} id={artisan._id} onClick={onClick}>
                            <Icon name='arrow right' size='large' color='teal' />
                        </Button>
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
        );
    }

    return (
        <Fragment>
            <h3 style={{flexGrow:'0'}}>Daftar Pengrajin</h3>
            <div>
                <Button as={Link} to='/dashboard/pengrajin/create-artisan' icon labelPosition='left' color='twitter'>
                    <Icon name='user plus' /> Tambah Pengrajin
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
                                    <Table.HeaderCell>Piutang</Table.HeaderCell>
                                    <Table.HeaderCell>Edit/Info</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            { artisans.map(artisan => ( renderArtisan(artisan) )) }
                        </Table>
                    </Fragment>
                )}
            </div>
        </Fragment>
    );
};

Pengrajin.propTypes = {
    getArtisans: PropTypes.func.isRequired,
    getEditID: PropTypes.func.isRequired,
    artisans: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    artisans: state.artisan
});

export default connect(mapStateToProps, { getArtisans, getEditID })(Pengrajin);