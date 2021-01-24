/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-01-24 18:37:50
 * @Last Modified by: qiuz
 */

import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import AdminHome from 'pages/dashboard';

const BasicRoute = () => (
  <BrowserRouter basename={'/widget'}>
    <Switch>
      <Route path="*" component={AdminHome} />
    </Switch>
  </BrowserRouter>
);

export default BasicRoute;
