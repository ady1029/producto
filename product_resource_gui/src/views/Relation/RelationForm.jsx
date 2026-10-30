import React, { useEffect, useState } from 'react';
import { TextField, Button, Grid } from '@material-ui/core';
import moment from "moment";
import { useAlert } from 'react-alert';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';

import Select from '../../components/Select/Select.jsx';
import DataTable from '../../components/DataTable/DataTable.tsx';
import DataTableSelect from './../../components/DataTable/Select.tsx';
import Input from '../../components/Input/Input.jsx';
import DatePicker from '../../components/DatePicker/DatePicker.jsx';
import Modal from './../../components/Modal/Modal.tsx';
import Backdrop from './../../components/Backdrop/Backdrop.tsx'
import handlerError from './../../components/HandlerError/HandlerError.jsx'
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.jsx'

import Resource from '../Resource/Resource'

import * as Data from '../../service/data/Data';
import * as PrimaryRequest from '../../service/actions/PrimaryRequest';
import * as ProductFamilyRequest from '../../service/actions/ProductFamilyRequest';
import * as RelationRequest from '../../service/actions/RelationRequest';
import * as ProductRequest from '../../service/actions/ProductRequest';
import * as ResourceFamilyRequest from '../../service/actions/ResourceFamilyRequest';
import * as ResourceFamilyRelationRequest from '../../service/actions/ResourceFamilyRelationRequest';
import * as MeasureUnitRequest from '../../service/actions/MeasureUnitRequest';
import * as ResourceTypeRequest from '../../service/actions/ResourceTypeRequest';

import classes from './../../styles/Main.css';
import { tableIcons } from '../../styles/TableIcons';

let loading = null;

let orderedColumnId = -1
let orderDirection = ""
let page = 0

