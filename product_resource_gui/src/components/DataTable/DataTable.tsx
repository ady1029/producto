
import React from 'react';
import MaterialTable from 'material-table';
import { tableIcons } from '../../styles/TableIcons';

interface Props {
  columns: any[];
  data;
  title: string;
  options: Object;
}

const DataTable = (props: Props) => {


  return (
    <MaterialTable
      {...props}
      icons={tableIcons}
      columns={props.columns}
      data={props.data}
      title={props.title}
      options={{
        ...props.options,
        exportDelimiter: ';',
        actionsColumnIndex: -1,
        search: false,
        headerStyle: {
          padding: '8px',
          fontWeight: "bold",
        },
        filterCellStyle: {
          padding: '8px',
        },
        maxBodyHeight: '800px',
        // pageSize: 5,
        // pageSizeOptions: [5, 10, 20],
      }}
      localization={{
        header: {
          actions: 'Acciones'
        },
        body: {
          emptyDataSourceMessage: 'No hay registros que mostrar',
          addTooltip: 'Agregar',
          editTooltip: 'Editar',
          deleteTooltip: 'Eliminar',
          editRow: {
            deleteText: '¿Está seguro que desea eliminar esta fila?',
            cancelTooltip: 'Cancelar',
            saveTooltip: 'Aceptar'
          }
        },
        pagination: {
          labelRowsSelect: 'filas',
          firstTooltip: 'Primera página',
          previousTooltip: 'Página anterior',
          nextTooltip: 'Próxima página',
          lastTooltip: 'Última página',
          labelDisplayedRows: '{from}-{to} de {count}',
        },
        toolbar: {
          searchTooltip: 'Buscar',
          searchPlaceholder: 'Buscar',
          addRemoveColumns: 'Agregar o eliminar columnas',
          showColumnsTitle: 'Mostrar columnas',
          showColumnsAriaLabel: 'Mostrar columnas',
          exportTitle: 'Exportar',
          exportCSVName: 'Exportar como CSV',
          exportPDFName: 'Exportar como PDF',
          nRowsSelected: '{0} fila(s) seleccionada(s)'
        },
        grouping: {
          placeholder: "Arrastra los encabezados de las columnas aquí para agrupar",
          groupedBy: "Agrupar por:"
        }
      }}
      style={{
        boxShadow: '0px 0px 1px -2px rgba(0,0,0,0.2), 0px 0px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)'
      }}
    />

  );


}

export default DataTable;
