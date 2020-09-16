import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Button, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import NumberFormat from 'react-number-format';

import Spinner from '../layout/Spinner';
import { getMaterials, getMaterialEditID } from '../../actions/materials';

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
                    <Table.Cell><NumberFormat value={material.price} displayType={'text'} thousandSeparator={true}/></Table.Cell>
                    <Table.Cell><Moment format="DD-MM-YYYY HH:mm">{material.date}</Moment></Table.Cell>
                    <Table.Cell>
                        <Button as={Link} to='/dashboard/bahan/create-material' icon style={{backgroundColor:'transparent', padding:'0px'}} id={material._id} onClick={onClick}>
                            <Icon name='edit outline' size='large' />
                        </Button>
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
        );
    }

    return (
        <Fragment>
            <h3 style={{flexGrow:'0'}}>Daftar Bahan</h3>
            <div>
                <Button as={Link} to='/dashboard/bahan/create-material' icon labelPosition='left' color='twitter'>
                    <Icon name='box' /> Tambah Bahan
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
                                    <Table.HeaderCell>Harga (Rp)</Table.HeaderCell>
                                    <Table.HeaderCell>Terakhir Update</Table.HeaderCell>
                                    <Table.HeaderCell>Edit</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            {materials.map(material => (renderMaterial(material)))}
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