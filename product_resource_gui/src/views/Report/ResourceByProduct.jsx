import React, { useEffect, useState } from 'react'
import { useAlert } from 'react-alert';

import DataTable from '../../components/DataTable/DataTable.tsx';
import NumberInput from '../../components/NumberInput/NumberInput.tsx';
import Backdrop from '../../components/Backdrop/Backdrop.tsx';
import Modal from './../../components/Modal/Modal.tsx';
import Select from './../../components/Select/Select.tsx';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.jsx'

import ResourceDetails from '../Resource/ResourceDetails';

import * as ReportRequest from '../../service/actions/ReportRequest';
import * as ProductFamilyRequest from '../../service/actions/ProductFamilyRequest';
import * as PrimaryRequest from '../../service/actions/PrimaryRequest';

import classes from './../../styles/Main.css';
import { Button, Grid } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { tableIcons } from '../../styles/TableIcons';

let loading = null;

const ResourceByProduct = (props) => {

    const alert = useAlert()
    const tableResourceRef = React.createRef()

    let modelResourceDetails = null

    const cellStyle = {
        padding: '8px',
    }

    var [[enterpriseList, idEnterprise, productFamilyList, idProductFamily, count, resourceFamilyList], setList] = useState([
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
            id: "idProductFamily",
            label: "Familia de producto",
            value: "",
            valueLabel: "",
            valid: false,
            rules: {
                required: true
            },
            touched: false
        },
        {
            id: "count",
            label: "Cantidad de producto (UF)",
            value: 1000,
            valid: true,
            rules: {
                required: true,
                min: 100,
                max: 1000000000,
                step: 1
            },
            touched: false
        },
        [],
        ''
    ]);

    useEffect(() => {
        if (loading)
            loading.handleOpen();
        PrimaryRequest.getEnterprises().then((enterpriseList) => {
            setList([enterpriseList, idEnterprise, productFamilyList, idProductFamily, count, resourceFamilyList])
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
                searchResource();
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idEnterprise, productFamilyList, idProductFamily, count, resourceFamilyList]);

    function searchResource() {

        if (idProductFamily.valid && count.valid) {
            if (loading)
                loading.handleOpen();
            ReportRequest.resourcesByProduct(idProductFamily.value, count.value).then((resourceFamilyListResult) => {

                // resourceFamilyListResult.map(item => {
                //     item.requiredCount = item.requiredCount + " " + item.measureUnit;
                //     item.existenceMistral = item.existenceMistral + " " + item.measureUnit;
                //     return item;
                // })

                setList([enterpriseList, idEnterprise, productFamilyList, idProductFamily, count, resourceFamilyListResult])
                if (loading)
                    loading.handleClose();

            }).catch(error => {
                if (loading)
                    loading.handleClose();
                alert.error(error.message);
            });
        } else {
            alert.show("Seleccione una empresa, una familia de productos e inserte una cantidad requeridad para buscar dependencias.", { type: 'warning', })
        }

    }

    return (
        <div>
            <Backdrop ref={el => {
                loading = el;
            }} />
            <Modal
                ref={el => {
                    modelResourceDetails = el;
                }}
                title="Detalles del recurso"
                view={ResourceDetails}
                data={{}}
                setChange={(data) => {

                }}
            />
            <div className={classes.container}>
                <Breadcrumbs
                    links={[
                        { path: "/", name: "Inicio" }
                    ]}
                    name="Recursos por producto"
                />
                <div className={classes.form}>

                    <Grid container spacing={3}>

                        <Grid item md={3} xs={12}>
                            <Select
                                attribute={idEnterprise}
                                data={enterpriseList}
                                onChange={(attribute) => {

                                    idProductFamily.value = "";
                                    idProductFamily.valid = false;
                                    idProductFamily.touched = false;

                                    if (attribute.value !== "") {
                                        if (loading)
                                            loading.handleOpen();
                                        ProductFamilyRequest.getProductFamilyList(attribute.value).then((pfList) => {

                                            setList([enterpriseList, attribute, pfList, idProductFamily, count, resourceFamilyList])
                                            if (loading)
                                                loading.handleClose();

                                        }).catch((error) => {
                                            if (loading)
                                                loading.handleClose();
                                            alert.error(error.message)
                                        });

                                    } else {
                                        setList([enterpriseList, attribute, [], idProductFamily, count, resourceFamilyList])
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item md={3} xs={12}>
                            <Select
                                attribute={idProductFamily}
                                data={productFamilyList}
                                onChange={(attribute) => {

                                    if (attribute.value !== "")
                                        attribute['valueLabel'] = productFamilyList.find(item => item.id === attribute.value).name
                                    else
                                        attribute['valueLabel'] = ""

                                    setList([enterpriseList, idEnterprise, productFamilyList, attribute, count, resourceFamilyList])

                                }}
                            />
                        </Grid>
                        <Grid item md={3} xs={8}>
                            <NumberInput
                                attribute={count}
                                onChange={(attribute) => {
                                    setList([enterpriseList, idEnterprise, productFamilyList, idProductFamily, attribute, resourceFamilyList])
                                }}
                            />
                        </Grid>
                        <Grid container item md={2} xs={4} alignItems='center'>
                            <Button variant="outlined" color="primary" onClick={searchResource}><Search /></Button>
                        </Grid>
                    </Grid>

                    <div className={classes.TablePaddingTop}>
                        <DataTable
                            tableRef={tableResourceRef}
                            title={"Recursos requeridos para producir: " + idProductFamily.valueLabel}
                            columns={[
                                { title: "Empresa", field: "enterprise", cellStyle: cellStyle, },
                                { title: "Nombre de la relación", field: "relationName", cellStyle: cellStyle, },
                                { title: "Criterio de la relación", field: "relationCriterio", cellStyle: cellStyle, },
                                { title: "Nombre de familia", field: "name", cellStyle: cellStyle, },
                                { title: "Tipo de recurso", field: "resourceType", cellStyle: cellStyle, },
                                // { title: "Cantidad base de la relación", field: "relationBaseCount", cellStyle: cellStyle, },
                                // { title: "Recurso base de la relación", field: "relationBaseResource", cellStyle: cellStyle, },
                                // { title: "Cantidad de referencia", field: "referenceCount", cellStyle: cellStyle, },
                                {
                                    title: "Cantidad requerida", field: "requiredCount", cellStyle: cellStyle,
                                    render: (rowData) => rowData.requiredCount + " " + rowData.measureUnit,
                                    customFilterAndSearch: (term, rowData) => (rowData.requiredCount + " " + rowData.measureUnit).includes(term),
                                },
                                {
                                    title: "Existencia en Mistral", field: "existenceMistral", cellStyle: cellStyle,
                                    render: (rowData) => rowData.existenceMistral + " " + rowData.measureUnit,
                                    customFilterAndSearch: (term, rowData) => (rowData.existenceMistral + " " + rowData.measureUnit).includes(term)
                                },
                                { title: "Posible", field: "posible", cellStyle: cellStyle },
                                { title: "Total posible (UF)", field: "posibleTotal", cellStyle: cellStyle },
                            ]}
                            data={resourceFamilyList}
                            options={{
                                exportButton: true,
                                exportAllData: true,
                                exportFileName: "Recursos requeridos para producir: " + idProductFamily.valueLabel,
                                columnsButton: true,
                                filtering: true,
                                grouping: true,
                                pageSize: 10,
                                rowStyle: rowData => ({
                                    backgroundColor: rowData.posible === 'No' ? "#fde0ea" : rowData.posible === 'Si' ? "#fff" : "#fff1e0"
                                }),
                            }}
                            detailPanel={[
                                {
                                    tooltip: 'Mostrar detalles de los recursos',
                                    render: rowData => {
                                        return (
                                            <div style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 40, paddingRight: 15 }}>

                                                <DataTable
                                                    title="Detalles de los recursos"
                                                    columns={[
                                                        { title: "UEB", field: "ueb", cellStyle: cellStyle, },
                                                        { title: "Almacén Mistral", field: "storage", cellStyle: cellStyle, },
                                                        { title: "Nombre del recurso", field: "name", cellStyle: cellStyle, },
                                                        { title: "Código", field: "codigo", cellStyle: cellStyle, },
                                                        {
                                                            title: "Cantidad requerida", field: "requiredCount", cellStyle: cellStyle, render(rowData) {
                                                                return rowData.requiredCount + " " + rowData.measureUnit;
                                                            },
                                                            customFilterAndSearch: (term, rowData) => (rowData.requiredCount + " " + rowData.measureUnit).includes(term)
                                                        },
                                                        {
                                                            title: "Existencia en Mistral", field: "existenceMistral", cellStyle: cellStyle, render(rowData) {
                                                                return rowData.existenceMistral + " " + rowData.measureUnit;
                                                            },
                                                            customFilterAndSearch: (term, rowData) => (rowData.existenceMistral + " " + rowData.measureUnit).includes(term)
                                                        },
                                                        { title: "Posible", field: "posible", cellStyle: cellStyle },
                                                        { title: "Total posible (UF)", field: "posibleTotal", cellStyle: cellStyle },
                                                    ]}
                                                    data={rowData.resourceList}
                                                    options={{
                                                        toolbar: false,
                                                        filtering: true,
                                                        rowStyle: rowData => ({
                                                            backgroundColor: rowData.posible === 'No' ? "#fde0ea" : rowData.posible === 'Si' ? "#fff" : "#fff1e0"
                                                        }),
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
                                                                    measureUnit: rowData.measureUnit,
                                                                });
                                                            },
                                                        },
                                                    ]}
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

export default ResourceByProduct;