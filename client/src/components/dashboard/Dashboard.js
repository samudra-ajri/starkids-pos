import React, { Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import PrivateRoute from '../routing/PrivateRoute';

import Sidebar from './Sidebar';
import Transaksi from './Transaksi';
import Produk from './Produk';
import Pelanggan from './Pelanggan';
import CreateItem from '../items/CreateItem';
import CreateCustomer from '../customers/CreateCustomer';
import CustomerInfo from '../customers/CustomerInfo';
import BahanBaku from './BahanBaku';
import CreateMaterial from '../materials/CreateMaterial';

import TransactionsScroll from './TransactionsScroll';



const Dashboard = () => {
    return (
        <div style={{marginTop:'-50px', marginLeft:'20px', width:'95%', position:'relative'}}>
            <Router>
                <Fragment>
                
                <Grid>
                    <Grid.Column  width={3}>
                        <Sidebar />
                    </Grid.Column>
            
                    <Grid.Column stretched width={13}>
                        <Switch>
                            <Route exact path="/dashboard" component={Transaksi} />
                            <PrivateRoute exact path="/dashboard/transaksi" component={Transaksi} />
                            
                            <PrivateRoute exact path="/dashboard/produk" component={Produk} />
                            <PrivateRoute exact path="/dashboard/produk/create-item" component={CreateItem} />

                            <PrivateRoute exact path="/dashboard/pelanggan" component={Pelanggan} />
                            <PrivateRoute exact path="/dashboard/pelanggan/create-customer" component={CreateCustomer} />
                            <PrivateRoute exact path="/dashboard/pelanggan/info" component={CustomerInfo} />

                            <PrivateRoute exact path="/dashboard/bahan-baku" component={BahanBaku} />
                            <PrivateRoute exact path="/dashboard/bahan-baku/create-material" component={CreateMaterial} />

                            <PrivateRoute exact path="/dashboard/transaksi-scroll" component={TransactionsScroll} />
                        </Switch>
                    </Grid.Column>
                </Grid>
                    
                </Fragment>
            </Router>
        </div>
    );
};

export default Dashboard;