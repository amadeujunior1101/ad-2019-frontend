import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import Page404 from "./pages/NotFound";

//Cria os componentes com as rotas
function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="*" component={Page404} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
