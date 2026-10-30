import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import { useField } from 'formik';

const CustomSelect = ({ label, data, ...props }) => {


    const [field, meta] = useField(props);

    // console.log("CustomSelect", label, data, props, field, meta)


    return (
        <FormControl
            {...props}

            fullWidth={true}
            error={meta.touched && meta.error !== undefined}
        >
            <InputLabel id={`${field.name}-select`}>{label}</InputLabel>
            <Select
                {...field}
                {...props}
                label={label}
                labelId={`${field.name}-select`}
            // value={meta.value}
            // onChange={props.handlerChange}
            >
                <MenuItem key="" value={""}><em>None</em></MenuItem>
                {data.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
            </Select>
            {meta.touched && meta.error ? <FormHelperText>{meta.error}</FormHelperText> : null}
        </FormControl>
    );
}

export default CustomSelect;