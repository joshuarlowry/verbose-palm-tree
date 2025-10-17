import React, { useMemo } from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { addSubmission } from '../store/formSlice';
import type { RootState } from '../store/store';

interface Option {
  value: string;
  label: string;
}

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
                <div>
                  <label htmlFor="fullName">Full name</label>
                  <Field id="fullName" name="fullName" placeholder="Ada Lovelace" />
                  {touched.fullName && errors.fullName && (
                    <div className="error">{errors.fullName}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="email">Email</label>
                  <Field id="email" name="email" type="email" placeholder="ada@example.com" />
                  {touched.email && errors.email && (
                    <div className="error">{errors.email}</div>
                  )}
                </div>

                <div>
                  <label>Category</label>
                  <Field name="category">
                    {({ field }: FieldProps) => (
                      <Select
                        classNamePrefix="rs"
                        options={categories}
                        placeholder="Select category..."
                        isSearchable
                        value={categories.find((o) => o.value === field.value) || null}
                        onChange={(opt) => {
                          const value = (opt as Option | null)?.value ?? '';
                          setFieldValue('category', value);
                          if (value !== 'other') setFieldValue('categoryOther', '');
                        }}
                        onBlur={() => field.onBlur({ target: { name: field.name } as any })}
                      />
                    )}
                  </Field>
                  {values.category === 'other' && (
                    <div className="mt-2">
                      <Field name="categoryOther" placeholder="Specify category" />
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
                  <label>Country</label>
                  <Field name="country">
                    {({ field }: FieldProps) => (
                      <Select
                        classNamePrefix="rs"
                        options={countries}
                        placeholder="Select country..."
                        isSearchable
                        value={countries.find((o) => o.value === field.value) || null}
                        onChange={(opt) => {
                          const value = (opt as Option | null)?.value ?? '';
                          setFieldValue('country', value);
                          // reset dependent fields when country changes
                          setFieldValue('state', '');
                          setFieldValue('stateOther', '');
                          if (value !== 'other') setFieldValue('countryOther', '');
                        }}
                        onBlur={() => field.onBlur({ target: { name: field.name } as any })}
                      />
                    )}
                  </Field>
                  {values.country === 'other' && (
                    <div className="mt-2">
                      <Field name="countryOther" placeholder="Specify country" />
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
                    <label>State/Province</label>
                    <Field name="state">
                      {({ field }: FieldProps) => (
                        <Select
                          classNamePrefix="rs"
                          options={statesOptions}
                          placeholder="Select state/province..."
                          isSearchable
                          value={statesOptions.find((o) => o.value === field.value) || null}
                          onChange={(opt) => {
                            const value = (opt as Option | null)?.value ?? '';
                            setFieldValue('state', value);
                            if (value !== 'other') setFieldValue('stateOther', '');
                          }}
                          onBlur={() => field.onBlur({ target: { name: field.name } as any })}
                        />
                      )}
                    </Field>
                    {values.state === 'other' && (
                      <div className="mt-2">
                        <Field name="stateOther" placeholder="Specify state/province" />
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

                <div>
                  <label>Interests</label>
                  <Field name="interests">
                    {({ field }: FieldProps) => (
                      <Select
                        classNamePrefix="rs"
                        options={interestsOptions}
                        placeholder="Search interests..."
                        isSearchable
                        isMulti
                        closeMenuOnSelect={false}
                        value={interestsOptions.filter((o) => field.value?.includes(o.value))}
                        onChange={(opts) => {
                          const vals = (opts as Option[] | null)?.map((o) => o.value) ?? [];
                          setFieldValue('interests', vals);
                        }}
                        onBlur={() => field.onBlur({ target: { name: field.name } as any })}
                      />
                    )}
                  </Field>
                  {touched.interests && (errors.interests as string) && (
                    <div className="error">{errors.interests as string}</div>
                  )}
                </div>

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

      <div className="submissions">
        <h2>Submissions</h2>
        {submissions.length === 0 ? (
          <div className="muted">No submissions yet.</div>
        ) : (
          <ul>
            {submissions.map((s) => (
              <li key={s.id}>
                <div>
                  <strong>{new Date(s.submittedAt).toLocaleString()}</strong>
                </div>
                <pre>{JSON.stringify(s.values, null, 2)}</pre>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
