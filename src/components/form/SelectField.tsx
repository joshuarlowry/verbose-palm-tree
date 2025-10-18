import React from 'react';
import Select from 'react-select';
import { useField, useFormikContext } from 'formik';

export interface Option {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  isMulti?: boolean;
  classNamePrefix?: string;
  onAfterChange?: (value: string | string[]) => void;
  inputId?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  placeholder,
  isMulti = false,
  classNamePrefix = 'rs',
  onAfterChange,
  inputId,
}) => {
  const { setFieldValue } = useFormikContext<any>();
  const [field, meta] = useField<any>(name);
  const id = inputId ?? name;

  const value = isMulti
    ? options.filter((o) => (field.value ?? []).includes(o.value))
    : options.find((o) => o.value === field.value) ?? null;

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <Select
        inputId={id}
        classNamePrefix={classNamePrefix}
        options={options}
        placeholder={placeholder}
        isSearchable
        isMulti={isMulti}
        closeMenuOnSelect={!isMulti}
        value={value}
        onChange={(opt) => {
          const next = isMulti
            ? ((opt as Option[] | null)?.map((o) => o.value) ?? [])
            : ((opt as Option | null)?.value ?? '');
          setFieldValue(name, next);
          if (onAfterChange) onAfterChange(next);
        }}
        onBlur={() => field.onBlur({ target: { name: field.name } as any })}
      />
      {meta.touched && meta.error ? (
        <div className="error">{typeof meta.error === 'string' ? meta.error : String(meta.error)}</div>
      ) : null}
    </div>
  );
};
