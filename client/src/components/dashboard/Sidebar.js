import React, { useState, Fragment } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const [activeItem, setSctiveItem] = useState('transaksi');
    const onClick = (e, { name }) => {
        setSctiveItem(name);
    }

    return (
        <Fragment>
            <Menu.Item header as={Link} to='/dashboard' style={{color:'black'}}><b>Dashboard</b></Menu.Item>
            <Menu secondary vertical>
                <Menu.Item
                    name='transaksi'
                    active={activeItem === 'transaksi'}
                    onClick={onClick}
                    as={Link} to='/dashboard/transaksi'
                />
                <Menu.Item
                    name='pelanggan'
                    active={activeItem === 'pelanggan'}
                    onClick={onClick}
                    as={Link} to='/dashboard/pelanggan'
                />
                <Menu.Item
                    name='produk'
                    active={activeItem === 'produk'}
                    onClick={onClick}
                    as={Link} to='/dashboard/produk'
                />
                <Menu.Item
                    name='bahan-baku'
                    active={activeItem === 'bahan-baku'}
                    onClick={onClick}
                    as={Link} to='/dashboard/bahan-baku'
                />
            </Menu>
        </Fragment>
    )
}

export default Sidebar;