import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextField } from '../../src/components/form/TextField';

function FormikWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Formik
      initialValues={{ fullName: '' }}
      validationSchema={Yup.object({ fullName: Yup.string().required('Required') })}
      onSubmit={() => {}}
    >
      <Form>{children}</Form>
    </Formik>
  );
}

describe('TextField', () => {
  it('renders and validates', () => {
    cy.mount(
      <FormikWrapper>
        <TextField name="fullName" label="Full name" placeholder="Ada" />
      </FormikWrapper>
    );

    cy.get('label').contains('Full name').should('exist');
    cy.get('#fullName').should('have.value', '');

    // trigger required validation
    cy.get('#fullName').focus().blur();
    cy.contains('.error', 'Required').should('exist');

    cy.get('#fullName').type('Ada');
    cy.contains('.error', 'Required').should('not.exist');
  });
});
