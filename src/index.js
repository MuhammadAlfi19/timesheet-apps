import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '@fontsource/nunito';
import reportWebVitals from './reportWebVitals';
import DaftarTimeSheet from './views/DaftarTimeSheet';
import { ChakraProvider,extendTheme } from '@chakra-ui/react'

const root = ReactDOM.createRoot(document.getElementById('root'));
const theme = extendTheme({
  colors: {
    custom: {
      lightBlue: '#F0F6FF',
      blue: '#2775EC',
      red: '#F15858'
    }
  },
  fonts: {
    body: `'nunito', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: "#F7F8FB", // Ganti dengan warna latar belakang yang Anda inginkan
      },
    },
  },
});
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <DaftarTimeSheet />
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
