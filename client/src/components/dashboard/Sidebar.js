import React, { useState, Fragment } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const [activeItem, setActiveItem] = useState('');
    const [dropDown, setDropDown] = useState('');
    const onClick = (e, { name }) => {
        setActiveItem(name);
    }
    const onClickMenu = (e, { name, className }) => {
        if (dropDown === className) {
            setDropDown('');
        } else {
            setDropDown(className);
        }
        if (name) setActiveItem(name);
    }

    return (
        <Fragment>
            <Menu.Item header as={Link} to='/dashboard' style={{color:'black'}}><b>Dashboard</b></Menu.Item>
            <Menu secondary vertical>
                <Menu.Item
                    className='transaksi'
                    name='transaksi'
                    active={activeItem === 'transaksi'}
                    onClick={onClickMenu}
                    as={Link} to='/dashboard/transaksi'
                ><b>Transaksi</b></Menu.Item>
                <Menu.Item className='partner' onClick={onClickMenu}><b>Mitra</b></Menu.Item>
                {dropDown === 'partner' && 
                    <div style={{paddingLeft:'5px'}}>
                        <Menu.Item
                        name='pengrajin'
                        active={activeItem === 'pengrajin'}
                        onClick={onClick}
                        as={Link} to='/dashboard/pengrajin'
                        />
                        <Menu.Item
                            name='pelanggan'
                            active={activeItem === 'pelanggan'}
                            onClick={onClick}
                            as={Link} to='/dashboard/pelanggan'
                        />
                    </div>
                }
                <Menu.Item className='gudang' onClick={onClickMenu}><b>Gudang</b></Menu.Item>
                {dropDown === 'gudang' &&
                    <div style={{paddingLeft:'5px'}}>
                        <Menu.Item
                            name='bahan'
                            active={activeItem === 'bahan'}
                            onClick={onClick}
                            as={Link} to='/dashboard/bahan'
                        />
                        <Menu.Item
                            name='produk'
                            active={activeItem === 'produk'}
                            onClick={onClick}
                            as={Link} to='/dashboard/produk'
                        />
                        <Menu.Item
                            name='progres-produk'
                            active={activeItem === 'progres-produk'}
                            onClick={onClick}
                            as={Link} to='/dashboard/progres'
                        />
                    </div>
                }
                <Menu.Item
                    className='report'
                    name='report'
                    active={activeItem === 'report'}
                    onClick={onClickMenu}
                    as={Link} to='/dashboard/laporan'
                ><b>Laporan</b></Menu.Item>
            </Menu>
        </Fragment>
    )
}

export default Sidebar;