import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Table} from 'semantic-ui-react';
import NumberFormat from 'react-number-format';

import { getDSLs } from '../../actions/debtsubsidiaryledgers';

const DebtBook = ({ getDSLs, debtor, from, to, dsls:{transactions} }) => {

    useEffect(() => {
        if (debtor) getDSLs(from, to, debtor._id);
    }, [getDSLs, debtor, from, to]);

    const renderDSL = transaction => {
        return (
            <Table.Body key={transaction._id}>
                <Table.Row>
                    <Table.Cell><Moment format="DD-MM-YYYY">{transaction.date}</Moment></Table.Cell>
                    <Table.Cell>{transaction.description}</Table.Cell>
                    <Table.Cell><NumberFormat value={transaction.debit !== 0 ? transaction.debit : '-'} displayType={'text'} thousandSeparator={true}/></Table.Cell>
                    <Table.Cell><NumberFormat value={transaction.credit !== 0 ? transaction.credit : '-'} displayType={'text'} thousandSeparator={true}/></Table.Cell>
                    <Table.Cell><NumberFormat value={transaction.balance} displayType={'text'} thousandSeparator={true}/></Table.Cell>
                </Table.Row>
            </Table.Body>
        );
    }

    return (
        <Fragment>
            {transactions.length === 0 ? <p>Tidak ada hutang tercatat.</p> : (
                <Fragment>
                    <Table basic='very' compact>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Tanggal</Table.HeaderCell>
                                <Table.HeaderCell>Uraian Transaksi</Table.HeaderCell>
                                <Table.HeaderCell>Debet (Rp)</Table.HeaderCell>
                                <Table.HeaderCell>Kredit (Rp)</Table.HeaderCell>
                                <Table.HeaderCell>Saldo (Rp)</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        {transactions.map(transaction => (renderDSL(transaction)))}
                    </Table>
                </Fragment>
            )}
            {!from || !to ? <p>Silakan input periode terlebih dahulu.</p> : <p></p>}
        </Fragment>
    );
};

DebtBook.propTypes = {
    dsls: PropTypes.object.isRequired,
    getDSLs: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    dsls: state.debtsubsidiaryledgers
});

export default connect(mapStateToProps, { getDSLs })(DebtBook);