import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import store from './store';
import CsStaff from './pages/csStaff';
import Test from './pages/test';

function App() {
  return (
    <Provider store={ store }>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={ Test } />
          <Route path='/csStaff' component={ CsStaff } />
        </Switch>
      </BrowserRouter>
    </Provider>
    
  );
}

export default App;
