import { PocketixEditor } from "pocketix-react";
import type { Program } from "pocketix-react/dist/types/model/language.model";
import type { Language } from "pocketix-react/dist/types/model/meta-language.model";

import language from "../../../../pocketix-vpl-shared-tests/fixtures/language.json";
import languageMissingRoot from "../../../../pocketix-vpl-shared-tests/fixtures/language-missing-root.json";
import siblings from "../../../../pocketix-vpl-shared-tests/fixtures/programs/siblings.json";
import duplicateParams from "../../../../pocketix-vpl-shared-tests/fixtures/programs/duplicateParams.json";
import empty from "../../../../pocketix-vpl-shared-tests/fixtures/programs/empty.json";

// Shared, framework-agnostic assertions — see pocketix-vpl-shared-tests/README.md
import * as selectorsModule from "../../../../pocketix-vpl-shared-tests/scenarios/selectors";
import * as scenarios from "../../../../pocketix-vpl-shared-tests/scenarios/sharedScenarios";

const { common, perRepo } = selectorsModule as unknown as {
  common: Record<string, string>;
  perRepo: { react: Record<string, string> };
};
// This repo's full selector set: shared base + React-specific cosmetic classes.
const sel = { ...common, ...perRepo.react };

/**
 * PocketixEditor always mounts with a hardcoded, non-dismissible-by-props
 * GDPR/analytics consent modal on top of everything (`isAgreeVisible` starts
 * `true` with no `settings` flag to skip it — see main bug report). Every
 * test has to dismiss it first or all later `cy.get(...)` interactions are
 * blocked by the modal overlay.
 */
function mountEditor(program: Program, lang: Language = language as unknown as Language) {
  cy.mount(
    <PocketixEditor
      language={lang}
      program={program}
      level={0}
      onProgramChange={() => {}}
    />
  );
  cy.contains("button", "Souhlasím").click();
  cy.get(".p-dialog-mask").should("not.exist");
}

describe("PocketixEditor (shared cross-repo scenarios)", () => {
  it("renders sibling statements in order", () => {
    mountEditor(siblings as unknown as Program);
    scenarios.rendersStatementTitles(sel, ["Set Value", "Set Value"]);
  });

  it("reorders siblings via the move-down button", () => {
    mountEditor(siblings as unknown as Program);
    scenarios.reordersSiblingsViaMoveButtons(sel);
  });

  it("removes a statement via the remove button", () => {
    mountEditor(siblings as unknown as Program);
    scenarios.removesFirstStatement(sel);
  });

  it("toggles the accordion body open/closed on header click", () => {
    mountEditor(siblings as unknown as Program);
    scenarios.togglesAccordionBody(sel);
  });

  it("renders duplicate-valued params as separate rows", () => {
    mountEditor(duplicateParams as unknown as Program);
    scenarios.rendersDuplicateValuedParamsAsSeparateRows(sel);
  });

  it("renders the root add-statement button without crashing", () => {
    mountEditor(empty as unknown as Program);
    scenarios.rootAddButtonRendersWithoutCrashing(sel);
  });

  // Regression test for the "_" root-statement crash bug (see main report:
  // Block.tsx's root "+" button reads language.statements["_"] with no `?.`
  // guard, unlike every other lookup in the same file). Currently expected
  // to fail/crash until that's fixed — enable once B10 is patched.
  it.skip("does not crash when the language has no '_' root entry", () => {
    mountEditor(empty as unknown as Program, languageMissingRoot as unknown as Language);
    scenarios.rootAddButtonRendersWithoutCrashing(sel);
  });
});
