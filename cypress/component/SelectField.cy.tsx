import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { SelectField, type Option } from '../../src/components/form/SelectField';

const options: Option[] = [
  { value: 'software', label: 'Software' },
  { value: 'hardware', label: 'Hardware' },
  { value: 'services', label: 'Services' },
];

function FormikWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Formik
      initialValues={{ category: '' }}
      validationSchema={Yup.object({ category: Yup.string().required('Required') })}
      onSubmit={() => {}}
    >
      <Form>{children}</Form>
    </Formik>
  );
}

describe('SelectField', () => {
  it('selects an option and shows selected value', () => {
    cy.mount(
      <FormikWrapper>
        <SelectField name="category" label="Category" options={options} placeholder="Select..." />
      </FormikWrapper>
    );

    cy.contains('label', 'Category').should('exist');
    cy.get('.rs__control').click();
    cy.get('.rs__menu').contains('Hardware').click();
    cy.get('.rs__single-value').should('have.text', 'Hardware');
  });
});
