import React from 'react';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import es from "date-fns/locale/es";
import Attribute from '../AttributeModel/AttributeModel';
import Validator from '../Validator/Validate';


interface Props {
    attribute: Attribute;
    onChange;
}

const CustomDatePicker = (props: Props) => {

    const updateElement = (value) => {
        let attribute = { ...props.attribute }
        attribute.value = value;
        attribute.valid = Validator(attribute.rules, value, 'date');
        attribute.touched = true;
        props.onChange(attribute);
    }

    return (
        <MuiPickersUtilsProvider
            utils={DateFnsUtils} locale={es}
        >
            <KeyboardDatePicker
                {...props}
                variant="inline"
                format="yyyy-MM-dd"
                minDate={props.attribute.rules.min}
                maxDate={props.attribute.rules.max}
                id={props.attribute.id + "-date"}
                label={props.attribute.label}
                value={props.attribute.value}
                onChange={date => updateElement(date)}
                fullWidth={true}
                error={!props.attribute.valid && props.attribute.touched}
                required={props.attribute.rules['required']}
                helperText={!props.attribute.valid && props.attribute.touched ? props.attribute.label + " no puede estar vacío." : ""}
                autoOk={true}
            />
        </MuiPickersUtilsProvider>
    );
}

export default CustomDatePicker;