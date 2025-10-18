import React from 'react';
import { useField } from 'formik';

export interface TextFieldProps {
  name: string;
  label: string;
  id?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
}

export const TextField: React.FC<TextFieldProps> = ({ name, label, id, placeholder, type = 'text' }) => {
  const [field, meta] = useField<string>(name);
  const inputId = id ?? name;

  return (
    <div>
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} {...field} type={type} placeholder={placeholder} />
      {meta.touched && meta.error ? <div className="error">{meta.error}</div> : null}
    </div>
  );
};
