import React, { useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import Button from '@material-ui/core/Button';
// import Moment from 'moment';

import Backdrop from './../../components/Backdrop/Backdrop.tsx'
import DataTable from '../../components/DataTable/DataTable.tsx';

import * as MistralRequest from '../../service/actions/MistralRequest';
import { Typography } from '@material-ui/core';

let loading = null;
const ResourceDetails = props => {

    const cellStyle = { padding: '8px' }

    const alert = useAlert()

    var [[codUeb, storage, name, codigo, mu, resourceDetails], setDetails] = useState([
        props.parse.codUeb,
        props.parse.storage,
        props.parse.name,
        props.parse.codigo,
        props.parse.mu,
        []
    ])

    useEffect(() => {

        if (loading)
            loading.handleOpen();
        MistralRequest.getMistral(codUeb, storage, codigo, 1).then((resourceDetails) => {
            setDetails([codUeb, storage, name, codigo, mu, resourceDetails])
            if (loading)
                loading.handleClose();
        }).catch(error => {
            alert.error(error.message);
            if (loading)
                loading.handleClose();
        });


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [codUeb, storage, name, codigo, mu])


    return (
        <>
            <Backdrop ref={el => {
                loading = el;
            }} />
            <div style={{
                padding: '10px',
                borderRadius: 4,
                boxShadow: '0px 0px 1px -2px rgba(0,0,0,0.2), 0px 0px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)'
            }}>
                <Typography variant="h6" gutterBottom>{props.parse.ueb} {name} - {codigo}</Typography>

                <DataTable
                    columns={[
                        { title: "Almacén", field: "ALMACEN", cellStyle: cellStyle, },
                        { title: "Área", field: "CODAREA", cellStyle: cellStyle, },
                        { title: "No. Muestreo", field: "NO_MUESTREO", cellStyle: cellStyle, },
                        {
                            title: "Fabricación", field: "FECHA_FAB", cellStyle: cellStyle, grouping: false, render(h) {
                                // return Moment(h.FECHA_FAB, 'DD MMM YYYY HH:mm:ss:SSS', 'es').format('DD/MM/YYYY')
                                return h.FECHA_FAB !== null ? h.FECHA_FAB.slice(0, 11) : ""
                            },
                        },
                        {
                            title: "Caducidad", field: "FECHA_CAD", cellStyle: cellStyle, grouping: false, render(h) {
                                // return Moment(h.FECHA_CAD, 'DD MMM YYYY HH:mm:ss:SSS', 'es').format('MM/YYYY')
                                return h.FECHA_CAD !== null ? h.FECHA_CAD.slice(0, 11) : ""
                            },
                        },
                        {
                            title: "Vigencia", field: "FECHA_VIGENCIA", cellStyle: cellStyle, grouping: false, render(h) {
                                // return Moment(h.FECHA_VIGENCIA, 'DD MMM YYYY HH:mm:ss:SSS', 'es').format('MM/YYYY')
                                return h.FECHA_VIGENCIA !== null ? h.FECHA_VIGENCIA.slice(0, 11) : ""
                            },
                        },
                        { title: "Lote", field: "NO_LOTE", cellStyle: cellStyle, },
                        { title: "Origen", field: "Origen", cellStyle: cellStyle, },
                        { title: "Fabricante", field: "Fabricante", cellStyle: cellStyle, },
                        { title: "Cantidad", field: "CANTIDAD", cellStyle: cellStyle, grouping: false, },
                        {
                            title: "UM", cellStyle: cellStyle, render(h) {
                                return mu;
                            },
                            grouping: false
                        },
                    ]}
                    data={resourceDetails}
                    options={{
                        toolbar: false,
                        filtering: true,
                        grouping: true
                    }}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.75rem' }}>
                <Button variant="contained" onClick={() => { props.closeModal() }} style={{ margin: '0.25rem' }}>Cerrar</Button>
            </div>
        </>
    );
}

export default ResourceDetails;