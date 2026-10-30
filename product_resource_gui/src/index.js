import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import {
  Provider as AlertProvider,
  positions,
  transitions
} from 'react-alert'
import Alert from '@material-ui/lab/Alert'

import Main from './views/Main/Main';
import ResourceType from './views/ResourceType/ResourceType';
import ProductFamily from './views/ProductFamily/ProductFamily'
import ProductFamilyForm from './views/ProductFamily/ProductFamilyForm'
import ResourceFamily from './views/ResourceFamily/ResourceFamily'
import ResourceFamilyForm from './views/ResourceFamily/ResourceFamilyForm'
import RelationForm from './views/Relation/RelationForm'
import Relation from './views/Relation/Relation'
import ProductByResource from './views/Report/ProductByResource'
import ResourceByProduct from './views/Report/ResourceByProduct'


import './index.css';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Theme from './styles/Theme';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import ToolBar from './components/ToolBar/ToolBar';
import ProductionPlan from './views/ProductionPlan/ProductionPlan';
import { AuthProvider } from 'oidc-react';
// import RequireAuth from './components/Router/RequireAuth.tsx';


var hist = createBrowserHistory();

const alertOptions = {
  // offset: '25px',
  timeout: 5000,
  transition: transitions.SCALE,
  containerStyle: {
    zIndex: 1102
  }
}

var buttonStyle = {
  marginLeft: '20px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  color: '#FFFFFF'
};

const AlertTemplate = ({ style, options, message, close }) => (
  <div style={style}>
    {options.type === 'info' && <Alert variant="filled" severity="info">{message}<button style={buttonStyle} onClick={close}>X</button></Alert>}
    {options.type === 'success' && <Alert variant="filled" severity="success">{message}<button style={buttonStyle} onClick={close}>X</button></Alert>}
    {options.type === 'error' && <Alert variant="filled" severity="error">{message}<button style={buttonStyle} onClick={close}>X</button></Alert>}
    {options.type === 'warning' && <Alert variant="filled" severity="warning">{message}<button style={buttonStyle} onClick={close}>X</button></Alert>}
  </div>
);

// const authority = process.env.NODE_ENV === 'development' ? process.env.OIDC_DISCOVERY : window.location.origin;

const oidcConfig = {
  onSignIn: (user) => {
    console.log('user signed in', user);
    window.location.href = window.location.origin;
  },
  onSignOut: () => {
    console.log('user signed out');
    // localStorage.clear();
    // sessionStorage.clear();
    // window.location.href = window.location.origin;
  },
  authority: process.env.OIDC_DISCOVERY, // https://is.aica.cu:9444/oauth2/oidcdiscovery
  clientId: process.env.CLIENT_ID,
  scope: process.env.SCOPE,
  redirectUri: window.location.origin,
  autoSignIn: false,
  automaticSilentRenew: true,
  // postLogoutRedirectUri: window.location.origin,
};

ReactDOM.render(
  <MuiThemeProvider theme={Theme}>
    <AuthProvider {...oidcConfig}>
      <AlertProvider
        template={AlertTemplate}
        position={positions.BOTTOM_LEFT} //default position for all alerts without individual position
        {...alertOptions}
      >

        <Router history={hist}>

          <ToolBar />
          <ScrollToTop>
            <Switch>
              <Route exact path="/" component={Main} />
              <Route exact path="/product_family" component={ProductFamily} />
              <Route exact path="/product_family/create" component={ProductFamilyForm} />
              <Route exact path="/product_family/update/:id" component={ProductFamilyForm} />
              <Route exact path="/production_plan" component={ProductionPlan} />
              <Route exact path="/resource_family" component={ResourceFamily} />
              <Route exact path="/resource_family/create" component={ResourceFamilyForm} />
              <Route exact path="/resource_family/update/:id" component={ResourceFamilyForm} />
              <Route exact path="/relation" component={Relation} />
              <Route exact path="/relation/create" component={RelationForm} />
              <Route exact path="/relation/update/:id" component={RelationForm} />
              <Route exact path="/report/resources_by_product" component={ResourceByProduct} />
              <Route exact path="/report/products_by_resource" component={ProductByResource} />
              <Route exact path="/resource_type" component={ResourceType} />

              <Route render={() => <h1>Not found</h1>} />
            </Switch>

          </ScrollToTop>
        </Router>

      </AlertProvider>
    </AuthProvider>
  </MuiThemeProvider>

  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
