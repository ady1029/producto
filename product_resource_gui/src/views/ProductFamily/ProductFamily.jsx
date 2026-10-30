import React from 'react'
import { useAlert } from 'react-alert'
import { TextField, } from '@material-ui/core'
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { useAuth } from 'oidc-react';

import DataTable from './../../components/DataTable/DataTable.tsx'
import { confirm } from '../../components/Confirm/Confirm'
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.jsx'

import classes from './../../styles/Main.css'
import { tableIcons } from '../../styles/TableIcons'

import * as ProductFamilyRequest from '../../service/actions/ProductFamilyRequest'
import * as ProductRequest from '../../service/actions/ProductRequest'

const ProductFamily = (props) => {

    let auth = useAuth();
    let isAdmin = auth.userData?.profile?.groups.some(g => g === "Internal/pr_admin");
    
    const alert = useAlert()

    const tableProductFamilyRef = React.createRef()
    const tableProductRef = React.createRef()

    const history = useHistory();

    const cellStyle = {
        padding: '8px',
    }

    let idProductFamily = -1

    const productSchema = Yup.object().shape({
        codigo: Yup.string().required('Código de produción es un atribito requerido.'),
    })

    return (
        <div className={classes.container}>
            <Breadcrumbs
                links={[
                    { path: "/", name: "Inicio" }
                ]}
                name="Familia de productos"
            />
            <div className={classes.TablePaddingTop}>
                <DataTable
                    tableRef={tableProductFamilyRef}
                    title="Familia de productos"
                    columns={[
                        { title: "Empresa", field: "enterprise", cellStyle: cellStyle },
                        { title: "UEB", field: "uebs", cellStyle: cellStyle },
                        { title: "Nombre de la familia", field: "name", cellStyle: cellStyle },
                        // { title: "Forma farmacéutica", field: "pharmaceuticShape", cellStyle: cellStyle },
                        { title: "Formato", field: "format", cellStyle: cellStyle },
                        { title: "Demanda nacional (UF)", field: "nationalDemand", cellStyle: cellStyle },
                    ]}
                    data={(query) => {
                        return new Promise((resolve, reject) => {
                            ProductFamilyRequest.getAllProductFamily(query)
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
                            backgroundColor: rowData.id === idProductFamily ? "#cacaca" : "#fff",
                        }),
                    }}
                    onRowClick={(event, rowData) => {
                        idProductFamily = rowData.id
                        tableProductFamilyRef.current.onQueryChange();
                        tableProductRef.current.onQueryChange();
                    }}
                    actions={isAdmin ? [
                        {
                            icon: tableIcons.Add,
                            tooltip: 'Agregar',
                            isFreeAction: true,
                            onClick: (event) => {
                                history.push('/product_family/create')
                            },
                        },
                        {
                            icon: tableIcons.Edit,
                            tooltip: 'Editar',
                            onClick: (event, rowData) => {
                                history.push(`/product_family/update/${rowData.id}`)
                            },
                        },
                        {
                            icon: tableIcons.Delete,
                            tooltip: 'Eliminar',
                            onClick: async (event, rowData) => {
                                if (await confirm({
                                    title: "Eliminar familia de producto",
                                    confirmation: "¿Está seguro que desea eliminar la familia de productos " + rowData.name + ", se eliminarán todos los productos, relaciones y recursos que tengan asociados?",
                                })) {
                                    ProductFamilyRequest.deleteProductFamily(rowData.id).then((result) => {
                                        alert.success(result);
                                        if (tableProductFamilyRef.current.state.data.length === 1 && tableProductFamilyRef.current.state.query.page > 0)
                                            tableProductFamilyRef.current.state.query.page = tableProductFamilyRef.current.state.query.page - 1
                                        tableProductFamilyRef.current.onQueryChange();
                                        tableProductRef.current.onQueryChange();
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
                    tableRef={tableProductRef}
                    title="Productos"
                    columns={[
                        { title: "UEB", field: "ueb", cellStyle: cellStyle, editable: 'never' },
                        {
                            title: "Código de producción", field: "codigo", cellStyle: cellStyle,
                            editComponent: props => (
                                < TextField
                                    // label="Codigo"
                                    value={props.value || ""}
                                    type="text"
                                    onChange={e => props.onChange(e.target.value)}
                                    fullWidth={true}
                                    required={true}
                                    error={props.value === undefined || props.value === ""}
                                />
                            )

                        },
                        { title: "Nombre del producto", field: "name", cellStyle: cellStyle, editable: 'never', },
                        { title: "CUP", field: "cup", cellStyle: cellStyle, editable: 'never' },
                        // {title: "Forma de presentación", field: "pharmaceuticShape", cellStyle: cellStyle, editable: 'never' },
                        { title: "Mercado", field: "market", cellStyle: cellStyle, editable: 'never' },

                    ]}
                    data={(query) => {
                        return new Promise((resolve, reject) => {
                            ProductRequest.getAllProduct(idProductFamily, query)
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
                    editable={isAdmin ? {
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve, reject) => {
                                setTimeout(async () => {

                                    productSchema.validate(newData).then((value) => {
                                        ProductRequest.updateProduct(value).then(() => {
                                            resolve();
                                            alert.success("Se ha editado el producto correctamente.");
                                        }).catch(error => {
                                            reject(error.message)
                                            alert.error(error.message)
                                        });
                                    }).catch(function (err) {
                                        err.errors.map(item => alert.show(item, { type: 'warning', }))
                                        reject();
                                    });

                                }, 1000)
                            }),
                        onRowDelete: oldData =>
                            new Promise((resolve, reject) => {
                                setTimeout(() => {

                                    ProductRequest.deleteProduct(oldData.id).then((result) => {
                                        if (tableProductRef.current.state.data.length === 1 && tableProductRef.current.state.query.page > 0)
                                            tableProductRef.current.state.query.page = tableProductRef.current.state.query.page - 1
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
    );
}

export default ProductFamily;
