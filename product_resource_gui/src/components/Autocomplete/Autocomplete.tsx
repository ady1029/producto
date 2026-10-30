import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Validator from '../Validator/Validate';
import { CircularProgress, FormControl, InputAdornment } from '@material-ui/core';
import { Search } from '@material-ui/icons';

interface Props {
    attribute: Attribute;
    options: Item[];
    onInputChange;
    onChange;
    disabled?: boolean;
    search: string;
}

class Attribute {
    id: string;
    label: string;
    placeholder: string;
    value: string;
    valid: boolean;
    touched: boolean;
    rules: Object[];
    loading: boolean;
}


interface Item {
    id: string;
    name: string;
}

// function sleep(delay = 0) {
//     return new Promise((resolve) => {
//         setTimeout(resolve, delay);
//     });
// }

const CustomAutocomplete = (props: Props) => {

    const [searchWaiting, setSearchWaiting] = React.useState(null);

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
        >
            <Autocomplete
                {...props}
                id={props.attribute.id + "-autocomplete"}
                disabled={props.disabled}
                options={props.options}
                onInputChange={(event, value, reason) => {
                    if (reason === 'input') {
                        if (searchWaiting)
                            clearTimeout(searchWaiting);
                        setSearchWaiting(setTimeout(() => {
                            props.onInputChange(value)
                        }, 1000));
                    }
                }}
                onChange={(event, value) => {
                    updateElement(value != null ? value.id : '')
                }}
                getOptionSelected={(option, value) => option.id === value.id}
                getOptionLabel={(option) => option.name}
                loading={props.attribute.loading}
                loadingText={"Cargando..."}
                noOptionsText={"No hay resultados que mostrar."}
                clearText={"Limpiar"}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        style={{paddingTop: 4}}
                        label={props.attribute.label}
                        placeholder={props.attribute.placeholder}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {props.attribute.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                            startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,

                        }}
                        error={!props.attribute.valid && props.attribute.touched}
                        required={props.attribute.rules['required']}
                        helperText={!props.attribute.valid && props.attribute.touched ? props.attribute.label + " no puede estar vacío." : ""}
                    />
                )}
            />
        </FormControl>
    );
}


export default CustomAutocomplete;