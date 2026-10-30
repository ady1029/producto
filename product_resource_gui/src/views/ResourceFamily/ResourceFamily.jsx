import React from 'react'
import { useAlert } from 'react-alert'
import { useAuth } from 'oidc-react';

import DataTable from './../../components/DataTable/DataTable.tsx'
import { confirm } from '../../components/Confirm/Confirm'
import Modal from './../../components/Modal/Modal.tsx'
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.jsx'

import classes from './../../styles/Main.css'
import { tableIcons } from '../../styles/TableIcons'

import * as ResourceFamilyRequest from '../../service/actions/ResourceFamilyRequest'
import * as ResourceRequest from '../../service/actions/ResourceRequest'

import ResourceDetails from '../Resource/ResourceDetails';

const ResourceFamily = (props) => {

    let auth = useAuth();
    let isAdmin = auth.userData?.profile?.groups.some(g => g === "Internal/pr_admin");

    const alert = useAlert()

    const tableResourceFamilyRef = React.createRef()
    const tableResourceRef = React.createRef()

    let modelResourceDetails = null;

    const cellStyle = {
        padding: '8px',
    }

    let idResourceFamily = -1

    return (
        <div>
            <Modal
                ref={el => {
                    modelResourceDetails = el;
                }}
                title="Detalles del recurso"
                view={ResourceDetails}
                data={{
                }}
                setChange={(data) => {
                }}
            />
            <div className={classes.container}>
                <Breadcrumbs
                    links={[
                        { path: "/", name: "Inicio" }
                    ]}
                    name="Familia de recursos"
                />
                <div className={classes.TablePaddingTop}>
                    <DataTable
                        tableRef={tableResourceFamilyRef}
                        title="Familia de recursos"
                        columns={[
                            { title: "Empresa", field: "enterprise", cellStyle: cellStyle },
                            { title: "Nombre de la familia", field: "name", cellStyle: cellStyle },
                        ]}
                        data={(query) => {
                            return new Promise((resolve, reject) => {
                                ResourceFamilyRequest.getAllResourceFamily(query)
                                    .then((result) => {
                                        resolve({
                                            data: result.content,
                                            page: result.pageable.pageNumber,
                                            totalCount: result.totalElements
                                        })
                                    }).catch(error => {
                                        reject(error.message)
                                        alert.error(error.message)
                                    });
                            })
                        }}

                        options={{
                            exportButton: true,
                            selectRow: true,
                            filtering: true,
                            pageSize: 10,
                            rowStyle: rowData => ({
                                backgroundColor: rowData.id === idResourceFamily ? "#cacaca" : "#fff",
                            }),
                        }}
                        onRowClick={(event, rowData) => {
                            idResourceFamily = rowData.id
                            tableResourceFamilyRef.current.onQueryChange();
                            tableResourceRef.current.onQueryChange();
                        }}
                        actions={isAdmin ? [
                            {
                                icon: tableIcons.Add,
                                tooltip: 'Agregar',
                                isFreeAction: true,
                                onClick: (event) => {
                                    props.history.push({ pathname: '/resource_family/create' })
                                },
                            },
                            {
                                icon: tableIcons.Edit,
                                tooltip: 'Editar',
                                onClick: (event, rowData) => {
                                    props.history.push({ pathname: `/resource_family/update/${rowData.id}` })
                                },
                            },
                            {
                                icon: tableIcons.Delete,
                                tooltip: 'Eliminar',
                                onClick: async (event, rowData) => {
                                    if (await confirm({
                                        title: "Eliminar familia de recurso",
                                        confirmation: "¿Está seguro que desea eliminar la familia de recursos " + rowData.name + ", se eliminarán todos los recursos, relaciones y recursos que tengan asociados?",
                                    })) {
                                        ResourceFamilyRequest.deleteResourceFamily(rowData.id).then((result) => {
                                            alert.success(result);
                                            if (tableResourceFamilyRef.current.state.data.length === 1 && tableResourceFamilyRef.current.state.query.page > 0)
                                                tableResourceFamilyRef.current.state.query.page = tableResourceFamilyRef.current.state.query.page - 1
                                            tableResourceFamilyRef.current.onQueryChange();
                                            tableResourceRef.current.onQueryChange();
                                        }).catch((error) => {
                                            alert.error(error.message);
                                        })
                                    }
                                },
                            }
                        ] : []}
                    />
                </div>

                <div className={classes.TablePaddingTop}>
                    <DataTable
                        tableRef={tableResourceRef}
                        title="Recursos"
                        columns={[
                            { title: "UEB", field: "ueb", cellStyle: cellStyle },
                            { title: "Almacén Mistral", field: "storage", cellStyle: cellStyle },
                            { title: "Nombre del recurso", field: "name", cellStyle: cellStyle },
                            { title: "Código del recurso", field: "codigo", cellStyle: cellStyle },
                            { title: "Existencia en Mistral", field: "mistralCount", cellStyle: cellStyle },
                        ]}
                        data={(query) => {
                            return new Promise((resolve, reject) => {
                                ResourceRequest.getAllResource(idResourceFamily, query)
                                    .then((result) => {
                                        resolve({
                                            data: result.content,
                                            page: result.pageable.pageNumber,
                                            totalCount: result.totalElements
                                        });
                                    }).catch(error => {
                                        reject(error.message)
                                        alert.error(error.message)
                                    });
                            })
                        }}
                        options={{
                            exportButton: true,
                            filtering: true,
                        }}
                        actions={[
                            {
                                icon: tableIcons.Visibility,
                                tooltip: 'Ver detalles',
                                onClick: (event, rowData) => {
                                    modelResourceDetails.handleOpen({
                                        ueb: rowData.ueb,
                                        codUeb: rowData.codUeb,
                                        storage: rowData.storage,
                                        name: rowData.name,
                                        codigo: rowData.codigo,
                                        mu: rowData.mistralCount.split(" ")[1],
                                    });
                                },
                            }
                        ]}
                        editable={isAdmin ? {
                            onRowDelete: oldData =>
                                new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        ResourceRequest.deleteResource(oldData.id).then((result) => {
                                            if (tableResourceRef.current.state.data.length === 1 && tableResourceRef.current.state.query.page > 0)
                                                tableResourceRef.current.state.query.page = tableResourceRef.current.state.query.page - 1
                                            resolve();
                                            alert.success(result);
                                        }).catch(error => {
                                            reject(error.message)
                                            alert.error(error.message);
                                        });
                                    }, 1000)
                                }),
                        } : {}}
                    />
                </div>

            </div>
        </div>
    );
}

export default ResourceFamily;