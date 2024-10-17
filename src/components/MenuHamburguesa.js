import React, { useState } from 'react';
import { Drawer, Button, Menu } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

function MenuHamburguesa() {
    const [visible, setVisible] = useState(false);

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    return (
        <>
            <Button type="primary" onClick={showDrawer} icon={<MenuOutlined />} style={{ marginBottom: 16, position: 'absolute', top: 20, left: 20 }}>
                Menú
            </Button>
            <Drawer title="Menú Principal" placement="left" onClose={onClose} visible={visible}>
                <Menu mode="vertical">
                    <Menu.Item key="home">
                        <Link to="/">Inicio</Link>
                    </Menu.Item>
                    {/* Agrega aquí otros enlaces según sea necesario */}
                </Menu>
            </Drawer>
        </>
    );
}

export default MenuHamburguesa;
