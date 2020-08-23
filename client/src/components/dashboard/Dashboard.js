import React, { Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import PrivateRoute from '../routing/PrivateRoute';

import Sidebar from './Sidebar';
import Transaksi from './Transaksi';
import Produk from './Produk';
import Pelanggan from './Pelanggan';
import Gudang from './Gudang';


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
                            <PrivateRoute exact path="/dashboard/pelanggan" component={Pelanggan} />
                            <PrivateRoute exact path="/dashboard/gudang" component={Gudang} />
                        </Switch>
                    </Grid.Column>
                </Grid>
                    
                </Fragment>
            </Router>
        </div>
    );
};

export default Dashboard;