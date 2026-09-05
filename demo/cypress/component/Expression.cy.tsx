import { Expression } from "../../../packages/iotix-editor/src/components/Expression";
import language from "../../../iotix-shared-tests/fixtures/language.json";

// Shared, framework-agnostic assertions — see iotix-shared-tests/README.md
import * as selectorsModule from "../../../iotix-shared-tests/scenarios/selectors";
import * as scenarios from "../../../iotix-shared-tests/scenarios/sharedScenarios";

const { common } = selectorsModule as unknown as { common: Record<string, string> };

// Regression test for "checkExpression()/syntaxError is a no-op" (see main
// report: `const [syntaxError] = useState(false)` had no setter, so the
// already-wired disabled-button/error-styling in this component's dialog
// never actually fired for any input, however malformed). Shared with
// iotixng's equivalent check in IotixVpProgram.cy.ts.
function baseProps(overrides: Partial<Parameters<typeof Expression>[0]> = {}) {
  return {
    language: language as any,
    expressionValue: "",
    color: "#495057",
    backgroundColor: "#f5f5f5",
    onExpressionValueChanged: () => {},
    ...overrides,
  };
}

describe("Expression syntax validation (shared cross-repo scenario)", () => {
  it("flags a malformed expression and disables the Ok button", () => {
    cy.mount(<Expression {...baseProps()} />);
    scenarios.flagsSyntaxErrorAndDisablesOk(common, "5451.Relay1 ==");
  });

  it("does not flag a well-formed expression", () => {
    cy.mount(<Expression {...baseProps()} />);
    scenarios.acceptsWellFormedExpression(common, "5451.Relay1 == 1");
  });
});
