// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Handle uncaught exceptions from the application
Cypress.on('uncaught:exception', (err, _runnable) => {
  // Log the error but don't fail the test
  console.log('Uncaught exception from application:', err.message);
  // Return false to prevent the unhandled exception from failing this test
  return false;
});
