import { Statement } from "../../../packages/pocketix-editor/src/components/Statement";

// Regression test for "Statement.tsx's isOpen default can never be false"
// (see main report: useState((props.isOpen || true) as boolean) - `X || true`
// is always true regardless of X). Nothing currently passes isOpen={false}
// (latent bug), so this mounts the component directly rather than through
// the public PocketixEditor tree.
function baseProps(overrides: Partial<Parameters<typeof Statement>[0]> = {}) {
  return {
    error: "",
    icon: "pi-bolt",
    title: "Test statement",
    color: "#ffffff",
    header: <></>,
    body: <div>body content</div>,
    onUp: () => {},
    onDown: () => {},
    onRemove: () => {},
    ...overrides,
  };
}

describe("Statement isOpen default", () => {
  it("defaults to open when isOpen is not passed", () => {
    cy.mount(<Statement {...baseProps()} />);
    cy.get(".accordion-body").should("have.class", "open");
  });

  it("respects isOpen={false}", () => {
    cy.mount(<Statement {...baseProps({ isOpen: false })} />);
    cy.get(".accordion-body").should("have.class", "closed");
  });

  it("respects isOpen={true}", () => {
    cy.mount(<Statement {...baseProps({ isOpen: true })} />);
    cy.get(".accordion-body").should("have.class", "open");
  });
});
