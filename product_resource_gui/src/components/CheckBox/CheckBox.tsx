import { Checkbox, FormControlLabel } from '@material-ui/core';
import React from 'react';
import { ItenModelBoolean } from '../AttributeModel/AttributeModel';


interface Props {
    attribute: ItenModelBoolean;
    onChange;
}

const CustomCheckBox = (props: Props) => {

    const handler = (event) => {
        let attribute = { ...props.attribute }
        attribute.value = event.target.checked;
        props.onChange(attribute);
    }

    return (
        <FormControlLabel
            id={props.attribute.id + "-checkbox"}
            control={
                <Checkbox
                    checked={props.attribute.value}
                    onChange={handler}
                    color="primary"
                />
            }
            label={props.attribute.label}
        />
    );
}

export default CustomCheckBox;