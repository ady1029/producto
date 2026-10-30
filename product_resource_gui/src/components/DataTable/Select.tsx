import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { FormControl } from '@material-ui/core';

const CustomSelect = (props) => {

    return (
        <FormControl
            fullWidth={true}>
            <Select
                value={props.value || ""}
                onChange={event => {
                    props.onChange(event)
                }}
            >
                <MenuItem key="" value="">
                    <em>None</em>
                </MenuItem>
                {props.data && props.data.filter(item => item[props.filterName] === props.filter).map(item => {
                    return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>;
                })}
            </Select>
        </FormControl >
    );
}

export default CustomSelect;