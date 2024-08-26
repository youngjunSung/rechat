import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import './src/styles/index.scss';
import { ThemeProvider } from '@mui/material';
import { customTheme } from './src/styles/customTheme';

import App from './src/layouts/App';

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  process.env.NODE_ENV === 'production' ? 'https://sleact.nodebird.com' : 'http://localhost:3090';

const container = document.getElementById('app') as HTMLDivElement;
const root = ReactDOM.createRoot(container);

root.render(
  <BrowserRouter>
    <ThemeProvider theme={customTheme}>
      <App />
    </ThemeProvider>
  </BrowserRouter>,
);
