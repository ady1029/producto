import React from 'react';
import { useAlert } from 'react-alert';
import { useAuth } from 'oidc-react';

import DataTable from './../../components/DataTable/DataTable.tsx';
import Modal from './../../components/Modal/Modal.tsx';
import { confirm } from '../../components/Confirm/Confirm';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.jsx'

import ResourceTypeForm from './ResourceTypeForm';

import * as ResourceTypeRequest from './../../service/actions/ResourceTypeRequest';

import classes from './../../styles/Main.css';
import { tableIcons } from './../../styles/TableIcons';

const ResourceType = () => {

    let auth = useAuth();
    let isAdmin = auth.userData?.profile?.groups.some(g => g === "Internal/pr_admin");

    const alert = useAlert()

    const tableResourceRef = React.createRef();

    let modalResourceType = null;

    const cellStyle = { padding: '8px' };

    return (
        <div>
            <Modal
                ref={el => {
                    modalResourceType = el;
                }}
                title="Tipo de recurso"
                view={ResourceTypeForm}
                data={{}}
                setChange={(message) => {
                    tableResourceRef.current.onQueryChange();
                    modalResourceType.handleClose();
                    alert.success(message);
                }}
            />
            <div className={classes.container}>
                <Breadcrumbs
                    links={[
                        { path: "/", name: "Inicio" }
                    ]}
                    name="Tipo de recurso"
                />
                <div className={classes.TablePaddingTop}>
                    <DataTable
                        tableRef={tableResourceRef}
                        title="Tipos de recursos"
                        columns={[
                            { title: "Empresa", field: "enterprise", cellStyle: cellStyle, },
                            { title: "Nombre", field: "name", cellStyle: cellStyle }
                        ]}
                        data={(query) => {
                            return new Promise((resolve, reject) => {
                                ResourceTypeRequest.getAllResourceType(query)
                                    .then((result) => {
                                        resolve({
                                            data: result.content,
                                            page: result.pageable.pageNumber,
                                            totalCount: result.totalElements
                                        })
                                    }).catch(error => {
                                        reject(error)
                                    });
                            })
                        }}
                        options={{
                            exportButton: true,
                            filtering: true,
                            pageSize: 10,
                            pageSizeOptions: [10, 20]
                        }}
                        actions={isAdmin ? [
                            {
                                icon: tableIcons.Add,
                                tooltip: 'Agregar',
                                isFreeAction: true,
                                onClick: (event) => {
                                    modalResourceType.handleOpen({ idResourceType: -1 });
                                },
                            },
                            {
                                icon: tableIcons.Edit,
                                tooltip: 'Editar',
                                onClick: (event, rowData) => {
                                    modalResourceType.handleOpen({ idResourceType: rowData.id });
                                },
                            },
                            {
                                icon: tableIcons.Delete,
                                tooltip: 'Eliminar',
                                onClick: async (event, rowData) => {
                                    if (await confirm({
                                        title: "Eliminar tipo de recurso",
                                        confirmation: "¿Está seguro que desea eliminar el tipo de recurso " + rowData.name + "?",
                                    })) {
                                        ResourceTypeRequest.deleteResourceTyoe(rowData.id).then(() => {
                                            alert.success('Se ha eliminado el tipo de recurso correctamente.');
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
            </div>

        </div>
    );
}
export default ResourceType;