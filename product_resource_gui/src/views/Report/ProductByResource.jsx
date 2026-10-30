
import React, { useState, useEffect, Fragment } from 'react'
import { useAlert } from 'react-alert';
import { Search, Visibility } from '@material-ui/icons';

import DataTable from '../../components/DataTable/DataTable.tsx';
import Backdrop from '../../components/Backdrop/Backdrop.tsx';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.jsx'
import Select from './../../components/Select/Select.tsx';
import Modal from './../../components/Modal/Modal.tsx';

import ExistenceDetails from './ExistenceDetails.jsx';

import * as PrimaryRequest from '../../service/actions/PrimaryRequest';
import * as ResourceFamilyRequest from '../../service/actions/ResourceFamilyRequest';
import * as ReportRequest from '../../service/actions/ReportRequest';

import classes from './../../styles/Main.css';
import { Button, Grid, IconButton, Typography } from '@material-ui/core';
import { MTableBody } from 'material-table';

let loading = null;

const ProductByResource = (props) => {

    const alert = useAlert()
    const tableProductFamilyRef = React.createRef()

    let modelExistenceDetails = null

    const cellStyle = {
        padding: '8px',
    }

    const [[enterpriseList, idEnterprise, resourceFamilyList, idResourceFamily], setList] = useState([
        [],
        {
            id: "idEnterprise",
            label: "Empresa",
            value: "",
            valid: false,
            rules: {
                required: true
            },
            touched: false
        },
        [],
        {
            id: "idResourceFamily",
            label: "Familia de recurso",
            value: "",
            valid: false,
            rules: {
                required: true
            },
            touched: false
        },
    ]);

    const [[resourceExistence, productFamilyList], setProductFamilyList] = useState([undefined, []]);

    useEffect(() => {
        if (loading)
            loading.handleOpen();
        PrimaryRequest.getEnterprises().then((enterpriseListResult) => {
            setList([enterpriseListResult, idEnterprise, resourceFamilyList, idResourceFamily])
            if (loading)
                loading.handleClose();
        }).catch(error => {
            if (loading)
                loading.handleClose();
            alert.error(error.message);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {

        const handleEsc = (event) => {
            if (event.keyCode === 13) {
                searchProduct();
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idEnterprise, resourceFamilyList, idResourceFamily]);

    useEffect(() => {

        if (idResourceFamily.valid)
            searchProduct()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idResourceFamily]);

    const searchProduct = () => {

        if (idResourceFamily.valid) {
            if (loading)
                loading.handleOpen();
            ReportRequest.resourceExistences(idResourceFamily.value).then((resourceExistenceResult) => {
                ReportRequest.productByResources(idResourceFamily.value).then((productFamilyListReult) => {

                    productFamilyListReult.map(item => {
                        let fixed = 4;
                        if (item.measureUnit === "MU" || item.measureUnit === "U")
                            fixed = 2
                        item.index = ((item.referenceCount / item.relationBaseCount) * 1000).toFixed(fixed) + " " + item.measureUnit + '/1000 U';
                        return item;
                    })

                    setProductFamilyList([resourceExistenceResult, productFamilyListReult])
                    if (loading)
                        loading.handleClose();

                }).catch(error => {
                    if (loading)
                        loading.handleClose();
                    alert.error(error.message);
                });
            }).catch(error => {
                if (loading)
                    loading.handleClose();
                alert.error(error.message);
            });
        } else {
            alert.show("Seleccione una empresa y una familia de recursos para buscar dependencias.", { type: 'warning', })
        }

    }

    return (
        <div>
            <Backdrop ref={el => {
                loading = el;
            }} />
            <Modal
                ref={el => {
                    modelExistenceDetails = el;
                }}
                title="Detalles de existencia"
                view={ExistenceDetails}
                data={{
                    resourceExistence: resourceExistence
                }}
                setChange={(data) => {

                }}
            />
            <div className={classes.container}>
                <Breadcrumbs
                    links={[
                        { path: "/", name: "Inicio" }
                    ]}
                    name="Productos por recurso"
                />
                <div className={classes.form}>

                    <Grid container spacing={3}>

                        <Grid item md={3} xs={12}>
                            <Select
                                attribute={idEnterprise}
                                data={enterpriseList}
                                onChange={(attribute) => {

                                    idResourceFamily.value = "";
                                    idResourceFamily.valid = false;
                                    idResourceFamily.touched = false;

                                    if (attribute.value !== "") {
                                        if (loading)
                                            loading.handleOpen();
                                        ResourceFamilyRequest.getResourceFamilyList(attribute.value).then((resourceFamilyListResult) => {
                                            setList([enterpriseList, attribute, resourceFamilyListResult, idResourceFamily])
                                            if (loading)
                                                loading.handleClose();

                                        }).catch((error) => {
                                            if (loading)
                                                loading.handleClose();
                                            alert.error(error.message)
                                        });

                                    } else {
                                        setList([enterpriseList, attribute, [], idResourceFamily])
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item md={3} xs={8}>
                            <Select
                                attribute={idResourceFamily}
                                data={resourceFamilyList}
                                onChange={(attribute) => {
                                    setList([enterpriseList, idEnterprise, resourceFamilyList, attribute]);
                                }}
                            />
                        </Grid>

                        <Grid container item md={2} xs={4} alignItems='center'>
                            <Button variant="outlined" color="primary" onClick={searchProduct}><Search /></Button>
                        </Grid>

                    </Grid>
                    <div className={classes.TablePaddingTop}>
                        <DataTable
                            tableRef={tableProductFamilyRef}
                            title={resourceExistence !== undefined ?
                                <Typography variant="h6">{`Productos compartidos por: ${resourceExistence.resourceFamilyName} - Existencia: ${resourceExistence.existence} ${resourceExistence.measureUnit} `}
                                    <IconButton color="primary" aria-label="Ver detalles" onClick={() => modelExistenceDetails.handleOpen()}>
                                        <Visibility />
                                    </IconButton>
                                </Typography> :
                                "Productos compartidos"}
                            columns={[
                                // { title: "Empresa", field: "enterprise", cellStyle: cellStyle, editable: 'never' },
                                { title: "Familia de producto", field: "name", cellStyle: cellStyle, editable: 'never' },
                                // { title: "Forma de presentación", field: "pharmaceuticShape", cellStyle: cellStyle,  editable: 'never' },
                                { title: "Nombre de la relación", field: "relationName", cellStyle: cellStyle, editable: 'never' },
                                // { title: "Criterio de la relación", field: "relationCriterio", cellStyle: cellStyle, editable: 'never' },
                                { title: "Tipo de recurso", field: "resourceType", cellStyle: cellStyle, editable: 'never' },
                                {
                                    title: "Índice de consumo", field: "index", cellStyle: cellStyle, editable: 'never',
                                },
                                {
                                    title: "Plan de este año (UF)", field: "planThisYear", cellStyle: { cellStyle }, emptyValue: 0, type: "numeric", align: "left"
                                },
                                {
                                    title: "Recurso requeridos", field: "requiredCountPlanThisYear", cellStyle: cellStyle, editable: 'never',
                                    render(rowData) {
                                        return rowData.requiredCountPlanThisYear + " " + rowData.measureUnit;
                                    },
                                    customFilterAndSearch: (term, rowData) => (rowData.requiredCountPlanThisYear + " " + rowData.measureUnit).includes(term)
                                },
                                {
                                    title: "Plan del próximo año (UF)", field: "planNextYear", cellStyle: { cellStyle }, emptyValue: 0, type: "numeric", align: "left"
                                },
                                {
                                    title: "Recurso requeridos", field: "requiredCountPlanNextYear", cellStyle: cellStyle, editable: 'never',
                                    render(rowData) {
                                        return rowData.requiredCountPlanNextYear + " " + rowData.measureUnit;
                                    },
                                    customFilterAndSearch: (term, rowData) => (rowData.requiredCountPlanNextYear + " " + rowData.measureUnit).includes(term)
                                },
                            ]}
                            data={productFamilyList}
                            cellEditable={{
                                cellStyle: {},
                                onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                                    return new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                            switch (columnDef.field) {
                                                case "planThisYear":
                                                    rowData.planThisYear = newValue;
                                                    rowData.requiredCountPlanThisYear = (rowData.referenceCount * newValue / rowData.relationBaseCount).toFixed(4);
                                                    break;
                                                case "planNextYear":
                                                    rowData.planNextYear = newValue;
                                                    rowData.requiredCountPlanNextYear = (rowData.referenceCount * newValue / rowData.relationBaseCount).toFixed(4);
                                                    break;
                                                default:
                                                    break;
                                            }
                                            productFamilyList.splice(rowData.tableData.id, 1, rowData);
                                            setProductFamilyList([resourceExistence, productFamilyList]);
                                            resolve();
                                        }, 1000)
                                    });
                                }
                            }}
                            options={{
                                exportButton: true,
                                exportAllData: true,
                                exportFileName: resourceExistence !== undefined ?
                                    `Productos compartidos por: ${resourceExistence.resourceFamilyName} - Existencia: ${resourceExistence.existence} ${resourceExistence.measureUnit} ` :
                                    "Productos compartidos",
                                exportCVS: (columns, data) => {
                                    console.log('Columns: ' + columns)
                                    console.log('data: ' + data)
                                },
                                columnsButton: true,
                                filtering: true,
                                pageSize: 10,
                                grouping: true
                            }}
                            components={{
                                Body: props => {
                                    let resourceCountTotal1 = 0;
                                    let resourceCountTotal2 = 0;
                                    if (props.renderData.length > 0)
                                        props.renderData.forEach(item => {
                                            resourceCountTotal1 += parseFloat(item.requiredCountPlanThisYear);
                                            resourceCountTotal2 += parseFloat(item.requiredCountPlanNextYear);
                                        })
                                    return (
                                        <Fragment>
                                            <MTableBody {...props} />
                                            <tfoot className="MuiTableBody-root">
                                                <tr className="MuiTableRow-root">
                                                    <td className="MuiTableCell-root MuiTableCell-body"></td>
                                                    <td className="MuiTableCell-root MuiTableCell-body"></td>
                                                    <td className="MuiTableCell-root MuiTableCell-body"></td>
                                                    <td className="MuiTableCell-root MuiTableCell-body"></td>
                                                    <td className="MuiTableCell-root MuiTableCell-body"></td>
                                                    <td className="MuiTableCell-root MuiTableCell-body"><strong>Total:</strong></td>
                                                    <td className="MuiTableCell-root MuiTableCell-body"><strong>{resourceCountTotal1.toFixed(4)}</strong></td>
                                                    <td className="MuiTableCell-root MuiTableCell-body"></td>
                                                    <td className="MuiTableCell-root MuiTableCell-body"><strong>{resourceCountTotal2.toFixed(4)}</strong></td>
                                                </tr>
                                            </tfoot>
                                        </Fragment>);
                                }
                            }}

                            actions={[

                            ]}
                            detailPanel={[
                                {
                                    tooltip: 'Mostrar detalles de los productos',
                                    render: rowData => {
                                        return (
                                            <div style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 40, paddingRight: 15 }}>

                                                <DataTable
                                                    title="Detalles de los productos"
                                                    columns={[
                                                        { title: "UEB", field: "ueb", cellStyle: cellStyle, },
                                                        // { title: "Código de producción", field: "codigo", cellStyle: cellStyle, },
                                                        { title: "Nombre del producto", field: "name", cellStyle: cellStyle, },
                                                        { title: "CUP", field: "cup", cellStyle: cellStyle, },
                                                        { title: "Mercado", field: "market", cellStyle: cellStyle, },
                                                        {
                                                            title: "Seleccionado", field: "selected", cellStyle: cellStyle, render(rowData) {
                                                                return rowData.selected ? "Si" : "No";
                                                            },
                                                            customFilterAndSearch: (term, rowData) => rowData.selected ? "Si" : "No"
                                                        },
                                                    ]}
                                                    data={rowData.productList}
                                                    options={{
                                                        toolbar: false,
                                                        filtering: true,
                                                        rowStyle: rowData => ({
                                                            backgroundColor: rowData.selected ? "#dff0d8" : "#fff"
                                                        }),
                                                    }}
                                                />
                                            </div>
                                        )
                                    }
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ProductByResource;