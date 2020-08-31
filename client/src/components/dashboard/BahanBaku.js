import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Button, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

import Spinner from '../layout/Spinner';
import { getMaterials, getMaterialEditID } from '../../actions/materials';
import material from '../../reducers/material';


const BahanBaku = ({ getMaterials, getMaterialEditID, materials: {loading, materials}}) => {

    useEffect(() => {
        getMaterials();
    }, [getMaterials]);


    const onClick = (e, {id}) => {
        getMaterialEditID(id);
    };


    const renderMaterial = material => {
        return (
            <Table.Body key={material._id}>
                <Table.Row>
                    <Table.Cell>{material.name}</Table.Cell>
                    <Table.Cell>{material.unit}</Table.Cell>
                    <Table.Cell>{material.quantity}</Table.Cell>
                    <Table.Cell><Moment format="DD-MM-YYYY HH:mm">{material.date}</Moment></Table.Cell>
                    <Table.Cell>
                        <Button as={Link} to='/dashboard/produk/create-material' icon style={{backgroundColor:'transparent', padding:'0px'}} id={material._id} onClick={onClick}>
                            <Icon name='edit outline' size='large' />
                        </Button>
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
        );
    }

    return (
        <Fragment>
            <h3 style={{flexGrow:'0'}}>Daftar Bahan Baku</h3>
            <div>
                <Button as={Link} to='/dashboard/produk/create-material' icon labelPosition='left' color='twitter'>
                    <Icon name='box' /> Tambah Bahan Baku
                </Button>
                <br/><br/>
                {loading ? <Spinner /> : (
                    <Fragment>
                        <Table basic='very' compact>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Bahan</Table.HeaderCell>
                                    <Table.HeaderCell>Unit</Table.HeaderCell>
                                    <Table.HeaderCell>Stok</Table.HeaderCell>
                                    <Table.HeaderCell>Terakhir Update</Table.HeaderCell>
                                    <Table.HeaderCell></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            {materials.map(material => (rendermaterial(item)))}
                        </Table>
                    </Fragment>
                )}
            </div>
        </Fragment>
    );
};

BahanBaku.propTypes = {
    getMaterials: PropTypes.func.isRequired,
    getMaterialEditID: PropTypes.func.isRequired,
    materials: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    materials: state.material
});

export default connect(mapStateToProps, { getMaterials, getMaterialEditID })(BahanBaku);