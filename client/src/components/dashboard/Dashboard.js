import React, { Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import PrivateRoute from '../routing/PrivateRoute';

import Sidebar from './Sidebar';
import Transaksi from './Transaksi';
import Produk from './Produk';
import CreateItem from '../items/CreateItem';
import Pelanggan from './Pelanggan';
import CreateCustomer from '../customers/CreateCustomer';
import CustomerInfo from '../customers/CustomerInfo';
import Pengrajin from './Pengrajin';
import CreateArtisan from '../artisans/CreateArtisan';
import ArtisanInfo from '../artisans/ArtisanInfo';
import BahanBaku from './BahanBaku';
import CreateMaterial from '../materials/CreateMaterial';
import ProgresProduk from './ProgresProduk';
import Action from '../progress/Action';
import Laporan from './Laporan';

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
                            <PrivateRoute path="/dashboard/pelanggan/info" component={CustomerInfo} />

                            <PrivateRoute exact path="/dashboard/pengrajin" component={Pengrajin} />
                            <PrivateRoute exact path="/dashboard/pengrajin/create-artisan" component={CreateArtisan} />
                            <PrivateRoute path="/dashboard/pengrajin/info" component={ArtisanInfo} />

                            <PrivateRoute exact path="/dashboard/bahan" component={BahanBaku} />
                            <PrivateRoute exact path="/dashboard/bahan/create-material" component={CreateMaterial} />

                            <PrivateRoute exact path="/dashboard/progres" component={ProgresProduk} />
                            <PrivateRoute exact path="/dashboard/progres/action" component={Action} />
                            
                            <PrivateRoute exact path="/dashboard/laporan" component={Laporan} />

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