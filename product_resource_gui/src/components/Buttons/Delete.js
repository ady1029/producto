import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import { IconButton } from '@material-ui/core';

const ColorButton = withStyles((theme) => ({
    root: {
        color: red[600],
        '&:hover': {
            color: red[800],
            backgroundColor: red[50],
        },
    },
}))(IconButton);

export default function Delete(props) {

    return (
        <div>
            <ColorButton variant="contained" color="primary" {...props}>
                {props.children}
            </ColorButton>
        </div>
    );
}