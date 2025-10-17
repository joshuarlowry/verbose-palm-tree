import React from 'react';
import { ComplexForm } from './components/ComplexForm';

export const App: React.FC = () => {
  return (
    <div className="container">
      <h1>Complex Form Example</h1>
      <p className="subtitle">Formik + Yup + Redux Toolkit + react-select</p>
      <ComplexForm />
    </div>
  );
};
