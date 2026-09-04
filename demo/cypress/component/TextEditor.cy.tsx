import { useState } from "react";
import { TextEditor } from "../../../packages/pocketix-editor/src/components/TextEditor";

// Regression test for "debounce timer never cleared on unmount" (see main
// report: a component destroyed mid-debounce still fires its callback later
// against a gone component). Directly checks the functional symptom (the
// callback firing after unmount) rather than relying on a React dev-mode
// console warning, which isn't reliably emitted for hook state setters
// after unmount in React 18.
function UnmountToggleHarness(props: { onProgramChange: (p: unknown) => void }) {
  const [mounted, setMounted] = useState(true);

  return (
    <>
      <button data-testid="unmount" onClick={() => setMounted(false)}>Unmount</button>
      {mounted && <TextEditor program={{ block: [] } as any} onProgramChange={props.onProgramChange} />}
    </>
  );
}

describe("TextEditor debounce timer cleanup", () => {
  it("does not fire the debounced onProgramChange callback after unmount", () => {
    const onProgramChange = cy.stub().as("onProgramChange");

    cy.mount(<UnmountToggleHarness onProgramChange={onProgramChange} />);

    // Valid JSON throughout, so the debounce (if it fires) successfully
    // parses and calls onProgramChange.
    cy.get(".text-area").clear().type("[]", { delay: 0 });
    cy.get('[data-testid="unmount"]').click();

    // Past the 1000ms debounce - if the timer wasn't cleared, its callback
    // fires now against the already-unmounted component.
    cy.wait(1200);

    cy.get("@onProgramChange").should("not.have.been.called");
  });
});
