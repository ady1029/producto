import React from 'react';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { useHistory, withRouter } from 'react-router-dom';



const CustomBreadcrumbs = ({ links, name }) => {

    const history = useHistory();

    return (
        <div>
            <Breadcrumbs aria-label="breadcrumb">
                {links.map(item =>
                    <Link key={item.name} component="button" color="inherit" onClick={() => { history.push(item.path) }}>
                        <Typography>{item.name}</Typography>
                    </Link>
                )}
                <Typography color="textPrimary">{name}</Typography>
            </Breadcrumbs>
        </div >
    )

}
export default withRouter(CustomBreadcrumbs);
