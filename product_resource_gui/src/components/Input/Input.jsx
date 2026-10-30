import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useField } from 'formik';



const CustomInput = ({ label, ...props }) => {

    const [field, meta] = useField(props);

    return (
        <TextField
            {...field}
            {...props}
            label={label}
            fullWidth={true}
            error={meta.touched && meta.error !== undefined}
            helperText={meta.touched && meta.error ? meta.error : null}
        />
    );
}

export default CustomInput;