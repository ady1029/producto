import React from 'react'
import { useAlert } from 'react-alert'
import * as Yup from 'yup';
import { useAuth } from 'oidc-react';

import DataTable from './../../components/DataTable/DataTable.tsx'
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.jsx'

import classes from './../../styles/Main.css'

import * as ProductionPlanRequest from '../../service/actions/ProductionPlanRequest'

const ProductionPlan = (props) => {

    let auth = useAuth();
    let isAdmin = auth.userData?.profile?.groups.some(g => g === "Internal/pr_admin");

    const alert = useAlert()

    const tableProductionPlanRef = React.createRef()

    const cellStyle = {
        padding: '8px',
        
    }

    const productionPlanSchema = Yup.object().shape({
        planThisYear: Yup.number().positive().integer("Plan de este año (UF) debe ser entero.")
            .min(0, "Plan de este año (UF) debe ser mayor o igual que 0.").max(100000000, "Plan de este año (UF) debe se menor o igual que 100000000."),
        planNextYear: Yup.number().positive().integer("Plan del próximo año (UF) debe ser entero.")
            .min(0, "Plan del próximo año (UF) debe ser mayor o igual que 0.").max(100000000, "Plan del próximo año (UF) debe se menor o igual que 100000000."),
    })


    return (
        <div className={classes.container}>
            <Breadcrumbs
                links={[
                    { path: "/", name: "Inicio" }
                ]}
                name="Planes de producción"
            />
            <div className={classes.TablePaddingTop}>
                <DataTable
                    tableRef={tableProductionPlanRef}
                    title="Planes de producción"
                    columns={[
                        { title: "Empresa", field: "enterprise", cellStyle: cellStyle, editable: 'never' },
                        { title: "Familia de producto", field: "name", cellStyle: cellStyle, editable: 'never' },
                        { title: "Plan de este año (UF)", field: "planThisYear", cellStyle: cellStyle, emptyValue: 0, type: "numeric", align: "left" },
                        { title: "Plan del próximo año (UF)", field: "planNextYear", cellStyle: cellStyle, emptyValue: 0, type: "numeric", align: "left" },
                    ]}
                    data={(query) => {
                        return new Promise((resolve, reject) => {
                            ProductionPlanRequest.getAllProductionPlan(query)
                                .then((result) => {
                                    resolve({
                                        data: result.content,
                                        page: result.pageable.pageNumber,
                                        totalCount: result.totalElements
                                    })
                                }).catch(error => {
                                    reject(error.message)
                                    alert.error(error.message)
                                });
                        })
                    }}
                    options={{
                        exportButton: true,
                        selectRow: true,
                        filtering: true,
                        pageSize: 10,
                        pageSizeOptions: [10, 20],
                    }}
                    // cellEditable={{
                    //     cellStyle: {},
                    //     onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                    editable={isAdmin ? {
                        onRowUpdate: (newData, oldData) => {
                            return new Promise((resolve, reject) => {
                            setTimeout(() => {
                                productionPlanSchema.validate(newData).then((value) => {
                                    ProductionPlanRequest.updateProductionPlan(value).then(() => {
                                        resolve();
                                        alert.success("Se ha editado el plan de producción correctamente.");
                                    }).catch(error => {
                                        reject(error.message)
                                        alert.error(error.message)
                                    });
                                }).catch(function (err) {
                                    err.errors.map(item => alert.show(item, { type: 'warning', }))
                                    reject();
                                });
                            }, 1000)
                        });
                        }
                    }: {}}
                />
            </div>
        </div>
    );
}
export default ProductionPlan;