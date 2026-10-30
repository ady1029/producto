import React, { useState } from 'react';
import DataTable from '../../components/DataTable/DataTable.tsx';

const ExistenceDetails = props => {

    const cellStyle = { padding: '8px' };
    const [resourceExistence] = useState(props.data.resourceExistence)

    return (
        <>
            <DataTable
                title={`Recursos de la familia: ${resourceExistence.resourceFamilyName} - Existencia: ${resourceExistence.existence.toFixed(3)} ${resourceExistence.measureUnit} `}
                columns={[
                    { title: "UEB", field: "ueb", cellStyle: cellStyle },
                    { title: "Almacén Mistral", field: "storage", cellStyle: cellStyle },
                    { title: "Nombre del recurso", field: "name", cellStyle: cellStyle },
                    { title: "Código del recurso", field: "codigo", cellStyle: cellStyle },
                    { title: "Existencia en Mistral", field: "mistralCount", cellStyle: cellStyle },
                ]}
                data={resourceExistence.resourceList}
                options={{
                    filtering: true,
                    pageSize: 10,
                    pageSizeOptions: [10]
                }}
            />
        </>
    )

}

export default ExistenceDetails;