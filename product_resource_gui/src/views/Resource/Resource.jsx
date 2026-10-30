import React, { useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import Button from '@material-ui/core/Button';
// import Moment from 'moment';

import Backdrop from './../../components/Backdrop/Backdrop.tsx'
import DataTable from '../../components/DataTable/DataTable.tsx';

import * as ResourceRequest from '../../service/actions/ResourceRequest';
import { Typography } from '@material-ui/core';

let loading = null;
const Resource = props => {

    const cellStyle = { padding: '8px' }

    const alert = useAlert()

    var [[idResourceFamily, enterprise, name, resources], setDetails] = useState([
        props.parse.idResourceFamily,
        props.parse.enterprise,
        props.parse.name,
        []
    ])

    useEffect(() => {

        if (loading)
            loading.handleOpen();
        ResourceRequest.getAllResourceList(idResourceFamily)
            .then((resources) => {
                setDetails([idResourceFamily, enterprise, name, resources])
                if (loading)
                    loading.handleClose();
            }).catch(error => {
                alert.error(error.message);
                if (loading)
                    loading.handleClose();
            });


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idResourceFamily])


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
                <Typography variant="h6" gutterBottom>{enterprise} {name}</Typography>

                <DataTable
                    columns={[
                        { title: "UEB", field: "ueb", cellStyle: cellStyle },
                        { title: "Almacén Mistral", field: "storage", cellStyle: cellStyle },
                        { title: "Nombre del recurso", field: "name", cellStyle: cellStyle },
                        { title: "Código del recurso", field: "codigo", cellStyle: cellStyle },
                        { title: "Existencia en Mistral", field: "mistralCount", cellStyle: cellStyle },
                    ]}
                    data={resources}
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

export default Resource;