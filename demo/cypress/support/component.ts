import { mount } from "@cypress/react";

Cypress.Commands.add("mount", mount);

// The library initializes PostHog analytics as a side effect of import
// (see packages/pocketix-editor/src/index.tsx) — stub it out so component
// tests don't depend on network access to posthog.pocketix.org.
beforeEach(() => {
  cy.intercept("https://posthog.pocketix.org/**", { statusCode: 200, body: {} });
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}
