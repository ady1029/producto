import React from 'react';
import TextField from '@material-ui/core/TextField';
import Attribute from '../AttributeModel/AttributeModel';
import Validator from '../Validator/Validate';

interface Props {
    attribute: Attribute;
    onChange;
    required?: boolean
}

const CustomInput = (props: Props) => {

    const updateElement = (value) => {
        let attribute = { ...props.attribute }
        attribute.value = value;
        attribute.valid = Validator(attribute.rules, value);
        attribute.touched = true;
        props.onChange(attribute);
    }

    return (
        <TextField
            {...props}
            id={props.attribute.id + "-input"}
            label={props.attribute.label}
            value={props.attribute.value || ""}
            onChange={event => updateElement(event.target.value)}
            fullWidth={true}
            error={!props.attribute.valid && props.attribute.touched}
            required={props.attribute.rules['required']}
            helperText={!props.attribute.valid && props.attribute.touched ? props.attribute.label + " no puede estar vacío." : ""}

        />
    );
}

export default CustomInput;