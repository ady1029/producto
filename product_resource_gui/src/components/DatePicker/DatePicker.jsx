import React from 'react';
import {
    KeyboardDatePicker
} from '@material-ui/pickers';
import {
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import es from "date-fns/locale/es";
import { useField } from 'formik';


const CustomDatePicker = ({ label, ...props }) => {

    const [field, meta] = useField(props);

    return (
        <MuiPickersUtilsProvider
            utils={DateFnsUtils}
            locale={es}
        >
            <KeyboardDatePicker
                {...field}
                {...props}
                label={label}
                fullWidth={true}
                error={meta.touched && meta.error !== undefined}
                helperText={meta.touched && meta.error ? meta.error : null}
                id={`${field.name}-date`}
                variant="inline"
                format="yyyy-MM-dd"
                autoOk={true}
            />
        </MuiPickersUtilsProvider>
    );
}

export default CustomDatePicker;