import React, { useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { InputAdornment, TextField } from '@material-ui/core';
import * as Yup from 'yup';
import { useAuth } from 'oidc-react';

import Resource from '../Resource/Resource'
import RelationProduct from './RelationProduct';

import DataTable from './../../components/DataTable/DataTable.tsx';
import DataTableSelect from './../../components/DataTable/Select.tsx';
import { confirm } from '../../components/Confirm/Confirm';
import Modal from './../../components/Modal/Modal.tsx'
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.jsx'

import * as MeasureUnitRequest from '../../service/actions/MeasureUnitRequest';
import * as RelationRequest from '../../service/actions/RelationRequest';
import * as ResourceFamilyRelationRequest from '../../service/actions/ResourceFamilyRelationRequest';
import * as ResourceTypeRequest from '../../service/actions/ResourceTypeRequest';

import classes from './../../styles/Main.css';
import { tableIcons } from '../../styles/TableIcons';
import { FilterList } from '@material-ui/icons';


const Relation = (props) => {

    let auth = useAuth();
    let isAdmin = auth.userData?.profile?.groups.some(g => g === "Internal/pr_admin");

    const alert = useAlert()

    let tableRelationRef = React.createRef()
    let tableResourceFamilyAddedRef = React.createRef()

    const cellStyle = {
        padding: '8px',
    }

    let modelRelationProduct = null
    let modelResource = null

    let idRelation = -1
    let idEnterprise = -1

    let [[muList, respurceTypeList, respurceTypeObject], setResourceType] = useState([[], [], {}])

    const resourceFamilyRelationSchema = Yup.object().shape({
        idResourceFamily: Yup.number().required('Atributo ID de Familia de recurso es requerido.'),
        idType: Yup.string("Seleccione un tipo de recurso.").required('Atributo Tipo de recurso de Familia de recurso es requerido.'),
        referenceCount: Yup.number().moreThan(0, "Atributo Cantidad de referencia debe ser mayor que cero.")
            .transform((value) => (value === "" ? null : value)).typeError("Atributo Cantidad de referencia de Familia de recurso es requerido.")
            .required('Atributo Cantidad de referencia de Familia de recurso es requerido.'),
        measureUnit: Yup.string().required('Atributo Unidad de medida de Familia de recurso es requerido.'),
    })

    useEffect(() => {

        MeasureUnitRequest.getAllMeasureUnit().then((muResp) => {

            ResourceTypeRequest.getResourceTypeList(idEnterprise, "").then((rtResult) => {

                let listObject = {};
                let list = [];
                rtResult.forEach(item => {
                    listObject[item.id] = item.name;
                    list.push({ id: item.id, name: item.name, idEnterprise: item.idEnterprise });
                })

                setResourceType([muResp, list, listObject]);

            }).catch(error => {
                alert.error(error.message)
            });
        }).catch(error => {
            alert.error(error.message)
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <Modal
                ref={el => {
                    modelRelationProduct = el;
                }}
                title="Productos asociados a la relación"
                view={RelationProduct}
                data={{}}
                setChange={(data) => { }}
            />
            <Modal
                ref={el => {
                    modelResource = el;
                }}
                title="Recursos de la familia"
                view={Resource}
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
                    name="Relaciones"
                />
                <div className={classes.TablePaddingTop}>
                    <DataTable
                        tableRef={tableRelationRef}
                        title="Relaciones"
                        columns={[
                            { title: "Empresa", field: "productFamilyEnterprise", cellStyle: cellStyle },
                            { title: "Familia de productos", field: "productFamilyName", cellStyle: cellStyle },
                            { title: "Nombre de la relación", field: "name", cellStyle: cellStyle },
                            { title: "Criterio de relación", field: "criterio", cellStyle: cellStyle },
                            { title: "Fecha", field: "date", cellStyle: cellStyle },
                            { title: "Cantidad base", field: "baseCount", cellStyle: cellStyle },
                            { title: "Familia de recurso base", field: "resourceFamilyName", cellStyle: cellStyle },
                        ]}
                        data={(query) => {
                            return new Promise((resolve, reject) => {
                                RelationRequest.getAllRelation(query).then((result) => {
                                    resolve({
                                        data: result.content,
                                        page: result.pageable.pageNumber,
                                        totalCount: result.totalElements
                                    });
                                }).catch(error => {
                                    reject(error.message);
                                    alert.error(error.message);
                                });
                            })
                        }}
                        options={{
                            exportButton: true,
                            selectRow: true,
                            filtering: true,
                            pageSize: 10,
                            rowStyle: rowData => ({
                                backgroundColor: rowData.id === idRelation ? "#cacaca" : "#fff",
                            }),
                        }}
                        onRowClick={(event, rowData) => {
                            idRelation = rowData.id
                            idEnterprise = rowData.productFamilyIdEnterprise
                            tableRelationRef.current.onQueryChange();
                            tableResourceFamilyAddedRef.current.onQueryChange();
                        }}
                        actions={isAdmin ? [
                            {
                                icon: tableIcons.Add,
                                tooltip: 'Agregar',
                                isFreeAction: true,
                                onClick: (event) => {
                                    props.history.push({ pathname: '/relation/create' })
                                },
                            },
                            {
                                icon: tableIcons.Visibility,
                                tooltip: 'Ver productos asociados a la relación',
                                onClick: (event, rowData) => {
                                    modelRelationProduct.handleOpen({ idRelation: rowData.id });
                                },
                            },
                            {
                                icon: tableIcons.Edit,
                                tooltip: 'Editar',
                                onClick: (event, rowData) => {
                                    props.history.push({ pathname: `/relation/update/${rowData.id}` })
                                },
                            },
                            {
                                icon: tableIcons.Delete,
                                tooltip: 'Eliminar',
                                onClick: async (event, rowData) => {
                                    if (await confirm({
                                        title: "Eliminar familia de producto",
                                        confirmation: "¿Está seguro que desea eliminar la relación " + rowData.name + "?",
                                    })) {
                                        RelationRequest.deleteRelation(rowData.id).then((result) => {
                                            alert.success(result);
                                            if (tableRelationRef.current.state.data.length === 1 && tableRelationRef.current.state.query.page > 0)
                                                tableRelationRef.current.state.query.page = tableRelationRef.current.state.query.page - 1
                                            tableRelationRef.current.onQueryChange();
                                            tableResourceFamilyAddedRef.current.onQueryChange();
                                        }).catch((error) => {
                                            alert.error(error.message);
                                        })

                                    }
                                },
                            }
                        ] : [
                            {
                                icon: tableIcons.Visibility,
                                tooltip: 'Ver productos asociados a la relación',
                                onClick: (event, rowData) => {
                                    modelRelationProduct.handleOpen({ idRelation: rowData.id });
                                },
                            }
                        ]}
                    />
                </div>


                <div className={classes.TablePaddingTop}>
                    <DataTable
                        tableRef={tableResourceFamilyAddedRef}
                        title="Familia de recursos agregadas"
                        columns={[
                            { title: "Empresa", field: "enterprise", cellStyle: cellStyle, editable: 'never' },
                            { title: "Nombre de la familia", field: "name", cellStyle: cellStyle, editable: 'never' },
                            // { title: "Tipo de recurso", field: "resourceType", cellStyle: cellStyle, editable: 'never' },
                            {
                                title: "Tipo de recurso", field: "idType", cellStyle: cellStyle,
                                lookup: respurceTypeObject,
                                filterComponent: props => (
                                    <TextField
                                        value={props.value}
                                        onChange={e => {
                                            props.onFilterChanged(props.columnDef.tableData.columnOrder, e.target.value)
                                        }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><FilterList /></InputAdornment>,
                                        }}
                                    />
                                ),
                                editComponent: props => (
                                    <DataTableSelect
                                        filterName={"idEnterprise"}
                                        filter={idEnterprise}
                                        data={respurceTypeList}
                                        value={props.value}
                                        onChange={e => props.onChange(e.target.value)}
                                    />
                                )
                            },
                            {
                                title: "Cantidad de referencia", field: "referenceCount", cellStyle: cellStyle,
                                editComponent: props => (
                                    <TextField
                                        type="number"
                                        value={props.value}
                                        onChange={e => props.onChange(e.target.value)}
                                        fullWidth={true}
                                        InputProps={{
                                            inputProps: {
                                                max: 100000000, min: 0, step: 0.01
                                            }
                                        }}
                                    />
                                )
                            },
                            {
                                title: "Unidad de medida", field: "measureUnit", cellStyle: cellStyle,
                                editComponent: props => (
                                    <DataTableSelect
                                        data={muList}
                                        value={props.value}
                                        onChange={e => props.onChange(e.target.value)}
                                    />
                                )
                            },
                        ]}
                        data={(query) => {
                            return new Promise((resolve, reject) => {
                                ResourceFamilyRelationRequest.getAllResourceFamilyRelation(idRelation, query).then((result) => {
                                    resolve({
                                        data: result.content,
                                        page: result.pageable.pageNumber,
                                        totalCount: result.totalElements
                                    });
                                }).catch(error => {
                                    reject(error.message);
                                    alert.error(error.message);
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
                                tooltip: 'Ver recursos asociados a las familia',
                                onClick: (event, rowData) => {
                                    modelResource.handleOpen({
                                        idResourceFamily: rowData.idResourceFamily,
                                        enterprise: rowData.enterprise,
                                        name: rowData.name
                                    });
                                },
                            },
                        ]}
                        editable={isAdmin ? {
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve, reject) => {
                                    setTimeout(() => {

                                        resourceFamilyRelationSchema.validate(newData).then((value) => {
                                            let rfr = {
                                                id: value.id,
                                                idRelation: value.idRelation,
                                                idResourceFamily: value.idResourceFamily,
                                                idType: value.idType,
                                                referenceCount: value.referenceCount,
                                                measureUnit: value.measureUnit,
                                            }
                                            ResourceFamilyRelationRequest.updateResourceFamilyRelation(rfr).then(() => {
                                                resolve();
                                                alert.success("Se ha editado la asociación entre la relación y familia de recursos correctamente.");
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
                                        ResourceFamilyRelationRequest.deleteResourceFamilyRelation(oldData.id).then((result) => {
                                            if (tableResourceFamilyAddedRef.current.state.data.length === 1 && tableResourceFamilyAddedRef.current.state.query.page > 0)
                                                tableResourceFamilyAddedRef.current.state.query.page = tableResourceFamilyAddedRef.current.state.query.page - 1
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
    )

}

export default Relation;