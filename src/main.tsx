import React from 'react'
import ReactDOM from 'react-dom/client'

import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'

const basename = import.meta.env.PROD ? '/Personal-Portfolio' : '/'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
    <div className="boxContainer">
        <App />
    </div>
    </BrowserRouter>
  </React.StrictMode>
)