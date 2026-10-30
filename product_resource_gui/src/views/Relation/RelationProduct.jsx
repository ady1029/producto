import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { useAlert } from 'react-alert';

import Backdrop from './../../components/Backdrop/Backdrop.tsx'
import DataTable from '../../components/DataTable/DataTable.tsx';
// import Backdrop from '../../components/Backdrop/Backdrop.tsx';

import * as RelationRequest from '../../service/actions/RelationRequest';
import * as ProductRequest from '../../service/actions/ProductRequest';

let loading = null;

const RelationProduct = props => {

    const cellStyle = { padding: '8px' }

    const alert = useAlert();

    let [[idRelation, productList], setProductList] = useState([props.parse.idRelation, []])

    useEffect(() => {

        if (loading)
            loading.handleOpen();

        RelationRequest.getRelation(idRelation).then(relation => {

            ProductRequest.getAllProductList(relation.productFamily.id, -1).then((productListResp) => {

                productListResp.map((item, i) => {
                    let checked = false;
                    if (relation.products.find(prod => prod.id === item.id) !== undefined)
                        checked = true;
                    item['tableData'] = { id: i, checked: checked };
                    return item
                });

                setProductList([idRelation, productListResp])
                if (loading)
                    loading.handleClose();

            }).catch(error => {
                if (loading)
                    loading.handleClose();
                alert.error(error.message)
            });

        }).catch((error) => {
            if (loading)
                loading.handleClose();
            alert.error(error.message);
        });


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idRelation])

    return (
        <div>
            <Backdrop ref={el => {
                loading = el;
            }} />
            <DataTable
                title="Productos selecionados"
                columns={[
                    { title: "Producto", field: "name", cellStyle: cellStyle, width: 260, },
                    { title: "CUP", field: "cup", cellStyle: cellStyle },
                    { title: "Forma de presentación", field: "pharmaceuticShape", cellStyle: cellStyle },
                    { title: "Mercado", field: "market", cellStyle: cellStyle },
                ]}
                data={productList}
                options={{
                    exportButton: true,
                    selection: true,
                    selectionProps: rowData => ({
                        disabled: true,
                        // color: 'primary'
                    }),
                    showSelectAllCheckbox: false,
                    showTextRowsSelected: false,
                }}

            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.75rem' }}>
                <Button variant="contained" onClick={() => { props.closeModal() }} style={{ margin: '0.25rem' }}>Cerrar</Button>
            </div>
        </div>
    );
}

export default RelationProduct