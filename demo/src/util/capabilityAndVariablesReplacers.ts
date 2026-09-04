import {Statement, Variable} from "pocketix-react/dist/types/model/meta-language.model";
import {Program} from "pocketix-react/dist/types/model/language.model";

// A plain `.replaceAll(from, to)` has no boundary anchoring, so an id/label
// that's a string-prefix (or substring) of another id/label gets partially
// replaced too - e.g. replacing "54" would also corrupt "5451". `from`/`to`
// can appear embedded inside a larger expression string (not just as a
// whole JSON field value), so this can't be a structural field-by-field
// replace either - it has to stay a string substitution, just anchored so
// it only matches `from` as a whole token (not adjacent to another word
// character or `.`, since reference targets like "5451.Relay1" use dots).
function replaceWholeToken(text: string, from: string, to: string): string {
    if (!from) {
        return text;
    }

    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(?<![\\w.])${escaped}(?![\\w.])`, 'g');

    return text.replace(pattern, to);
}

const serializedToReadableCapabilityAndVariablesReplacer = (program: Program,
                                                            capabilities: ((Statement & { capabilityId: string })[]),
                                                            variables: Variable[]) => {
    let programAsString = JSON.stringify(program);

    capabilities.forEach(item => programAsString = replaceWholeToken(programAsString, item.capabilityId, item.name));
    variables.forEach(item => programAsString = replaceWholeToken(programAsString, item.id, item.label));

    return JSON.parse(programAsString);
};

const readableToSerializedCapabilityAndVariablesReplacer = (program: Program,
                                                            capabilities: ((Statement & { capabilityId: string })[]),
                                                            variables: Variable[]) => {
    let programAsString = JSON.stringify(program);

    capabilities.forEach(item => programAsString = replaceWholeToken(programAsString, item.name, item.capabilityId));
    variables.forEach(item => programAsString = replaceWholeToken(programAsString, item.label, item.id));

    return JSON.parse(programAsString);
};


export {serializedToReadableCapabilityAndVariablesReplacer, readableToSerializedCapabilityAndVariablesReplacer};
