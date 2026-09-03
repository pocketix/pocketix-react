import { useState } from "react";
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

// Regression test for the "can't hot-swap a loaded program after mount" bug
// (see main report: PocketixEditor.tsx seeds program/visualProgram/textProgram
// via useState(props.X) once, with no useEffect to resync on prop changes).
// This is inherently React-specific (re-rendering an already-mounted
// component with new props), unlike the shared accordion-DOM scenarios above.
function ProgramSwapHarness() {
  const [program, setProgram] = useState(siblings as unknown as Program);

  return (
    <>
      <button data-testid="swap-to-empty" onClick={() => setProgram(empty as unknown as Program)}>
        Use Selected Program
      </button>
      <PocketixEditor
        language={language as unknown as Language}
        program={program}
        level={0}
        onProgramChange={() => {}}
      />
    </>
  );
}

describe("PocketixEditor hot-swap", () => {
  it("updates the visible editor when a new program prop is loaded after mount", () => {
    cy.mount(<ProgramSwapHarness />);
    cy.contains("button", "Souhlasím").click();
    cy.get(".p-dialog-mask").should("not.exist");

    scenarios.rendersStatementTitles(sel, ["Set Value", "Set Value"]);

    cy.get('[data-testid="swap-to-empty"]').click();

    scenarios.rendersStatementTitles(sel, []);
  });
});

// Regression test for CmdStatement's stale local-state mirror (see main
// report: `statementParams` used to be its own useState copy of
// props.statement.params, never resynced, and every edit handler merged from
// that stale copy instead of current props). Scenario: an external prop
// update (e.g. an Undo) restores an older statement without the component
// remounting (same id/key) — the next local edit must build on the restored
// data, not silently resurrect the pre-undo state.
const singleCommandProgram = { block: [{ id: "cmd1", name: "setValue", params: ["first"] }] };

function ParamEditHarness() {
  const [program, setProgram] = useState(singleCommandProgram as unknown as Program);

  return (
    <>
      <button data-testid="undo" onClick={() => setProgram(singleCommandProgram as unknown as Program)}>
        Undo
      </button>
      <PocketixEditor
        language={language as unknown as Language}
        program={program}
        level={0}
        onProgramChange={(p: Program) => setProgram(p)}
      />
    </>
  );
}

describe("CmdStatement stale local-state mirror", () => {
  it("builds the next edit on the post-undo params, not a stale pre-undo copy", () => {
    cy.mount(<ParamEditHarness />);
    cy.contains("button", "Souhlasím").click();
    cy.get(".p-dialog-mask").should("not.exist");

    cy.get(sel.expressionInput).should("have.length", 1);

    // Add a param -> 2 params.
    cy.get(".accordion-body .pi-plus").click({ force: true });
    cy.get(sel.expressionInput).should("have.length", 2);

    // External "undo" restores the original (1-param) statement, same id ->
    // CmdStatement does not remount.
    cy.get('[data-testid="undo"]').click();
    cy.get(sel.expressionInput).should("have.length", 1);

    // Adding again must produce 2 params (1 restored + 1 new), not 3 (which
    // would mean the add reused a stale pre-undo params array).
    cy.get(".accordion-body .pi-plus").click({ force: true });
    cy.get(sel.expressionInput).should("have.length", 2);
  });
});
