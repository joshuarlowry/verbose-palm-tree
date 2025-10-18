import React, { useMemo } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addSubmission } from '../store/formSlice';
import type { RootState } from '../store/store';
import { TextField } from './form/TextField';
import { SelectField, type Option } from './form/SelectField';
import { SubmissionsList } from './SubmissionsList';

// Option type imported from SelectField

const countryToStates: Record<string, Option[]> = {
  usa: [
    { value: 'ca', label: 'California' },
    { value: 'ny', label: 'New York' },
    { value: 'tx', label: 'Texas' },
    { value: 'other', label: 'Other' },
  ],
  canada: [
    { value: 'on', label: 'Ontario' },
    { value: 'qc', label: 'Quebec' },
    { value: 'bc', label: 'British Columbia' },
    { value: 'other', label: 'Other' },
  ],
};

const categories: Option[] = [
  { value: 'software', label: 'Software' },
  { value: 'hardware', label: 'Hardware' },
  { value: 'services', label: 'Services' },
  { value: 'other', label: 'Other' },
];

const countries: Option[] = [
  { value: 'usa', label: 'United States' },
  { value: 'canada', label: 'Canada' },
  { value: 'other', label: 'Other' },
];

const validationSchema = Yup.object({
  fullName: Yup.string().min(2, 'Too short').required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  category: Yup.string().required('Required'),
  categoryOther: Yup.string().when('category', {
    is: 'other',
    then: (schema) => schema.required('Please specify'),
    otherwise: (schema) => schema.notRequired(),
  }),
  country: Yup.string().required('Required'),
  countryOther: Yup.string().when('country', {
    is: 'other',
    then: (schema) => schema.required('Please specify'),
  }),
  state: Yup.string().when('country', {
    is: (val: string) => val === 'usa' || val === 'canada',
    then: (schema) => schema.required('Required'),
  }),
  stateOther: Yup.string().when('state', {
    is: 'other',
    then: (schema) => schema.required('Please specify'),
  }),
  interests: Yup.array().of(Yup.string()).min(1, 'Pick at least one'),
  notes: Yup.string().max(500, 'Keep it brief'),
});

const interestsOptions: Option[] = [
  { value: 'react', label: 'React' },
  { value: 'redux', label: 'Redux' },
  { value: 'formik', label: 'Formik' },
  { value: 'yup', label: 'Yup' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'testing', label: 'Testing' },
];

export const ComplexForm: React.FC = () => {
  const dispatch = useDispatch();
  const submissions = useSelector((s: RootState) => s.form.submissions);

  return (
    <div className="card">
      <Formik
        initialValues={{
          fullName: '',
          email: '',
          category: '',
          categoryOther: '',
          country: '',
          countryOther: '',
          state: '',
          stateOther: '',
          interests: [] as string[],
          notes: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          const id = crypto.randomUUID();
          dispatch(
            addSubmission({
              id,
              values,
              submittedAt: new Date().toISOString(),
            })
          );
          resetForm();
        }}
      >
        {({ values, errors, touched, setFieldValue }) => {
          const statesOptions = useMemo(() => {
            if (values.country === 'usa' || values.country === 'canada') {
              return countryToStates[values.country];
            }
            return [];
          }, [values.country]);

          return (
            <Form noValidate>
              <div className="grid">
                <TextField name="fullName" label="Full name" placeholder="Ada Lovelace" />

                <TextField name="email" label="Email" type="email" placeholder="ada@example.com" />

                <div>
                  <SelectField
                    name="category"
                    label="Category"
                    options={categories}
                    placeholder="Select category..."
                    onAfterChange={(value) => {
                      if (value !== 'other') setFieldValue('categoryOther', '');
                    }}
                  />
                  {values.category === 'other' && (
                    <div className="mt-2">
                      <TextField name="categoryOther" label="Specify category" />
                      {touched.categoryOther && errors.categoryOther && (
                        <div className="error">{errors.categoryOther}</div>
                      )}
                    </div>
                  )}
                  {touched.category && errors.category && (
                    <div className="error">{errors.category}</div>
                  )}
                </div>

                <div>
                  <SelectField
                    name="country"
                    label="Country"
                    options={countries}
                    placeholder="Select country..."
                    onAfterChange={(value) => {
                      const v = Array.isArray(value) ? '' : value;
                      setFieldValue('state', '');
                      setFieldValue('stateOther', '');
                      if (v !== 'other') setFieldValue('countryOther', '');
                    }}
                  />
                  {values.country === 'other' && (
                    <div className="mt-2">
                      <TextField name="countryOther" label="Specify country" />
                      {touched.countryOther && errors.countryOther && (
                        <div className="error">{errors.countryOther}</div>
                      )}
                    </div>
                  )}
                  {touched.country && errors.country && (
                    <div className="error">{errors.country}</div>
                  )}
                </div>

                {(values.country === 'usa' || values.country === 'canada') && (
                  <div>
                    <SelectField
                      name="state"
                      label="State/Province"
                      options={statesOptions}
                      placeholder="Select state/province..."
                      onAfterChange={(value) => {
                        const v = Array.isArray(value) ? '' : value;
                        if (v !== 'other') setFieldValue('stateOther', '');
                      }}
                    />
                    {values.state === 'other' && (
                      <div className="mt-2">
                        <TextField name="stateOther" label="Specify state/province" />
                        {touched.stateOther && errors.stateOther && (
                          <div className="error">{errors.stateOther}</div>
                        )}
                      </div>
                    )}
                    {touched.state && errors.state && (
                      <div className="error">{errors.state}</div>
                    )}
                  </div>
                )}

                <SelectField
                  name="interests"
                  label="Interests"
                  options={interestsOptions}
                  placeholder="Search interests..."
                  isMulti
                />
                  {touched.interests && (errors.interests as string) && (
                    <div className="error">{errors.interests as string}</div>
                  )}
                

                <div className="col-span-2">
                  <label htmlFor="notes">Notes</label>
                  <Field id="notes" name="notes" as="textarea" rows={4} placeholder="Anything else?" />
                  {touched.notes && errors.notes && (
                    <div className="error">{errors.notes}</div>
                  )}
                </div>
              </div>

              <div className="actions">
                <button type="submit">Submit</button>
                <button type="reset" className="secondary">Reset</button>
              </div>
            </Form>
          );
        }}
      </Formik>

      <SubmissionsList submissions={submissions} />
    </div>
  );
};
