import { Expression } from "../../../packages/pocketix-editor/src/components/Expression";
import language from "../../../../pocketix-vpl-shared-tests/fixtures/language.json";

// Regression test for "checkExpression()/syntaxError is a no-op" (see main
// report: `const [syntaxError] = useState(false)` had no setter, so the
// already-wired disabled-button/error-styling in this component's dialog
// never actually fired for any input, however malformed).
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

describe("Expression syntax validation", () => {
  it("flags a malformed expression and disables the Ok button", () => {
    cy.mount(<Expression {...baseProps()} />);

    cy.get(".pi-ellipsis-h").click({ force: true });
    cy.get(".text-area").should("be.visible").clear().type("5451.Relay1 ==", { delay: 0 });

    cy.get(".text-area").should("have.class", "error");
    cy.contains("button", "Ok").should("be.disabled");
  });

  it("does not flag a well-formed expression", () => {
    cy.mount(<Expression {...baseProps()} />);

    cy.get(".pi-ellipsis-h").click({ force: true });
    cy.get(".text-area").should("be.visible").clear().type("5451.Relay1 == 1", { delay: 0 });

    cy.get(".text-area").should("not.have.class", "error");
    cy.contains("button", "Ok").should("not.be.disabled");
  });
});
