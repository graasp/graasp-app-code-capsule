/// <reference types="cypress" />
import { Database, LocalContext } from '@graasp/apps-query-client';
import { Member } from '@graasp/sdk';

import { mount } from 'cypress/react18';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      /**
       * Custom command to enter the specified content into the code editor.
       * @example cy.typeInEditor('print("Hello World")')
       */
      typeInEditor(
        content: string,
        editorID?: string,
      ): Chainable<JQuery<HTMLElement>>;
      /**
       * Custom command to check the specified content into the code editor.
       * @example cy.expectContentInEditor('print("Hello World")')
       */
      expectContentInEditor(
        content: string,
        editorID?: string,
      ): Chainable<JQuery<HTMLElement>>;
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      setUpApi({
        database,
        currentMember,
        appContext,
      }: {
        database?: Partial<Database>;
        currentMember?: Member;
        appContext?: Partial<LocalContext>;
      }): Chainable<Element>;
      /**
       * Custom command to open the code editor from the toolbar.
       * @example cy.openCodeEditor()
       */
      openCodeEditor(): void;
      /**
       * Custom command to open the repl to execute code from the toolbar.
       * @example cy.openRepl()
       */
      openRepl(): void;
      /**
       * Custom command to run the code in the repl.
       * @example cy.runRepl()
       */
      runRepl(): void;
      /**
       * Custom command to open the repl to execute code from the toolbar.
       * @example cy.openRepl()
       */
      openTab(tabId: string): void;
      /**
       * Custom command to wait until the repl is ready to execute code.
       * @example cy.waitForReplReady()
       */
      waitForReplReady(): Chainable<JQuery<HTMLElement>>;
    }
  }
}

export {};
