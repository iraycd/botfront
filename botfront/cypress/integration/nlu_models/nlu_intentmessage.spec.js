
/* global cy:true */

describe('NLU Intent warning message displays', function() {
    before(function() {
        cy.createProject('bf', 'My Project', 'en');
    });

    beforeEach(function() {
        cy.visit('/login');
        cy.login();
    });

    after(function() {
        cy.deleteProject('bf');
        cy.logout();
    });

    it('Should add and delete multiple examples', function() {
        cy.visit('/project/bf/nlu/models');
        cy.dataCy('nlu-menu-training-data').click();
        // check warning message exists
        cy.contains('You need at least two distinct intents to train NLU').should('exist');

        // create first intent
        cy.contains('Insert many').click();
        cy.get('.batch-insert-input').type('cya\nlater');
        cy.dataCy('intent-label')
            .click({ force: true })
            .type('newintent{enter}');
        cy.get('[data-cy=save-button]').click();
        cy.get('[data-cy=save-button]').should('not.have.property', 'disabled');

        // create second intent
        cy.contains('Examples').click();
        cy.contains('Insert many').click();
        cy.get('.batch-insert-input').type('hello\nhi guys');
        cy.dataCy('intent-label')
            .click({ force: true })
            .type('intent1{enter}');
        cy.get('[data-cy=save-button]').click();
        cy.get('[data-cy=save-button]').should('not.have.property', 'disabled');

        // returns to the example tab
        cy.contains('Examples').click();

        cy.contains('You need at least two distinct intents to train NLU').should('not.exist');
        
        // delete example
        cy.dataCy('icon-gem').first().click(); // unmark canonical on the first example so it can be deleted
        cy.contains('hello')
            .closest('.rt-tr')
            .find('[data-cy=trash] .viewOnHover')
            .first()
            .click({ force: true });
        cy.wait(100);

        // delete example
        cy.contains('hi guys')
            .closest('.rt-tr')
            .find('[data-cy=trash] .viewOnHover')
            .first()
            .click({ force: true });
        cy.wait(100);

        // check warning message exists
        cy.contains('You need at least two distinct intents to train NLU').should('exist');
    });
});
