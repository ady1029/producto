import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import classes from './ToolBar.css';
import { NavLink } from 'react-router-dom';
import { Button, Collapse, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@material-ui/core';
import { Fingerprint, ExitToApp, Home, ListAltOutlined, TableChart, ExpandLess, ExpandMore, } from '@material-ui/icons';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import { useAuth } from 'oidc-react';
import Modal from './../../components/Modal/Modal.tsx'

import * as ISRequest from '../../service/actions/ISRequest';
import CheckCert from '../../views/Main/CheckCert';

function HideOnScroll(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({ target: window ? window() : undefined });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
};


export default function ToolBar(props) {

    const auth = useAuth();

    const [[anchorElHome, anchorElReport, anchorElNom], setAnchorEl] = React.useState([null, null, null]);
    const openHome = Boolean(anchorElHome);
    const openReport = Boolean(anchorElReport);
    const openNom = Boolean(anchorElNom);

    const handleMenuHome = (event) => {
        setAnchorEl([event.currentTarget, anchorElReport, anchorElNom]);
    };

    const handleCloseHome = () => {
        setAnchorEl([null, anchorElReport, anchorElNom]);
    };

    const handleMenuReport = (event) => {
        setAnchorEl([anchorElHome, event.currentTarget, anchorElNom]);
    };

    const handleCloseReport = () => {
        setAnchorEl([anchorElHome, null, anchorElNom]);
    };

    const handleMenuNom = (event) => {
        setAnchorEl([anchorElHome, anchorElReport, event.currentTarget]);
    };

    const handleCloseNom = () => {
        setAnchorEl([anchorElHome, anchorElReport, null]);
    };

    const [openDrawer, setOpenDrawer] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpenDrawer(true);
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
    };

    const [openHomeList, setOpenHomeList] = React.useState(false);
    const [openReportList, setOpenReportList] = React.useState(false);

    const handleOpenHomeList = () => {
        setOpenHomeList(!openHomeList);
    };

    const handleOpenReportList = () => {
        setOpenReportList(!openReportList);
    };

    let modelIS = null

    const signIn = () => {
        ISRequest.getOpenIDConfiguration()
        .then(() => {
            auth.signIn();
        })
        .catch((error) => {
            modelIS.handleOpen({  })
        });
    }

    return (
        <div>
            <Modal
                ref={el => {
                    modelIS = el;
                }}
                title="Acepte el certificado de seguridad del servidor de identidad"
                view={CheckCert}
                data={{}}
                setChange={(data) => { }}
            />
            <HideOnScroll {...props}>
                <AppBar color="primary">
                    <Toolbar variant="dense">

                        <Typography variant="h5" className={classes.logo}>
                            <NavLink className={classes.headerText} to="/" >Producto-Recurso</NavLink>
                        </Typography>
                        <div className={classes.desktopToolbar}>
                            {auth && auth.userData ?
                                <Fragment>
                                    <Button variant='text' color="inherit" onClick={handleMenuHome} startIcon={<Home />}>
                                        <Typography variant="subtitle1" >Inicio</Typography>
                                    </Button>

                                    <Button variant='text' color="inherit" onClick={handleMenuReport} startIcon={<TableChart />}>
                                        <Typography variant="subtitle1" >Reportes</Typography>
                                    </Button>

                                    <Button variant='text' color="inherit" onClick={handleMenuNom} startIcon={<ListAltOutlined />}>
                                        <Typography variant="subtitle1" >Nomencladores</Typography>
                                    </Button>
                                    <Button variant='text' color="inherit" onClick={() => {
                                        auth.signOutRedirect();
                                    }} >
                                        <Typography variant="subtitle1" >Salir ({auth.userData?.profile?.sub})</Typography>
                                    </Button>
                                </Fragment>
                                :
                                <Fragment>
                                    <Button variant='text' color="inherit" onClick={signIn} startIcon={<Fingerprint />}>
                                        <Typography variant="subtitle1" >Iniciar sesión</Typography>
                                    </Button>
                                </Fragment>
                            }
                        </div>
                        <div className={classes.mobileToolbar}>
                            {auth && auth.userData ?
                                <IconButton
                                    color="inherit"
                                    aria-label="Menú"
                                    edge="end"
                                    onClick={handleDrawerOpen}
                                // className={clsx(openDrawer && classes.hide)}
                                >
                                    <MenuIcon />
                                </IconButton>
                                :
                                <Fragment>
                                    <Button variant='text' color="inherit" onClick={signIn} startIcon={<Fingerprint />}>
                                        <Typography variant="subtitle1" >Iniciar sesión</Typography>
                                    </Button>
                                </Fragment>
                            }
                        </div>


                        <Menu
                            id="menu-home"
                            anchorEl={anchorElHome}
                            getContentAnchorEl={null}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            keepMounted
                            open={openHome}
                            onClose={handleCloseHome}
                        >
                            <MenuItem onClick={handleCloseHome}>
                                <NavLink className={classes.itemMenu} to="/product_family" exact activeStyle={{ color: '#007E9E' }}>Familias de Productos</NavLink>
                            </MenuItem>
                            <MenuItem onClick={handleCloseHome}>
                                <NavLink className={classes.itemMenu} to="/production_plan" exact activeStyle={{ color: '#007E9E' }}>Plan de producción</NavLink>
                            </MenuItem>
                            <MenuItem onClick={handleCloseHome}>
                                <NavLink className={classes.itemMenu} to="/resource_family" exact activeStyle={{ color: '#007E9E' }}>Familias de Recursos</NavLink>
                            </MenuItem>
                            <MenuItem onClick={handleCloseHome}>
                                <NavLink className={classes.itemMenu} to="/relation" exact activeStyle={{ color: '#007E9E' }}>Relaciones de Productos</NavLink>
                            </MenuItem>
                        </Menu>
                        <Menu
                            id="menu-report"
                            anchorEl={anchorElReport}
                            getContentAnchorEl={null}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            keepMounted
                            open={openReport}
                            onClose={handleCloseReport}
                        >
                            <MenuItem onClick={handleCloseReport}>
                                <NavLink className={classes.itemMenu} to="/report/resources_by_product" exact activeStyle={{ color: '#007E9E' }}>Recursos por producto</NavLink>
                            </MenuItem>
                            <MenuItem onClick={handleCloseReport}>
                                <NavLink className={classes.itemMenu} to="/report/products_by_resource" exact activeStyle={{ color: '#007E9E' }}>Productos por recurso</NavLink>
                            </MenuItem>
                        </Menu>
                        <Menu
                            id="menu-nomenclador"
                            anchorEl={anchorElNom}
                            getContentAnchorEl={null}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            keepMounted
                            open={openNom}
                            onClose={handleCloseNom}
                        >
                            <MenuItem onClick={handleCloseNom}>
                                <NavLink className={classes.itemMenu} to="/resource_type" exact activeStyle={{ color: '#007E9E' }}>Tipos de recursos</NavLink>
                            </MenuItem>
                        </Menu>

                    </Toolbar>
                </AppBar>


            </HideOnScroll>
            <Toolbar />


            <Drawer
                className={classes.drawer}
                variant="temporary"
                anchor="right"
                open={openDrawer}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronRightIcon />
                    </IconButton>
                </div>
                <Divider />
                <ListItem button onClick={handleOpenHomeList}>
                    <ListItemIcon>
                        <Home />
                    </ListItemIcon>
                    <ListItemText primary="Inicio" />
                    {openHomeList ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openHomeList} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem button className={classes.nested} onClick={handleDrawerClose}>
                            <ListItemIcon>
                            </ListItemIcon>
                            <NavLink className={classes.itemMenu} to="/product_family" exact activeStyle={{ display: '#007E9E' }}>Familias de Productos</NavLink>
                        </ListItem>
                        <ListItem button className={classes.nested} onClick={handleDrawerClose}>
                            <ListItemIcon>
                            </ListItemIcon>
                            <NavLink className={classes.itemMenu} to="/production_plan" exact activeStyle={{ display: '#007E9E' }}>Plan de producción</NavLink>
                        </ListItem>
                        <ListItem button className={classes.nested} onClick={handleDrawerClose}>
                            <ListItemIcon>
                            </ListItemIcon>
                            <NavLink className={classes.itemMenu} to="/resource_family" exact activeStyle={{ color: '#007E9E' }}>Familias de Recursos</NavLink>
                        </ListItem>
                        <ListItem button className={classes.nested} onClick={handleDrawerClose}>
                            <ListItemIcon>
                            </ListItemIcon>
                            <NavLink className={classes.itemMenu} to="/relation" exact activeStyle={{ color: '#007E9E' }}>Relaciones de Productos</NavLink>
                        </ListItem>
                    </List>
                </Collapse>
                <ListItem button onClick={handleOpenReportList}>
                    <ListItemIcon>
                        <TableChart />
                    </ListItemIcon>
                    <ListItemText primary="Reportes" />
                    {openReportList ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openReportList} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem button className={classes.nested} onClick={handleDrawerClose}>
                            <ListItemIcon>
                            </ListItemIcon>
                            <NavLink className={classes.itemMenu} to="/report/resources_by_product" exact activeStyle={{ color: '#007E9E' }}>Recursos por producto</NavLink>
                        </ListItem>
                        <ListItem button className={classes.nested} onClick={handleDrawerClose}>
                            <ListItemIcon>
                            </ListItemIcon>
                            <NavLink className={classes.itemMenu} to="/report/products_by_resource" exact activeStyle={{ color: '#007E9E' }}>Productos por recurso</NavLink>
                        </ListItem>
                    </List>
                </Collapse>
                <ListItem button onClick={handleDrawerClose}>
                    <ListItemIcon>
                        <ListAltOutlined />
                    </ListItemIcon>
                    {/* <ListItemText primary="Nomencladores" /> */}
                    <NavLink className={classes.itemMenu} to="/resource_type" exact activeStyle={{ color: '#007E9E' }}>Tipos de recursos</NavLink>
                </ListItem>
                <ListItem button onClick={handleDrawerClose}>
                    <ListItemIcon>
                        <ExitToApp />
                    </ListItemIcon>
                    <Button variant='text' color="inherit" onClick={() => {
                        auth.signOutRedirect();
                    }} style={{ marginLeft: -14 }} >
                        <Typography variant="subtitle1" >Salir ({auth.userData?.profile?.sub})</Typography>
                    </Button>
                </ListItem>

            </Drawer>



        </div>

    );
}
