import React, { useEffect, useState } from 'react';
import { TextField, Button, Grid } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useAlert } from 'react-alert';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
// import { TextField as TextFieldFormik } from 'formik-material-ui'
import { useParams } from 'react-router-dom';

import Select from '../../components/Select/Select.jsx';
import Input from '../../components/Input/Input.jsx'
import DataTable from '../../components/DataTable/DataTable.tsx';
import Backdrop from './../../components/Backdrop/Backdrop.tsx'
import handlerError from './../../components/HandlerError/HandlerError.jsx'
// import CheckBox from './../../components/CheckBox/CheckBox.tsx'
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.jsx'

import * as PrimaryRequest from '../../service/actions/PrimaryRequest';
import * as ProductFamilyRequest from '../../service/actions/ProductFamilyRequest';
import * as ProductRequest from '../../service/actions/ProductRequest';
import * as MistralRequest from '../../service/actions/MistralRequest';

import classes from './../../styles/Main.css';
import { tableIcons } from '../../styles/TableIcons';


let loading = null;

let orderedColumnId = -1;
let orderDirection = "";
let page = 0;

const ProductFamilyForm = props => {

    const alert = useAlert()
    const { id } = useParams();

    const cellStyle = { padding: '8px' }

    const tableProductRef = React.createRef();
    const tableProductAddedRef = React.createRef();

    let initialValues = {
        name: '',
        idEnterprise: '',
        format: '',
        lyophilized: '',
        priority: '',
        nationalDemand: '',
        planThisYear: '',
        planNextYear: '',
        reserve: '',
        atc: '',
        codUeb: '',
        search: '',
    };

    let filters = {
        UEB: "",
        DESCRIPCION: "",
        CUP: "",
        FORMA_FARMACEUTICA: "",
        MERCADO: "",
    }

    const [formValues, setValues] = useState(initialValues)
    const [enterpriseList, setEnterpriseList] = useState([]);
    const [uebList, setUebList] = useState([]);
    const [productList, setPorductList] = useState([]);
    const [[codUeb, search], setSearch] = useState(["", ""]);
    const [productAddedList, setPorductAddedList] = useState([]);
    const [productFilter, setProductFilter] = useState(filters);

    let [booleanList] = useState([
        { id: true, name: "Si" },
        { id: false, name: "No" },
    ]);

    let [atcList] = useState([
        { id: "Nivel 1", name: "Nivel 1" },
        { id: "Nivel 2", name: "Nivel 2" },
        { id: "Nivel 3", name: "Nivel 3" },
        { id: "NC", name: "NC" },
    ])

    const productSchema = Yup.object().shape({
        codigo: Yup.string().required('Código de produción es un atributo requerido.'),
    })

    const productListSchema = Yup.array().of(productSchema).min(1, "Debe agregar al menos un producto.")

    useEffect(() => {

        if (loading)
            loading.handleOpen();

        PrimaryRequest.getEnterprises().then((enterpriseListResult) => {

            setEnterpriseList(enterpriseListResult);

            if (id !== undefined) {
                ProductFamilyRequest.getProductFamily(id).then(productFamily => {

                    setValues({
                        name: productFamily.name,
                        idEnterprise: productFamily.idEnterprise,
                        format: productFamily.format === null ? '' : productFamily.format,
                        lyophilized: productFamily.lyophilized === null ? '' : productFamily.lyophilized,
                        priority: productFamily.priority === null ? '' : productFamily.priority,
                        nationalDemand: productFamily.nationalDemand === null ? '' : productFamily.nationalDemand,
                        planThisYear: productFamily.planThisYear === null ? '' : productFamily.planThisYear,
                        planNextYear: productFamily.planNextYear === null ? '' : productFamily.planNextYear,
                        reserve: productFamily.reserve === null ? '' : productFamily.reserve,
                        atc: productFamily.atc === null ? '' : productFamily.atc,
                        codUeb: '',
                        search: '',
                    })

                    PrimaryRequest.getUEBs(productFamily.idEnterprise).then((uebListResult) => {

                        setUebList(uebListResult);

                        ProductRequest.getAllProductList(id)
                            .then((productAddedListResult) => {

                                setPorductAddedList(productAddedListResult)
                                if (loading)
                                    loading.handleClose();

                            }).catch(error => {
                                alert.error(error.message)
                                if (loading)
                                    loading.handleClose();
                            });

                    }).catch((error) => {
                        alert.error(error.message);
                        if (loading)
                            loading.handleClose();
                    });

                }).catch((error) => {
                    alert.error(error.message);
                    if (loading)
                        loading.handleClose();
                });

            } else {
                if (loading)
                    loading.handleClose();
            }

        }).catch((error) => {
            alert.error(error.message);
            if (loading)
                loading.handleClose();
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
    }, [codUeb, search]);

    const searchProduct = () => {

        if (codUeb !== '') {
            loading.handleOpen();
            MistralRequest.getMistral(codUeb, "Producto", search)
                .then((productListResult) => {
                    productListResult.map(item => {
                        item['CODUEB'] = codUeb;
                        item['UEB'] = findUeb();
                        return item
                    })
                    orderedColumnId = -1
                    orderDirection = ""
                    setPorductList(productListResult);
                    if (loading)
                        loading.handleClose();
                }).catch(error => {
                    alert.error(error.message);
                });

        } else {
            alert.show("Seleccione una empresa y una UEB para buscar productos.", { type: 'warning', })
        }

    }

    function findUeb() {

        let ueb = uebList.find(item => item.id === codUeb)
        if (ueb !== undefined)
            return ueb.name
        else
            return "";
    }

    useEffect(() => {
        tableProductRef.current.onChangeOrder(orderedColumnId, orderDirection)
        tableProductRef.current.onChangePage(undefined, page)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productList])

    const submit = async (values, { setSubmitting, setErrors }) => {

        values['id'] = id;
        let valid = await productListSchema.isValidSync(productAddedList)

        if (valid) {

            values['products'] = productAddedList;
            if (id === undefined) {

                ProductFamilyRequest.createProductFamily(values).then(() => {
                    props.history.goBack()
                    alert.success("Se ha creado la familia de productos correctamente.")
                }).catch(error => {
                    handlerError(error, setErrors, alert, "Ha ocurrido un error al intentar insertar la familia de productos.")
                    setSubmitting(false);
                });

            } else {

                ProductFamilyRequest.updateProductFamily(values).then(() => {
                    props.history.goBack()
                    alert.success("Se ha editado la familia de productos correctamente.")
                }).catch(error => {
                    handlerError(error, setErrors, alert, "Ha ocurrido un error al intentar editar la familia de productos.")
                    setSubmitting(false);
                });

            }

        } else {

            productListSchema.validate(productAddedList).catch(function (err) {
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
            <div className={classes.container}>

                <Breadcrumbs
                    links={[
                        { path: "/", name: "Inicio" },
                        { path: "/product_family", name: "Familia de productos" },
                    ]}
                    name={id === undefined ? "Crear nueva familia" : `Editar familia: "${formValues.name}"`}
                />

                <div className={classes.form}>

                    <Formik
                        enableReinitialize
                        initialValues={formValues}
                        validationSchema={Yup.object({
                            name: Yup.string().required('Nombre de la familia es un atributo requerido.'),
                            idEnterprise: Yup.number().required('Empresa es un atributo requerido.'),
                            // format: Yup.string().required('Fromato es un atributo requerido.'),
                            // lyophilized: Yup.boolean().required('Fromato es un atributo requerido.'),
                            priority: Yup.number().required('Prioridad es un atributo requerido.').positive().integer("Prioridad debe ser entero.")
                                .min(1, "Prioridad debe ser mayor o igual que 1.").max(3, "Prioridad debe ser menor o igual que 3."),
                            nationalDemand: Yup.number().required('Demanda nacional (UF) es un atributo requerido.').positive().integer("Demanda nacional (UF) debe ser entero.")
                                .min(0, "Demanda nacional (UF) debe ser mayor o igual que 0.").max(100000000, "Demanda nacional (UF) debe ser menor o igual que 100000000."),
                            planThisYear: Yup.number().positive().integer("Plan de este año (UF) debe ser entero.")
                                .min(0, "Plan de este año (UF) debe ser mayor o igual que 0.").max(100000000, "Plan de este año (UF) debe ser menor o igual que 100000000."),
                            planNextYear: Yup.number().positive().integer("Plan del próximo año (UF) debe ser entero.")
                                .min(0, "Plan del próximo año (UF) debe ser mayor o igual que 0.").max(100000000, "Plan del próximo año (UF) debe ser menor o igual que 100000000."),
                            reserve: Yup.boolean().required('Reserva es un atributo requerido.'),
                        })}
                        onSubmit={submit}
                    >
                        {({ handleChange, handleSubmit, setFieldValue }) => (
                            <Form>
                                <Grid container item md={12} xs={12} spacing={4}>
                                    <Grid item md={6} xs={12}>
                                        <Input
                                            label="Nombre de la familia"
                                            name="name"
                                            type="text"
                                            required={true}
                                            fullWidth={true}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <Select
                                            label="Empresa"
                                            name="idEnterprise"
                                            data={enterpriseList}
                                            required={true}
                                            onChange={(event) => {
                                                setFieldValue("codUeb", "");
                                                if (event.target.value !== "") {
                                                    PrimaryRequest.getUEBs(event.target.value).then((uebListResult) => {
                                                        setUebList(uebListResult);
                                                    }).catch((error) => {
                                                        alert.error(error.message);
                                                    });

                                                } else {
                                                    setUebList([]);
                                                }
                                                handleChange(event)
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container item md={12} xs={12} spacing={4}>
                                    <Grid item md={6} xs={12}>
                                        <Input
                                            label="Formato"
                                            name="format"
                                            type="text"
                                        // required={true}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <Select
                                            label="Liofilizado"
                                            name="lyophilized"
                                            data={booleanList}
                                        // required={true}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container item md={12} xs={12} spacing={4}>
                                    <Grid item md={6} xs={12}>
                                        <Input
                                            label="Prioridad"
                                            name="priority"
                                            type="number"
                                            required={true}
                                            InputProps={{
                                                inputProps: {
                                                    max: 3, min: 1, step: 1
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <Input
                                            label="Demanda nacional (UF)"
                                            name="nationalDemand"
                                            type="number"
                                            required={true}
                                            InputProps={{
                                                inputProps: {
                                                    min: 0, max: 100000000, step: 1
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container item md={12} xs={12} spacing={4}>
                                    <Grid item md={6} xs={12}>
                                        <Input
                                            label="Plan de este año (UF)"
                                            name="planThisYear"
                                            type="number"
                                            InputProps={{
                                                inputProps: {
                                                    min: 0, max: 100000000, step: 1
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <Input
                                            label="Plan del próximo año (UF)"
                                            name="planNextYear"
                                            type="number"
                                            InputProps={{
                                                inputProps: {
                                                    min: 0, max: 100000000, step: 1
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container item md={12} xs={12} spacing={4}>
                                    <Grid item md={6} xs={12}>
                                        <Select
                                            label="Reserva"
                                            name="reserve"
                                            data={booleanList}
                                            required={true}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <Select
                                            label="ATC"
                                            name="atc"
                                            data={atcList}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container item md={12} xs={12} spacing={4}>
                                    <Grid item md={6} xs={12}>
                                        <Select
                                            label="UEB"
                                            name="codUeb"
                                            data={uebList}
                                            onChange={(event) => {
                                                setSearch([event.target.value, search])
                                                handleChange(event)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <div style={{ display: 'flex' }}>
                                            <Input
                                                label=" "
                                                name="search"
                                                type="text"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                                                }}
                                                placeholder={"CUP o nomb. del producto"}
                                                onChange={(event) => {
                                                    setSearch([codUeb, event.target.value])
                                                    handleChange(event)
                                                }}
                                                style={{ paddingRight: 16 }}
                                            />
                                            <Grid className={classes.formSeachrButton}>
                                                <Button variant="outlined" color="primary" onClick={searchProduct}><Search /></Button>
                                            </Grid>
                                        </div>
                                    </Grid>
                                </Grid>

                                <div className={classes.TablePaddingTop}>
                                    <DataTable
                                        tableRef={tableProductRef}
                                        columns={[
                                            { title: "UEB", field: "UEB", cellStyle: cellStyle, tableData: { filterValue: productFilter.UEB, } },
                                            { title: "Producto terminado", field: "DESCRIPCION", cellStyle: cellStyle, tableData: { filterValue: productFilter.DESCRIPCION } },
                                            { title: "CUP", field: "CUP", cellStyle: cellStyle, tableData: { filterValue: productFilter.CUP } },
                                            { title: "Forma de farmacéutica", field: "FORMA_FARMACEUTICA", cellStyle: cellStyle, tableData: { filterValue: productFilter.FORMA_FARMACEUTICA } },
                                            { title: "Mercado", field: "MERCADO", cellStyle: cellStyle, tableData: { filterValue: productFilter.MERCADO } },
                                        ]}
                                        data={productList}
                                        options={{
                                            toolbar: false,
                                            filtering: true,
                                        }}
                                        onFilterChange={(columns) => {

                                            if (columns.length > 0) {
                                                for (let i = 0; i < columns.length; i++) {
                                                    productFilter[columns[i]['column']['field']] = columns[i]['value']
                                                }
                                                setProductFilter(productFilter)
                                            } else {
                                                setProductFilter(filters)
                                            }

                                        }}
                                        onOrderChange={(columnId, direction) => {
                                            orderedColumnId = columnId
                                            orderDirection = direction
                                        }}
                                        onChangePage={(pageNo, pageSize) => {
                                            page = pageNo
                                        }}
                                        actions={[{
                                            icon: tableIcons.Add,
                                            tooltip: 'Agregar',
                                            onClick: (event, rowData) => {
                                                let product = {
                                                    codUeb: rowData.codUeb !== undefined ? rowData.codUeb : rowData.CODUEB,
                                                    ueb: rowData.ueb !== undefined ? rowData.ueb : rowData.UEB,
                                                    name: rowData.DESCRIPCION,
                                                    cup: rowData.CUP,
                                                    pharmaceuticShape: rowData.FORMA_FARMACEUTICA,
                                                    market: rowData.MERCADO,
                                                    codigo: rowData.codigo,
                                                }

                                                // eslint-disable-next-line
                                                if (productAddedList.find(item => item.codUeb == product.codUeb && item.cup == product.cup) === undefined)
                                                    productAddedList.push(product);

                                                let index = productList.indexOf(rowData);
                                                let list = [...productList]
                                                list.splice(index, 1);

                                                setPorductList(list)

                                                setPorductAddedList(productAddedList)
                                            },
                                        }]}
                                    />

                                </div>

                                <div className={classes.TablePaddingTop}>
                                    <DataTable
                                        tableRef={tableProductAddedRef}
                                        columns={[
                                            { title: "UEB", field: "ueb", cellStyle: cellStyle, editable: 'never' },
                                            {
                                                title: "Código de producción", field: "codigo", cellStyle: cellData => {
                                                    return ({
                                                        padding: '8px',
                                                        // backgroundColor: cellData === undefined || cellData === "" ? "#fde0ea" : "#fff",
                                                        // borderWidth: '2px',
                                                        // borderColor: cellData === undefined || cellData === "" ? "#f44336" : "#fff",
                                                    })
                                                },
                                                editComponent: props => {
                                                    // console.log(props)
                                                    return (
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
                                                }
                                            },
                                            { title: "Producto agregado", field: "name", cellStyle: cellStyle, editable: 'never' },
                                            { title: "CUP", field: "cup", cellStyle: cellStyle, editable: 'never' },
                                            // {title: "Forma de presentación", field: "pharmaceuticShape", cellStyle: cellStyle, editable: 'never' },
                                            { title: "Mercado", field: "market", cellStyle: cellStyle, editable: 'never' },
                                        ]}
                                        data={productAddedList}
                                        options={{
                                            toolbar: false,
                                        }}
                                        editable={{
                                            onRowUpdate: (newData, oldData) =>
                                                new Promise((resolve, reject) => {
                                                    setTimeout(() => {

                                                        productSchema.validate(newData).then((value) => {
                                                            let list = [...productAddedList]
                                                            list.splice(oldData.tableData.id, 1, value);
                                                            setPorductAddedList(list)
                                                            resolve();
                                                        }).catch(function (err) {
                                                            err.errors.map(item => alert.show(item, { type: 'warning', }))
                                                            reject();
                                                        });

                                                    }, 1000)
                                                }),
                                        }}
                                        actions={[{
                                            icon: tableIcons.Minus,
                                            tooltip: 'Eliminar',
                                            onClick: (event, rowData) => {
                                                let product = {
                                                    CODUEB: rowData.codUeb,
                                                    UEB: rowData.ueb,
                                                    codUeb: rowData.codUeb,
                                                    ueb: rowData.ueb,
                                                    DESCRIPCION: rowData.name,
                                                    CUP: rowData.cup,
                                                    FORMA_FARMACEUTICA: rowData.pharmaceuticShape,
                                                    MERCADO: rowData.market,
                                                    codigo: rowData.codigo,
                                                }
                                                let list = [...productList]
                                                list.push(product);

                                                let index = productAddedList.indexOf(rowData);
                                                productAddedList.splice(index, 1);

                                                setPorductList(list)

                                                setPorductAddedList(productAddedList)
                                            }
                                        }]}
                                    />
                                </div>

                                <div className={classes.formGroupButtons}>
                                    <Button variant="contained" onClick={() => { props.history.goBack() }} style={{ margin: '0.25rem' }}>Cerrar</Button>
                                    <Button variant="contained" color="primary" onClick={handleSubmit} style={{ margin: '0.25rem' }}>Guardar</Button>
                                </div>
                            </Form>
                        )}
                    </Formik>

                </div>
            </div>
        </div >
    );

}
export default ProductFamilyForm;