const RelationForm = props => {

    const alert = useAlert()
    const { id } = useParams();

    const cellStyle = { padding: '8px' }

    const tableResourceFamilyRef = React.createRef();

    let modelResource = null

    let initialValues = {
        name: '',
        criterio: '',
        date: new Date(),
        baseCount: '',
        idEnterprise: '',
        idProductFamily: '',
        idResourceFamily: '',
    };

    let filters = {
        enterprise: "",
        name: "",
        resourceType: "",
    }

    const [formValues, setValues] = useState(initialValues)
    const [enterpriseList, setEnterpriseList] = useState([]);
    const [productFamilyList, setProductFamilyList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [productsSelected, setProductSelected] = useState([]);
    const [resourceFamilyList, setResourceFamilyList] = useState([]);
    const [resourceFamilyRelationList, setResourceFamilyRelationList] = useState([]);
    const [resourceFamilyBaseList, setResourceFamilyBaseList] = useState([]);
    const [resourceFamilyFilter, setResourceFamilyFilter] = useState(filters);
    const [muList, setMU] = useState([])
    const [[respurceTypeList, respurceTypeObject], setResourceType] = useState([[], {}])

    const productSchema = Yup.object().shape({
        id: Yup.number().required('Atributo ID de Producto es requerido.'),
    })

    const productListSchema = Yup.array().of(productSchema).min(1, "Debe seleccionar al menos un producto.")

    const resourceFamilyRelationSchema = Yup.object().shape({
        idResourceFamily: Yup.number().required('Atributo ID de Familia de recurso es requerido.'),
        idType: Yup.string("Seleccione un tipo de recurso.").required('Atributo Tipo de recurso de Familia de recurso es requerido.'),
        referenceCount: Yup.number().moreThan(0, "Atributo Cantidad de referencia debe ser mayor que cero.")
            .transform((value) => (value === "" ? null : value)).typeError("Atributo Cantidad de referencia de Familia de recurso es requerido.")
            .required('Atributo Cantidad de referencia de Familia de recurso es requerido.'),
        measureUnit: Yup.string().required('Atributo Unidad de medida de Familia de recurso es requerido.'),
    })

    const resourceFamilyRelationListSchema = Yup.array().of(resourceFamilyRelationSchema).min(1, "Debe agregar al menos una familia de recurso.")

    useEffect(() => {

        if (loading)
            loading.handleOpen();

        PrimaryRequest.getEnterprises().then((enterpriseListResult) => {

            setEnterpriseList(enterpriseListResult)

            if (id !== undefined) {

                RelationRequest.getRelation(id).then(relation => {

                    resourceTypeRefresh(relation.productFamily.idEnterprise)

                    ProductFamilyRequest.getProductFamilyList(relation.productFamily.idEnterprise).then((pfListResult) => {

                        setProductFamilyList(pfListResult)

                        ProductRequest.getAllProductList(relation.idProductFamily).then((productListResult) => {

                            productListResult.map((item, i) => {
                                let checked = false;
                                if (relation.products.find(prod => prod.id === item.id) !== undefined)
                                    checked = true;
                                item['tableData'] = { id: i, checked: checked };
                                return item
                            });

                            setProductList(productListResult)
                            setProductSelected(relation.products)

                            ResourceFamilyRequest.getResourceFamilyList(relation.productFamily.idEnterprise).then(rfListResult => {

                                setResourceFamilyList(rfListResult)

                                ResourceFamilyRelationRequest.getResourceFamilyRelationList(id).then((rfRelationListResult) => {

                                    setResourceFamilyRelationList(rfRelationListResult)

                                    ResourceFamilyRequest.getResourceFamilyList(relation.productFamily.idEnterprise, "", "", relation.idProductFamily, "Envase secundario", "Estuche")
                                        .then(rfBaseListResult => {

                                            setValues({
                                                name: relation.name,
                                                criterio: relation.criterio,
                                                date: moment(relation.date),
                                                baseCount: relation.baseCount,
                                                idEnterprise: relation.productFamily.idEnterprise,
                                                idProductFamily: relation.idProductFamily,
                                                idResourceFamily: relation.idResourceFamily === null ? '' : relation.idResourceFamily,
                                            })

                                            setResourceFamilyBaseList(rfBaseListResult)
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
                if (loading)
                    loading.handleClose();
            }

        }).catch(error => {
            if (loading)
                loading.handleClose();
            alert.error(error.message);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        MeasureUnitRequest.getAllMeasureUnit().then((muResp) => {
            setMU(muResp);
        }).catch(error => {
            alert.error(error.message)
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const rfBaseListRefresh = (idEnterprise, idProductFamily, criterio, setFieldValue) => {

        if (idProductFamily !== '' && criterio === "Envase terciario") {

            ResourceFamilyRequest.getResourceFamilyList(idEnterprise, "", "", idProductFamily, "Envase secundario").then(rfBaseListResult => {

                console.log('getResourceFamilyList', rfBaseListResult)
                setResourceFamilyBaseList(rfBaseListResult)

            }).catch(error => alert.error(error.message))

        } else {
            setFieldValue("idResourceFamily", "")
            setResourceFamilyBaseList([])
        }

    }

    const resourceTypeRefresh = (idEnterprise) => {

        if (idEnterprise !== "") {
            ResourceTypeRequest.getResourceTypeList(idEnterprise).then((rtResult) => {

                let listObject = {};
                let list = [];
                rtResult.forEach(item => {
                    listObject[item.id] = item.name;
                    list.push({ id: item.id, name: item.name, idEnterprise: item.idEnterprise });
                })

                setResourceType([list, listObject]);

            }).catch(error => {
                alert.error(error.message)
            });
        } else {
            setResourceType([[], {}]);
        }
    }

    useEffect(() => {
        tableResourceFamilyRef.current.onChangeOrder(orderedColumnId, orderDirection)
        tableResourceFamilyRef.current.onChangePage(undefined, page)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productList])

    const submit = async (values, { setSubmitting, setErrors }) => {

        values['id'] = id;

        let productsValid = await productListSchema.isValidSync(productsSelected)
        let resourceFamilyRelationsValid = await resourceFamilyRelationListSchema.isValidSync(resourceFamilyRelationList)

        if (productsValid && resourceFamilyRelationsValid) {
            values['products'] = productsSelected;
            values['resourceFamilyRelations'] = resourceFamilyRelationList;

            if (id === undefined) {

                RelationRequest.createRelation(values).then(() => {
                    props.history.goBack()
                    alert.success("Se ha creado la relación correctamente.")
                }).catch(error => {
                    handlerError(error, setErrors, alert, "Ha ocurrido un error al intentar insertar la relacion.")
                    setSubmitting(false);
                })

            } else {

                RelationRequest.updateRelation(values).then(() => {
                    props.history.goBack()
                    alert.success("Se ha editado la relación correctamente.")
                }).catch(error => {
                    handlerError(error, setErrors, alert, "Ha ocurrido un error al intentar editar la relacion.")
                    setSubmitting(false);
                })

            }

        } else {

            productListSchema.validate(productsSelected).catch(function (err) {
                err.errors.map(item => alert.show(item, { type: 'warning', }))
            });
            resourceFamilyRelationListSchema.validate(resourceFamilyRelationList).catch(function (err) {
                err.errors.map(item => alert.show(item, { type: 'warning', }))
            });
            setSubmitting(false);

        }
    }



    return (
        <div>
            <Backdrop ref={el => {
                loading = el;
            }} />
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
                        { path: "/", name: "Inicio" },
                        { path: "/relation", name: "Relaciones" },
                    ]}
                    name={id === undefined ? "Crear nueva relación" : `Editar relación: "${formValues.name}"`}
                />

                <div className={classes.form}>

                    <Formik
                        enableReinitialize
                        initialValues={formValues}
                        validationSchema={Yup.object({
                            name: Yup.string().required('Nombre de la relación es un atribito requerido.'),
                            criterio: Yup.string().required('Tipo de relación es un atribito requerido.'),
                            date: Yup.date().nullable().required('Inserte una fecha con el formato yyyy-mm-dd.'),
                            baseCount: Yup.number().required('Cantidad base de referencia es un atribito requerido.'),
                            idEnterprise: Yup.number().required('Empresa es un atribito requerido.'),
                            idProductFamily: Yup.number().required('Familia de producto es un atribito requerido.'),
                        })}
                        onSubmit={submit}
                    >

                        {({ values, handleChange, handleSubmit, setFieldValue }) => (
                            <Form>

                                <Grid container item md={12} xs={12} spacing={4}>
                                    <Grid item md={6} xs={12}>
                                        <Input
                                            label="Nombre de la relación"
                                            name="name"
                                            type="text"
                                            required={true}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <Select
                                            label="Tipo de relación"
                                            name="criterio"
                                            data={Data.CriteriaList}
                                            required={true}
                                            onChange={event => {
                                                rfBaseListRefresh(values.idEnterprise, values.idProductFamily, event.target.value, setFieldValue)
                                                handleChange(event)
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container item md={12} xs={12} spacing={4}>
                                    <Grid item md={6} xs={12}>
                                        <DatePicker
                                            label="Fecha de registro"
                                            name="date"
                                            required={true}
                                            minDate={new Date('1980-01-01')}
                                            maxDate={new Date()}
                                            value={values.date}
                                            onChange={value => setFieldValue("date", value)}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <Select
                                            label="Empresa"
                                            name="idEnterprise"
                                            data={enterpriseList}
                                            required={true}
                                            onChange={(event) => {
                                                resourceTypeRefresh(event.target.value)
                                                setFieldValue("idProductFamily", "");

                                                if (event.target.value !== "") {
                                                    if (loading)
                                                        loading.handleOpen();

                                                    ProductFamilyRequest.getProductFamilyList(event.target.value).then((pfListResult) => {

                                                        setProductFamilyList(pfListResult)

                                                        ResourceFamilyRequest.getResourceFamilyList(event.target.value).then((rfListResult) => {

                                                            setResourceFamilyList(rfListResult)

                                                            if (loading)
                                                                loading.handleClose();

                                                        }).catch((error) => {
                                                            if (loading)
                                                                loading.handleClose();
                                                            alert.error(error.message)
                                                        });

                                                    }).catch((error) => {
                                                        if (loading)
                                                            loading.handleClose();
                                                        alert.error(error.message)
                                                    });

                                                } else {
                                                    setProductFamilyList([])
                                                    setProductList([])
                                                    setProductSelected([])
                                                    setResourceFamilyList([])
                                                    setResourceFamilyBaseList([])
                                                    setResourceFamilyRelationList([])
                                                }
                                                handleChange(event)
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container item md={12} xs={12} spacing={4}>

                                    <Grid item md={6} xs={12}>
                                        <Select
                                            label="Familia de productos"
                                            name="idProductFamily"
                                            data={productFamilyList}
                                            required={true}
                                            onChange={(event) => {
                                                rfBaseListRefresh(values.idEnterprise, event.target.value, values.criterio, setFieldValue)

                                                if (event.target.value !== "") {
                                                    if (loading)
                                                        loading.handleOpen();

                                                    ProductRequest.getAllProductList(event.target.value).then((prductListResult) => {

                                                        setProductList(prductListResult)
                                                        setProductSelected([])
                                                        if (loading)
                                                            loading.handleClose()

                                                    }).catch(error => {
                                                        if (loading)
                                                            loading.handleClose()
                                                        alert.error(error.message)
                                                    })

                                                } else {
                                                    setProductList([])
                                                    setProductSelected([])
                                                }
                                                handleChange(event)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <Select
                                            label="Familia de recurso base"
                                            name="idResourceFamily"
                                            data={resourceFamilyBaseList}
                                            required={values.criterio === "Envase terciario" && values.idProductFamily !== ''}
                                            disabled={values.criterio !== "Envase terciario" || values.idProductFamily === ''}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container item md={12} xs={12} spacing={4}>
                                    <Grid item md={6} xs={12}>
                                        <Input
                                            label="Cantidad base de referencia"
                                            name="baseCount"
                                            type="number"
                                            required={true}
                                            InputProps={{
                                                inputProps: {
                                                    min: 0, max: 1000000, step: 1
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                <div className={classes.TablePaddingTop}>
                                    <DataTable
                                        columns={[
                                            { title: "UEB", field: "ueb", cellStyle: cellStyle },
                                            { title: "Código", field: "codigo", cellStyle: cellStyle },
                                            { title: "Producto", field: "name", cellStyle: cellStyle },
                                            { title: "CUP", field: "cup", cellStyle: cellStyle },
                                            { title: "Mercado", field: "market", cellStyle: cellStyle },
                                        ]}
                                        data={productList}
                                        options={{
                                            toolbar: false,
                                            selection: true,
                                        }}
                                        onSelectionChange={(rows) => {
                                            let rowsSelected = [];
                                            rows.forEach(element => {
                                                rowsSelected.push({ id: element.id })
                                            });
                                            setProductSelected(rowsSelected)
                                        }}
                                    />
                                </div>

                                <div className={classes.TablePaddingTop}>
                                    <DataTable
                                        tableRef={tableResourceFamilyRef}
                                        title='Familias de recursos'
                                        columns={[
                                            { title: "Empresa", field: "enterprise", cellStyle: cellStyle, tableData: { filterValue: resourceFamilyFilter.enterprise, } },
                                            { title: "Familia de recurso", field: "name", cellStyle: cellStyle, tableData: { filterValue: resourceFamilyFilter.name, } },
                                        ]}
                                        data={resourceFamilyList}
                                        options={{
                                            toolbar: false,
                                            filtering: true,
                                        }}
                                        onFilterChange={(columns) => {

                                            if (columns.length > 0) {
                                                for (let i = 0; i < columns.length; i++) {
                                                    resourceFamilyFilter[columns[i]['column']['field']] = columns[i]['value']
                                                }
                                                setResourceFamilyFilter(resourceFamilyFilter)
                                            } else {
                                                setResourceFamilyFilter(filters)
                                            }

                                        }}
                                        onOrderChange={(columnId, direction) => {
                                            orderedColumnId = columnId
                                            orderDirection = direction
                                        }}
                                        onChangePage={(pageNo, pageSize) => {
                                            page = pageNo
                                        }}
                                        actions={[
                                            {
                                                icon: tableIcons.Visibility,
                                                tooltip: 'Ver detalles',
                                                onClick: (event, rowData) => {
                                                    modelResource.handleOpen({
                                                        idResourceFamily: rowData.id,
                                                        enterprise: rowData.enterprise,
                                                        name: rowData.name
                                                    });
                                                },
                                            },
                                            {
                                                icon: tableIcons.Add,
                                                tooltip: 'Agregar',
                                                onClick: (event, rowData) => {
                                                    let resourceFamilyRelation = {
                                                        idResourceFamily: rowData.id,
                                                        enterprise: rowData.enterprise,
                                                        name: rowData.name,
                                                    }

                                                    let list = [...resourceFamilyRelationList]

                                                    if (!resourceFamilyRelationList.find(item => item.idResourceFamily === resourceFamilyRelation.idResourceFamily)) {
                                                        list.push(resourceFamilyRelation);
                                                        alert.success('La familia de recursos: "' + rowData.name + '" ha sido agregada correctamente a la relación.')
                                                    } else
                                                        alert.show('La familia de recursos: "' + rowData.name + '" ya ha sido agregada anteriormente.', { type: 'warning', })


                                                    setResourceFamilyRelationList(list)

                                                },
                                            }

                                        ]}
                                    />
                                </div>

                                <div className={classes.TablePaddingTop}>
                                    <DataTable
                                        title="Familias de recursos agregadas"
                                        columns={[
                                            { title: "Empresa", field: "enterprise", cellStyle: cellStyle, editable: 'never' },
                                            { title: "Nombre de la familia", field: "name", cellStyle: cellStyle, editable: 'never' },
                                            // { title: "Tipo de recurso", field: "resourceType", cellStyle: cellStyle, editable: 'never' },
                                            {
                                                title: "Tipo de recurso", field: "idType", cellStyle: cellStyle,
                                                lookup: respurceTypeObject,
                                                editComponent: props => (
                                                    <DataTableSelect
                                                        filterName={"idEnterprise"}
                                                        filter={values.idEnterprise}
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
                                                        value={props.value || ''}
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
                                        data={resourceFamilyRelationList}
                                        actions={[
                                            {
                                                icon: tableIcons.Visibility,
                                                tooltip: 'Ver detalles',
                                                onClick: (event, rowData) => {
                                                    modelResource.handleOpen({
                                                        idResourceFamily: rowData.idResourceFamily,
                                                        enterprise: rowData.enterprise,
                                                        name: rowData.name
                                                    });
                                                },
                                            },
                                        ]}
                                        editable={{
                                            onRowUpdate: (newData, oldData) =>
                                                new Promise((resolve, reject) => {
                                                    setTimeout(() => {

                                                        resourceFamilyRelationSchema.validate(newData).then((value) => {
                                                            let list = [...resourceFamilyRelationList]
                                                            list.splice(oldData.tableData.id, 1, value);
                                                            setResourceFamilyRelationList(list)
                                                            alert.success('La familia de recursos: "' + value.name + '" se ha editado correctamente.')
                                                            resolve();
                                                        }).catch(function (err) {
                                                            err.errors.map(item => alert.show(item, { type: 'warning', }))
                                                            reject();
                                                        });

                                                    }, 1000)
                                                }),
                                            onRowDelete: (oldData) =>
                                                new Promise((resolve, reject) => {
                                                    setTimeout(() => {
                                                        let list = [...resourceFamilyRelationList]
                                                        list.splice(oldData.tableData.id, 1);
                                                        setResourceFamilyRelationList(list)
                                                        alert.success('La familia de recursos: "' + oldData.name + '" se ha eliminado correctamente.')
                                                        resolve();
                                                    }, 1000)
                                                }),
                                        }}
                                    />
                                </div>

                                <div className={classes.formGroupButtons}>
                                    <Button variant="contained" onClick={() => { props.history.goBack() }} style={{ margin: '0.25rem' }}>Cerrar</Button>
                                    <Button variant="contained" color="primary" onClick={handleSubmit} style={{ margin: '0.25rem' }}>Guardar</Button>
                                </div>

                            </Form>
                        )}
                    </Formik>
                </div >
            </div >
        </div >
    );

}

export default RelationForm;