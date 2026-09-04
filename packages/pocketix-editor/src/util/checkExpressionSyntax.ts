import jsep from "jsep";

// Reference targets are shaped `deviceId.parameterName` (e.g. "5451.Relay1"),
// where deviceId is typically numeric - jsep can't tokenize a member
// expression whose object starts with a digit, so those tokens are
// rewritten into synthetic identifiers before parsing. Mirrors
// pocketix-node's BasicConditionParser, which applies the same pre-scan
// before running the real (whitelisted) parse used at evaluation time.
const REFERENCE_REGEX = /(\w+)\.([A-Za-z_]\w*)/g;

function stripReferences(raw: string): string {
  return raw.replace(REFERENCE_REGEX, (_match, device, param) => `__pxRef_${device}_${param}`);
}

/**
 * Checks whether `raw` is a syntactically parseable expression. This is
 * advisory editor feedback only (catches typos like unbalanced parens or a
 * trailing operator before the user commits the value) - it does not
 * enforce the same operator whitelist pocketix-node's interpreter applies
 * at evaluation time, since that's a runtime security boundary, not a
 * syntax check.
 */
function isValidExpressionSyntax(raw: string): boolean {
  if (raw === undefined || raw === null || raw.trim() === "") {
    return true;
  }

  try {
    jsep(stripReferences(raw));
    return true;
  } catch (e) {
    return false;
  }
}

export { isValidExpressionSyntax };
