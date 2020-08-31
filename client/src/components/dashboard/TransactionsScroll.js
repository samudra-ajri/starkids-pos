import api from '../../utils/api';
import React, { Component } from 'react';
import { Table, Dropdown } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Moment from 'react-moment';

export class Transactions extends Component {
  state = {
    transactions: [],
    page: 1
  };

  componentDidMount() {
    const { page } = this.state;
    api
    .get(`/transactions?from=${this.props.from}&to=${this.props.to}&page=${page}&pagination=10`)
    .then(res => this.setState({ transactions: res.data }));
  }
  
  fetchTransactions = () => {
    this.setState({ page: this.state.page + 1 });
    const { page } = this.state;
    api
    .get(`/transactions?from=${this.props.from}&to=${this.props.to}&page=${page}&pagination=10`)
    .then(res => {
      this.setState({ transactions: this.state.transactions.concat(res.data) });
    });
  };
  

  renderTransaction = transaction => {
    return (
      <Table.Body key={transaction._id}>
          <Table.Row>
              <Table.Cell><Moment format="DD-MM-YYYY">{transaction.date}</Moment></Table.Cell>
              <Table.Cell>{transaction.customer.name}</Table.Cell>
              <Table.Cell>{transaction.stuff.length === 0 ? transaction.total : 
                  <Dropdown text={transaction.total.toString()} floating>
                      <Dropdown.Menu>
                          {transaction.stuff.map(product => {
                              if (product.price_type === 'retail') {
                                  return <Dropdown.Item key={product._id} description={product.qty+' pcs'} text={product.item.name} />
                              }
                              return <Dropdown.Item key={product._id} description={product.qty+' kodi'} text={product.item.name} />
                          })}
                      </Dropdown.Menu>
                  </Dropdown>
              }</Table.Cell>
              <Table.Cell>{transaction.payment_type}</Table.Cell>
          </Table.Row>
      </Table.Body>
    );
  }
    
  render() {
    return (
      <div>
        {console.log(this.props.from)}
        <InfiniteScroll
          dataLength={this.state.transactions.length}
          next={this.fetchTransactions}
          hasMore={true}
        >
          <Table basic='very' compact>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Tanggal</Table.HeaderCell>
                    <Table.HeaderCell>Pelanggan</Table.HeaderCell>
                    <Table.HeaderCell>Total</Table.HeaderCell>
                    <Table.HeaderCell>Jenis</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            {this.state.transactions.map(transaction => (this.renderTransaction(transaction)))}
          </Table>
        </InfiniteScroll>
      </div>
    );
  }
}

export default Transactions;