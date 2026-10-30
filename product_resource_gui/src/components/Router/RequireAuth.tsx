import React from 'react';
import { useAuth } from 'oidc-react';
import {
    Redirect,
} from "react-router-dom";

interface Props {
    children: JSX.Element;
    roles: string[];
}

const RequireAuth = (props: Props) => {
    let auth = useAuth();

    const isAuthenticated = auth && auth.userData;

    // console.log("userData: ", auth.userData);
    // console.log("roles: ", props.roles);
    // console.log(auth.userData?.profile?.groups.some(role => props.roles.some(r => r === role)));

    if (!isAuthenticated && !auth.userData?.profile?.groups.some(role => props.roles.some(r => r === role))) {
        
        console.log("not authenticated and not in roles");
        return <Redirect to="/" />
    }

    return props.children;
}

export default RequireAuth;