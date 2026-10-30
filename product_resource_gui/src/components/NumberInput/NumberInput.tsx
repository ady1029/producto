import React from 'react';
import TextField from '@material-ui/core/TextField';
import Attribute from '../AttributeModel/AttributeModel';
import Validator from '../Validator/Validate';

interface Props {
    attribute: Attribute;
    onChange;
}

const NumberInput = (props: Props) => {

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
            type="number"
            id={props.attribute.id + "-input"}
            label={props.attribute.label}
            value={props.attribute.value || ""}
            onChange={event => updateElement(event.target.value)}
            fullWidth={true}
            InputProps={{
                inputProps: {
                    max: props.attribute.rules['max'], min: props.attribute.rules['min'], step: props.attribute.rules['step']
                }
            }}
            error={!props.attribute.valid && props.attribute.touched}
            required={props.attribute.rules['required']}
            helperText={!props.attribute.valid && props.attribute.touched ? props.attribute.label + " debe ser un valor válido." : ""}
        />
    );
}

export default NumberInput;