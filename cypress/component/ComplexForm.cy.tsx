import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../src/store/store';
import { ComplexForm } from '../../src/components/ComplexForm';

const selectOption = (labelText: string, optionText: string) => {
  cy.contains('label', labelText).parent().within(() => {
    cy.get('.rs__control').click();
  });
  cy.get('.rs__menu').contains(optionText).click();
};

describe('ComplexForm', () => {
  it('shows conditional fields and submits', () => {
    cy.mount(
      <Provider store={store}>
        <ComplexForm />
      </Provider>
    );

    // required errors
    cy.contains('button', 'Submit').click();
    cy.contains('.error', 'Required').should('exist');

    // fill required fields
    cy.get('#fullName').type('Ada Lovelace');
    cy.get('#email').type('ada@example.com');

    // Category -> Other -> show other field
    selectOption('Category', 'Other');
    cy.contains('label', 'Specify category').should('exist');
    cy.get('#categoryOther').type('Consulting');

    // Country -> USA -> State appears
    selectOption('Country', 'United States');
    cy.contains('label', 'State/Province').should('exist');

    // State -> Other -> show stateOther
    selectOption('State/Province', 'Other');
    cy.contains('label', 'Specify state/province').should('exist');
    cy.get('#stateOther').type('Atlantis');

    // Interests multi-select pick at least one
    cy.contains('label', 'Interests').parent().within(() => {
      cy.get('.rs__control').click();
    });
    cy.get('.rs__menu').contains('React').click();

    // Submit
    cy.contains('button', 'Submit').click();

    cy.contains('h2', 'Submissions').should('exist');
    cy.contains('pre', 'Ada Lovelace').should('exist');
  });
});
