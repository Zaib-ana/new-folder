

// cypress/support/commands.js

// Import cypress-drag-drop plugin
import '@4tw/cypress-drag-drop';

/**
 * Optional login – only if your app needs it.
 * Use env vars so you don't hardcode credentials.
 *
 * Usage:
 *   cy.login();
 */
Cypress.Commands.add('login', () => {
  const username = Cypress.env('USERNAME') || 'your-username';
  const password = Cypress.env('PASSWORD') || 'your-password';

  // TODO: replace selectors with real ones from the login page
  cy.visit('https://stg.platform.creatingly.com/apps/');

  cy.get('input[name="email"]').type(username);
  cy.get('input[name="password"]').type(password, { log: false });
  cy.contains('button', 'Login').click();

  // Wait for Design Studio landing / main dashboard
  // e.g. wait for element that only appears when logged in
  cy.get('[data-testid="design-studio-entry"]', { timeout: 2000000 }).should(
    'be.visible'
  );
});

/**
 * Generic drag & drop helper using the plugin, with
 * extra assertions so tests fail with clear messages.
 *
 * Usage:
 *   cy.dragFromTo('[data-testid="palette-artboard"]', '[data-testid="canvas"]');
 */
Cypress.Commands.add('dragFromTo', (sourceSelector, targetSelector) => {
  cy.get(sourceSelector)
    .should('be.visible')
    .drag(targetSelector, {
      force: true,
    });

  // Slight wait so DOM updates for complex React drag UIs
  cy.wait(500);
});