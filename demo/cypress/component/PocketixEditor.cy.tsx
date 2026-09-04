import { useState } from "react";
import { PocketixEditor } from "pocketix-react";
import type { Program } from "pocketix-react/dist/types/model/language.model";
import type { Language } from "pocketix-react/dist/types/model/meta-language.model";
import type { EditorSettings } from "pocketix-react/dist/types/model/editor-settings.model";

import language from "../../../../pocketix-vpl-shared-tests/fixtures/language.json";
import languageMissingRoot from "../../../../pocketix-vpl-shared-tests/fixtures/language-missing-root.json";
import siblings from "../../../../pocketix-vpl-shared-tests/fixtures/programs/siblings.json";
import duplicateParams from "../../../../pocketix-vpl-shared-tests/fixtures/programs/duplicateParams.json";
import structureParams from "../../../../pocketix-vpl-shared-tests/fixtures/programs/structureParams.json";
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

function mountEditor(program: Program, lang: Language = language as unknown as Language) {
  cy.mount(
    <PocketixEditor
      language={lang}
      program={program}
      level={0}
      onProgramChange={() => {}}
    />
  );
  cy.get(sel.block).should("exist");
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

  // Regression test for keying param rows by raw value instead of index (see
  // main report: two freshly-added/identical-valued params get the same
  // React key). A pure element-count check doesn't catch this (React still
  // renders both DOM nodes either way, and Expression's own props-resync
  // fix happens to paper over the downstream symptom) - assert directly on
  // React's own "two children with the same key" dev warning instead.
  it("does not trigger a React duplicate-key warning for identical-valued params", () => {
    cy.window().then((win) => {
      cy.spy(win.console, "error").as("consoleError");
    });

    mountEditor(duplicateParams as unknown as Program);
    cy.get(sel.expressionInput).should("have.length", 2);

    cy.get("@consoleError").then((spy: any) => {
      const messages = spy.getCalls().map((call: any) => call.args.join(" "));
      const hasDuplicateKeyWarning = messages.some((m: string) => m.includes("same key"));
      expect(hasDuplicateKeyWarning, `console.error calls: ${JSON.stringify(messages)}`).to.equal(false);
    });
  });

  it("renders bound values for structure-type command params", () => {
    mountEditor(structureParams as unknown as Program);
    scenarios.rendersBoundStructureParamValues(sel);
  });

  it("renders the root add-statement button without crashing", () => {
    mountEditor(empty as unknown as Program);
    scenarios.rootAddButtonRendersWithoutCrashing(sel);
  });

  // Regression test for the "_" root-statement crash bug (see main report:
  // Block.tsx's root "+" button read language.statements["_"] with no `?.`
  // guard, unlike every other lookup in the same file).
  it("does not crash when the language has no '_' root entry", () => {
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

// Regression test for Expression.tsx never resyncing from props.expressionValue
// (see main report: `expressionString` was seeded via useState(props.expressionValue)
// once, with no useEffect to resync on prop changes — same missing-resync
// pattern as PocketixEditor.tsx's program/language/settings, item 4).
//
// Uses an "if" statement's *condition* rather than a command param: Block.tsx
// keys CompoundStatement by `statement.id` (stable), but CmdStatement keys
// each param's wrapper div by the param's raw *value* (see the separate
// duplicate-key bug report) — changing a param's value there remounts a
// fresh Expression instance, which would trivially show the right value
// even without a resync fix and defeat this regression test.
const ifProgram = {
  block: [{ id: "if1", name: "if", condition: "first", block: [{ id: "cmd1", name: "setValue", params: ["x"] }] }]
};

function ExpressionSwapHarness() {
  const [program, setProgram] = useState(ifProgram as unknown as Program);

  return (
    <>
      <button
        data-testid="swap-condition"
        onClick={() => setProgram({
          block: [{ id: "if1", name: "if", condition: "changed", block: [{ id: "cmd1", name: "setValue", params: ["x"] }] }]
        } as unknown as Program)}
      >
        Swap
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

describe("Expression resync", () => {
  it("updates the displayed value when props.expressionValue changes after mount", () => {
    cy.mount(<ExpressionSwapHarness />);

    cy.get(".accordion-header-content input.input-field").should("have.value", "first");

    cy.get('[data-testid="swap-condition"]').click();

    cy.get(".accordion-header-content input.input-field").should("have.value", "changed");
  });
});

describe("CmdStatement stale local-state mirror", () => {
  it("builds the next edit on the post-undo params, not a stale pre-undo copy", () => {
    cy.mount(<ParamEditHarness />);

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

// Regression test for "remove(index) reused for two call signatures" (see
// main report: CmdStatement.tsx's remove was used both as the per-param
// remove handler and, unmodified, as the whole-statement onRemove handler —
// which Statement.tsx calls with zero arguments — so removing one param
// used to also (or instead) remove the entire statement).
describe("CmdStatement per-param vs whole-statement removal", () => {
  it("removing a param does not remove the whole statement", () => {
    mountEditor(duplicateParams as unknown as Program);

    cy.get(sel.expressionInput).should("have.length", 2);
    cy.get(`${sel.block} ${sel.accordion}`).should("have.length", 1);

    cy.get(".accordion-body .input-group .pi-times").first().click({ force: true });

    cy.get(sel.expressionInput).should("have.length", 1);
    cy.get(`${sel.block} ${sel.accordion}`).should("have.length", 1);
  });

  it("removing the whole statement still works", () => {
    mountEditor(duplicateParams as unknown as Program);

    cy.get(`${sel.block} ${sel.accordion}`).should("have.length", 1);

    cy.get(sel.removeButton).click({ force: true });

    cy.get(`${sel.block} ${sel.accordion}`).should("have.length", 0);
  });
});

// Regression tests for the hardcoded, always-on GDPR/analytics consent modal
// (see main report: no settings flag to disable it, no persistence — it
// reappeared on every page load and analytics tracked regardless of the
// modal's state). Fixed behavior: analytics/the modal are opt-in via
// settings.analytics.enabled (default false, see defaultSettings.ts), and
// agreeing persists to localStorage so it isn't shown again.
const CONSENT_STORAGE_KEY = "pocketix-editor-analytics-consent";
const analyticsEnabledSettings = { analytics: { enabled: true }, common: { manualSync: false } } as EditorSettings;

describe("Analytics consent", () => {
  beforeEach(() => {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  });

  it("does not show the consent modal when analytics is disabled (the default)", () => {
    mountEditor(siblings as unknown as Program);
    cy.get(".p-dialog-mask").should("not.exist");
  });

  it("shows the consent modal when analytics is enabled and not yet consented", () => {
    cy.mount(
      <PocketixEditor
        language={language as unknown as Language}
        program={siblings as unknown as Program}
        level={0}
        onProgramChange={() => {}}
        settings={analyticsEnabledSettings}
      />
    );
    cy.contains("button", "Souhlasím").should("be.visible");
  });

  it("hides the modal after agreeing and persists consent across remounts", () => {
    cy.mount(
      <PocketixEditor
        language={language as unknown as Language}
        program={siblings as unknown as Program}
        level={0}
        onProgramChange={() => {}}
        settings={analyticsEnabledSettings}
      />
    );
    cy.contains("button", "Souhlasím").click();
    cy.get(".p-dialog-mask").should("not.exist");
    cy.wrap(null).should(() => {
      expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).to.equal("granted");
    });

    // Remount (simulating a page reload) - consent should already be recorded.
    cy.mount(
      <PocketixEditor
        language={language as unknown as Language}
        program={siblings as unknown as Program}
        level={0}
        onProgramChange={() => {}}
        settings={analyticsEnabledSettings}
      />
    );
    cy.get(".p-dialog-mask").should("not.exist");
  });
});

// Regression tests for the "defaultSettings.textEditor.enabled is unreachable"
// bug (see main report: PocketixEditor.tsx used to force textEditor.enabled
// to false at mount/resync regardless of what props.settings/defaultSettings
// said, so a consumer explicitly requesting the text editor visible on load
// could never get it).
describe("Text editor visibility setting", () => {
  it("hides the text editor by default when no settings are passed", () => {
    mountEditor(siblings as unknown as Program);
    cy.get(".text-editor").should("not.exist");
  });

  it("shows the text editor when explicitly enabled via settings", () => {
    cy.mount(
      <PocketixEditor
        language={language as unknown as Language}
        program={siblings as unknown as Program}
        level={0}
        onProgramChange={() => {}}
        settings={{ textEditor: { enabled: true, style: {} }, common: { manualSync: false } } as EditorSettings}
      />
    );
    cy.get(".text-editor").should("exist");
  });
});

// Regression test for "text-editor debounce race can lose in-progress edits"
// (see main report: TextEditor.tsx's resync useEffect unconditionally
// overwrote editorContent on any props.program change, including one
// triggered by an unrelated visual-editor action landing during the 1s
// debounce window after typing - discarding the uncommitted typed text).
describe("TextEditor debounce race", () => {
  it("does not discard in-progress typed text when a visual edit lands mid-debounce", () => {
    const bothPanesSettings = {
      menu: { enabled: true, enableToggleVisual: true, enableSaveVisual: true, enableUndo: true, enableRedo: true, enableSync: true, enableSaveText: true, enableToggleText: true, enableLang: true },
      visualEditor: { enabled: true },
      textEditor: { enabled: true, style: {} },
      common: { manualSync: false },
    } as EditorSettings;

    cy.mount(
      <PocketixEditor
        language={language as unknown as Language}
        program={siblings as unknown as Program}
        level={0}
        onProgramChange={() => {}}
        settings={bothPanesSettings}
      />
    );
    cy.get(".text-area").should("exist");

    // Type into the text editor - this restarts a 1000ms debounce on every
    // keystroke, so as long as the rest of this test executes well within
    // that window (true for Cypress's synchronous command queue here), the
    // debounce has not committed yet at the point of the visual-editor click.
    cy.get(".text-area").clear().type('// uncommitted edit\n', { delay: 0 });

    // Trigger an unrelated visual-editor action (move the first statement
    // down), which updates props.program from a completely different path.
    cy.get(`${sel.block} ${sel.accordion}`).first().find(sel.moveDownButton).click({ force: true });

    // The typed-but-not-yet-committed text must still be showing.
    cy.get(".text-area").should(($el) => {
      expect(($el.val() as string).startsWith("// uncommitted edit")).to.equal(true);
    });
  });
});

// Regression test for "new statements have no id until commit" (see main
// report: Block.tsx's add() built the new statement without an `id` field,
// so every statement added before a parent generateIds()/commit round-trip
// rendered with key={undefined} - a duplicate key once a second one is
// added the same way). Asserts on React's own dev warning rather than a
// plain element count, since the DOM still renders both nodes either way.
describe("Adding statements assigns an id immediately", () => {
  it("does not trigger a React duplicate-key warning when adding two statements before any commit round-trip", () => {
    cy.window().then((win) => {
      cy.spy(win.console, "error").as("consoleError");
    });

    mountEditor(empty as unknown as Program);

    const addOneStatement = () => {
      cy.get(sel.addStatementButton).click();
      cy.get(".p-autocomplete-dropdown").click();
      cy.get(".p-autocomplete-item").first().click();
      cy.contains("button", "Add").click();
    };

    addOneStatement();
    addOneStatement();

    cy.get(`${sel.block} ${sel.accordion}`).should("have.length", 2);

    cy.get("@consoleError").then((spy: any) => {
      const messages = spy.getCalls().map((call: any) => call.args.join(" "));
      const hasKeyWarning = messages.some((m: string) => m.includes("key"));
      expect(hasKeyWarning, `console.error calls: ${JSON.stringify(messages)}`).to.equal(false);
    });
  });
});

// Regression test for "root-level add-statement suggestions use wrong
// parent name" (see main report: Block.tsx's searchSuggestions() filtered
// on `props.parent?.name`, which is undefined at the root level, instead of
// the locally-computed `parent.name` that defaults to "_" - so a statement
// restricted to the root via `parents: ["_"]` never showed up as a root
// suggestion).
const languageWithRootOnlyStatement = {
  ...(language as any),
  statements: {
    ...(language as any).statements,
    rootOnlyCmd: {
      name: "rootOnlyCmd",
      component: "cmd",
      label: "Root Only Cmd",
      icon: "pi-home",
      color: "#ffffff",
      backgroundColor: "#99A8D7",
      parents: ["_"],
      extensions: { params: { type: "array", defs: "string" } }
    }
  }
};

describe("Root-level add-statement suggestions", () => {
  it("includes a statement restricted to the '_' root parent", () => {
    mountEditor(empty as unknown as Program, languageWithRootOnlyStatement as unknown as Language);

    cy.get(sel.addStatementButton).click();
    cy.get(".p-autocomplete-dropdown").click();
    cy.contains(".p-autocomplete-item", "Root Only Cmd").should("exist");
  });
});

// Regression test for "id-bearing vs id-stripped program view asymmetry"
// (see main report: onProgramChange received the id-bearing program while
// the text editor's own view of the same program has ids stripped -
// PocketixEditor.tsx generates ids purely as an internal React-key
// concern from an id-less props.program on every mount, and the host never
// supplied them, so they should never be handed back either).
function hasAnyId(node: unknown): boolean {
  if (Array.isArray(node)) {
    return node.some(hasAnyId);
  }

  if (node && typeof node === "object") {
    if ("id" in (node as Record<string, unknown>) && (node as Record<string, unknown>).id !== undefined) {
      return true;
    }

    return Object.values(node as Record<string, unknown>).some(hasAnyId);
  }

  return false;
}

describe("onProgramChange id stripping", () => {
  it("emits a program with no id fields after a visual edit", () => {
    const onProgramChange = cy.stub().as("onProgramChange");

    cy.mount(
      <PocketixEditor
        language={language as unknown as Language}
        program={siblings as unknown as Program}
        level={0}
        onProgramChange={onProgramChange}
        settings={{ visualEditor: { enabled: true }, common: { manualSync: false } } as EditorSettings}
      />
    );

    cy.get(`${sel.block} ${sel.accordion}`).first().find(sel.moveDownButton).click({ force: true });

    cy.get("@onProgramChange").should("have.been.called");
    cy.get("@onProgramChange").then((stub: any) => {
      const emitted = stub.lastCall.args[0];
      expect(hasAnyId(emitted), `emitted program: ${JSON.stringify(emitted)}`).to.equal(false);
    });
  });
});
