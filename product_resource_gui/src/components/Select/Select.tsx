import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import ItenModel from './ItemModel';
import Attribute from '../AttributeModel/AttributeModel';
import Validator from '../Validator/Validate';

interface Props {
    attribute: Attribute;
    data: ItenModel[];
    onChange;
    disabled?: boolean;
}

const CustomSelect = (props: Props) => {

    const updateElement = (value) => {
        let attribute = { ...props.attribute }
        attribute.value = value;
        attribute.valid = Validator(attribute.rules, value);
        attribute.touched = true;
        props.onChange(attribute);
    }

    return (
        <FormControl
            fullWidth={true}
            error={!props.attribute.valid && props.attribute.touched}
            required={props.attribute.rules['required']}
            disabled={props.disabled}
            >
            <InputLabel id={props.attribute.id + "-label"}>{props.attribute.label}</InputLabel>
            <Select
                id={props.attribute.id + "-select"}
                labelId={props.attribute.id + "-label"}
                value={props.attribute.value}
                onChange={event => updateElement(event.target.value)}
            >
                <MenuItem key="" value="">
                    <em>None</em>
                </MenuItem>
                {props.data && props.data.map(item => {
                    return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>;
                })}
            </Select>
            {(!props.attribute.valid && props.attribute.touched) && <FormHelperText>{props.attribute.message}</FormHelperText>}
        </FormControl>
    );
}

export default CustomSelect;