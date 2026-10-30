import React, { useEffect, useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useAlert } from 'react-alert';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { useParams } from 'react-router-dom';

import Select from '../../components/Select/Select.jsx';
import Input from '../../components/Input/Input.jsx'
import DataTable from '../../components/DataTable/DataTable.tsx';
import Backdrop from './../../components/Backdrop/Backdrop.tsx'
import handlerError from './../../components/HandlerError/HandlerError.jsx'
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.jsx'


import * as PrimaryRequest from '../../service/actions/PrimaryRequest';
import * as ResourceFamilyRequest from '../../service/actions/ResourceFamilyRequest';
import * as ResourceRequest from '../../service/actions/ResourceRequest';
import * as MistralRequest from '../../service/actions/MistralRequest';

import classes from './../../styles/Main.css';
import { tableIcons } from '../../styles/TableIcons';


let loading = null;

let orderedColumnId = -1
let orderDirection = ""
let page = 0

const ResourceFamilyForm = props => {


    const alert = useAlert()
    const { id } = useParams();

    const cellStyle = { padding: '8px' }

    const tableResourceRef = React.createRef();
    const tableResourceAddedRef = React.createRef();

    let initialValues = {
        name: '',
        idEnterprise: '',
        storage: '',
        codUeb: '',
        search: '',
    };

    let filters = {
        UEB: "",
        STORAGE: "",
        DESCRIPCION: "",
        REFERENCIA: "",
        CANTIDAD: "",
        UM: "",
    }

    const [formValues, setValues] = useState(initialValues)
    const [enterpriseList, setEnterpriseList] = useState([]);
    const [uebList, setUebList] = useState([]);
    const [storageList, setStorageList] = useState([]);
    const [resourceList, setResourceList] = useState([]);

    const [[codUeb, storage, search], setSearch] = useState(["", "", ""]);
    const [resourceAddedList, setResourceAddedList] = useState([]);
    const [resourceFilter, setResourceFilter] = useState(filters);

    const resourceListSchema = Yup.array().min(1, "Debe agregar al menos un recurso.")

    useEffect(() => {

        if (loading)
            loading.handleOpen();
        PrimaryRequest.getEnterprises().then((enterpriseListResult) => {

            setEnterpriseList(enterpriseListResult);

            if (id !== undefined) {
                ResourceFamilyRequest.getResourceFamily(id).then(resourceFamily => {

                    setValues({
                        name: resourceFamily.name,
                        idEnterprise: resourceFamily.idEnterprise,
                        storage: '',
                        codUeb: '',
                        search: '',
                    })

                    PrimaryRequest.getUEBs(resourceFamily.idEnterprise).then((uebListResult) => {

                        setUebList(uebListResult);

                        ResourceRequest.getAllResourceList(id)
                            .then((resourceAddedListResult) => {

                                setResourceAddedList(resourceAddedListResult);
                                if (loading)
                                    loading.handleClose();

                            }).catch(error => {
                                alert.error(error.message);
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
                searchResource();
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [codUeb, storage, search]);

    const searchResource = () => {

        if (codUeb !== '' && storage !== '') {

            if (loading)
                loading.handleOpen();

            MistralRequest.getMistral(codUeb, storage, search).then((resourceListResult) => {

                resourceListResult.map(item => {
                    item['STORAGE'] = storage;
                    item['CODUEB'] = codUeb;
                    item['UEB'] = findUeb();
                    return item
                })
                orderedColumnId = -1
                orderDirection = ""
                setResourceList(resourceListResult)
                if (loading)
                    loading.handleClose();

            }).catch(error => {
                if (loading)
                    loading.handleClose();
                alert.error(error.message);
            });

        } else {
            alert.show("Seleccione una empresa, una UEB y un almacén de Mistral para buscar recursos.", { type: 'warning', })
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
        tableResourceRef.current.onChangeOrder(orderedColumnId, orderDirection)
        tableResourceRef.current.onChangePage(undefined, page)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resourceList])

    const submit = async (values, { setSubmitting, setErrors }) => {

        values['id'] = id;
        let valid = await resourceListSchema.isValidSync(resourceAddedList)

        if (valid) {
            values['resources'] = resourceAddedList;
            if (id === undefined) {

                ResourceFamilyRequest.createResourceFamily(values).then(() => {
                    props.history.goBack()
                    alert.success("Se ha creado la familia de recursos correctamente.")
                }).catch(error => {
                    handlerError(error, setErrors, alert, "Ha ocurrido un error al intentar insertar la familia de recursos.")
                    setSubmitting(false);
                });

            } else {

                ResourceFamilyRequest.updateResourceFamily(values).then(() => {
                    props.history.goBack()
                    alert.success("Se ha editado la familia de recursos correctamente.")
                }).catch(error => {
                    handlerError(error, setErrors, alert, "Ha ocurrido un error al intentar editar la familia de recursos.")
                    setSubmitting(false);
                });

            }

        } else {
            resourceListSchema.validate(resourceAddedList).catch(function (err) {
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
                        { path: "/resource_family", name: "Familia de recursos" },
                    ]}
                    name={id === undefined ? "Crear nueva familia" : `Editar familia: "${formValues.name}"`}
                />

                <div className={classes.form}>

                    <Formik
                        enableReinitialize
                        initialValues={formValues}
                        validationSchema={Yup.object({
                            name: Yup.string().required('Nombre de la familia es un atribito requerido.'),
                            idEnterprise: Yup.number().required('Empresa es un atribito requerido.'),
                        })}
                        onSubmit={submit}
                    >
                        {({ values, handleChange, handleSubmit, setFieldValue }) => (
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
                                                setFieldValue("storage", "");
                                                if (event.target.value !== "") {
                                                    PrimaryRequest.getUEBs(event.target.value).then((uebListResult) => {
                                                        setUebList(uebListResult);
                                                    }).catch((error) => {
                                                        alert.error(error.message);
                                                    });

                                                } else {
                                                    setUebList([]);
                                                }
                                                setStorageList([]);
                                                handleChange(event)
                                            }}
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
                                                setFieldValue("storage", "");
                                                if (event.target.value !== "") {
                                                    PrimaryRequest.getSources(values.idEnterprise, event.target.value).then((storageListResult) => {
                                                        setStorageList(storageListResult);
                                                    }).catch((error) => {
                                                        alert.error(error.message);
                                                    });

                                                } else {
                                                    setStorageList([]);
                                                }
                                                setSearch([event.target.value, storage, search])
                                                handleChange(event)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <Select
                                            label="Almacén Mistral"
                                            name="storage"
                                            data={storageList}
                                            onChange={(event) => {
                                                setSearch([codUeb, event.target.value, search])
                                                handleChange(event)
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container item md={12} xs={12} spacing={4}>
                                    <Grid item md={6} xs={12}>
                                        <div style={{ display: 'flex' }}>
                                            <Input
                                                label=" "
                                                name="search"
                                                type="text"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                                                }}
                                                placeholder={"CUP o nomb. del recurso"}
                                                onChange={(event) => {
                                                    setSearch([codUeb, storage, event.target.value])
                                                    handleChange(event)
                                                }}
                                                style={{ paddingRight: 16 }}
                                            />
                                            <Grid className={classes.formSeachrButton}>
                                                <Button variant="outlined" color="primary" onClick={searchResource}><Search /></Button>
                                            </Grid>
                                        </div>
                                    </Grid>
                                </Grid>

                                <div className={classes.TablePaddingTop}>
                                    <DataTable
                                        tableRef={tableResourceRef}
                                        columns={[
                                            { title: "UEB", field: "UEB", cellStyle: cellStyle, tableData: { filterValue: resourceFilter.UEB, } },
                                            { title: "Almacén Mistral", field: "STORAGE", cellStyle: cellStyle, tableData: { filterValue: resourceFilter.STORAGE, } },
                                            { title: "Recurso", field: "DESCRIPCION", cellStyle: cellStyle, tableData: { filterValue: resourceFilter.DESCRIPCION, } },
                                            { title: "Código", field: "REFERENCIA", cellStyle: cellStyle, tableData: { filterValue: resourceFilter.REFERENCIA, } },
                                            {
                                                title: "Existencia en Mistral", field: "CANTIDAD", cellStyle: cellStyle, tableData: { filterValue: resourceFilter.CANTIDAD, },
                                                render(rowData) {
                                                    return rowData.CANTIDAD + " " + rowData.UM;
                                                },
                                                customFilterAndSearch: (term, rowData) => (rowData.CANTIDAD + " " + rowData.UM).toLowerCase().includes(term.toLowerCase())
                                            },
                                            // { title: "Unidad de medida", field: "UM", cellStyle: cellStyle, tableData: { filterValue: resourceFilter.UM, } },
                                        ]}
                                        data={resourceList}
                                        options={{
                                            toolbar: false,
                                            filtering: true,
                                        }}
                                        onFilterChange={(columns) => {

                                            if (columns.length > 0) {
                                                for (let i = 0; i < columns.length; i++) {
                                                    resourceFilter[columns[i]['column']['field']] = columns[i]['value']
                                                }
                                                setResourceFilter(resourceFilter)
                                            } else {
                                                setResourceFilter(filters)
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
                                                let resource = {
                                                    codUeb: rowData.codUeb !== undefined ? rowData.codUeb : values.codUeb,
                                                    ueb: rowData.ueb !== undefined ? rowData.ueb : findUeb(),
                                                    storage: rowData.storage !== undefined ? rowData.storage : rowData.STORAGE,
                                                    name: rowData.DESCRIPCION,
                                                    codigo: rowData.REFERENCIA,
                                                    mistralCount: rowData.CANTIDAD + " " + rowData.UM,
                                                }

                                                let listAdded = [...resourceAddedList]

                                                // eslint-disable-next-line
                                                if (!listAdded.find(item => item.codUeb == resource.codUeb && item.storage == resource.storage && item.codigo == resource.codigo))
                                                    listAdded.push(resource);

                                                let index = resourceList.indexOf(rowData);
                                                let list = [...resourceList]
                                                list.splice(index, 1);

                                                setResourceList(list)

                                                setResourceAddedList(listAdded)
                                            },
                                        }]}
                                    />

                                </div>

                                <div className={classes.TablePaddingTop}>
                                    <DataTable
                                        tableRef={tableResourceAddedRef}
                                        columns={[
                                            { title: "UEB", field: "ueb", cellStyle: cellStyle },
                                            { title: "Almacén Mistral", field: "storage", cellStyle: cellStyle },
                                            { title: "Recurso agregado", field: "name", cellStyle: cellStyle },
                                            { title: "Código", field: "codigo", cellStyle: cellStyle },
                                            { title: "Existencia en Mistral", field: "mistralCount", cellStyle: cellStyle, },
                                            // { title: "Unidad de medida", field: "measureUnit", cellStyle: cellStyle },
                                        ]}
                                        data={resourceAddedList}
                                        options={{
                                            toolbar: false,
                                        }}
                                        actions={[{
                                            icon: tableIcons.Minus,
                                            tooltip: 'Eliminar',
                                            onClick: (event, rowData) => {
                                                let resource = {
                                                    CODUEB: rowData.codUeb,
                                                    UEB: rowData.ueb,
                                                    STORAGE: rowData.storage,
                                                    codUeb: rowData.codUeb,
                                                    ueb: rowData.ueb,
                                                    storage: rowData.storage,
                                                    DESCRIPCION: rowData.name,
                                                    REFERENCIA: rowData.codigo,
                                                    CANTIDAD: rowData.mistralCount.split(" ")[0],
                                                    UM: rowData.mistralCount.split(" ")[1],
                                                }

                                                let list = [...resourceList]
                                                list.push(resource);

                                                let index = resourceAddedList.indexOf(rowData);
                                                let listAdded = [...resourceAddedList]
                                                listAdded.splice(index, 1);

                                                setResourceList(list)

                                                setResourceAddedList(listAdded)
                                            },
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
        </div>
    );

}
export default ResourceFamilyForm;