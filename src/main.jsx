import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { store } from './reducers/store.js'
import { Provider } from 'react'
import Router from './Router.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router />
    </Provider>
  </React.StrictMode>,
)
