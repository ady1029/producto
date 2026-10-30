import React, { useState } from 'react';
import { useAlert } from 'react-alert';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import Select from './../../components/Select/Select.tsx';
import Input from './../../components/Input/Input.tsx'
import Validator from './../../components/Validator/Validate';

import * as PrimaryRequest from '../../service/actions/PrimaryRequest';
import * as ResourceTypeRequest from '../../service/actions/ResourceTypeRequest';


const ResourceTypeForm = props => {

    const alert = useAlert()

    const idResourceType = props.parse.idResourceType;

    var [[isLoading, attributes, enterpriseList], setResourceType] = useState([
        true,
        {
            id: {
                value: undefined,
            },
            idEnterprise: {
                id: "idEnterprise",
                label: "Enterprise",
                value: "",
                valid: false,
                rules: {
                    required: true
                },
                touched: false
            },
            name: {
                id: "name",
                label: "Nombre",
                value: "",
                valid: false,
                rules: {
                    required: true
                },
                touched: false
            }
        }, []
    ]);

    if (isLoading) {

        PrimaryRequest.getEnterprises().then((enterpriseList) => {

            if (idResourceType !== -1) {
                ResourceTypeRequest.getResourceType(idResourceType)
                    .then(result => {

                        attributes.id.value = result.id;

                        attributes.idEnterprise.value = result.idEnterprise;
                        attributes.idEnterprise.valid = Validator(attributes.idEnterprise.rules, result.idEnterprise);

                        attributes.name.value = result.name;
                        attributes.name.valid = Validator(attributes.name.rules, result.name);

                        setResourceType([false, attributes, enterpriseList]);

                    }).catch((error) => {
                        alert.error(error.message)
                    });

            } else {
                attributes.name.value = "";
                attributes.name.valid = false;
                setResourceType([false, attributes, enterpriseList, []]);
            }
        }).catch((error) => {
            alert.error(error.message)
        });
    }

    const submit = () => {

        if (attributes.idEnterprise.valid && attributes.name.valid) {
            const data = {
                id: attributes.id.value,
                idEnterprise: attributes.idEnterprise.value,
                name: attributes.name.value,
            };
            if (idResourceType === -1) {

                ResourceTypeRequest.createResourceType(data).then(() => {
                    props.setChange("Se ha creado el tipo de recurso correctamente.");
                }).catch(error => {
                    alert.error(error.message)
                });

            } else {

                ResourceTypeRequest.createResourceType(data).then(() => {
                    props.setChange("Se ha editado el tipo de recurso correctamente.");
                }).catch(error => {
                    alert.error(error.message)
                });

            }

        } else {
            alert.show("Seleccione una empresa y escriba el nombre del tipo de recursos.", { type: 'warning', })
        }

    }

    return (
        <div>
            <Grid container spacing={4}>
                <Grid item md={6} xs={12}>
                    <Select
                        attribute={attributes.idEnterprise}
                        data={enterpriseList}
                        onChange={(attribute) => {
                            attributes.idEnterprise = attribute;
                            setResourceType([false, attributes, enterpriseList]);
                        }}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <Input
                        attribute={attributes.name}
                        onChange={(attribute) => {
                            attributes.name = attribute;
                            setResourceType([false, attributes, enterpriseList]);
                        }}
                    />
                </Grid>
            </Grid>


            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.75rem' }}>
                <Button variant="contained" onClick={() => { props.closeModal() }} style={{ margin: '0.25rem' }}>Cerrar</Button>
                <Button variant="contained" color="primary" style={{ margin: '0.25rem' }} onClick={submit}>Guardar</Button>
            </div>


        </div>
    );

}

export default ResourceTypeForm;