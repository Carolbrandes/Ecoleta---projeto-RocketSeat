import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';

// o exact serve para ele fazer uma verificação de igualdade, ele vai ver se a url do browser é igual ao path

const Routes = () => {
    return(
        <BrowserRouter>
            <Route component={Home} path="/" exact />
            <Route component={CreatePoint} path="/create-point" />
        </BrowserRouter>
    )
}

export default Routes;
