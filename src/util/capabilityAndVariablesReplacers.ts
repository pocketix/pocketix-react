import {Statement, Variable} from "../vpl-editor/model/meta-language.model";
import {Program} from "../vpl-editor/model/language.model";

const serializedToReadableCapabilityAndVariablesReplacer = (program: Program,
                                                            capabilities: ((Statement & { capabilityId: string })[]),
                                                            variables: Variable[]) => {
    let programAsString = JSON.stringify(program);

    capabilities.forEach(item => programAsString = programAsString
        .replaceAll(item.capabilityId, item.name));
    variables.forEach(item => programAsString = programAsString.replaceAll(item.id, item.label));

    return JSON.parse(programAsString);
};

const readableToSerializedCapabilityAndVariablesReplacer = (program: Program,
                                                            capabilities: ((Statement & { capabilityId: string })[]),
                                                            variables: Variable[]) => {
    let programAsString = JSON.stringify(program);

    capabilities.forEach(item => programAsString = programAsString
        .replaceAll(item.name, item.capabilityId));
    variables.forEach(item => programAsString = programAsString.replaceAll(item.label, item.id));

    return JSON.parse(programAsString);
};


export {serializedToReadableCapabilityAndVariablesReplacer, readableToSerializedCapabilityAndVariablesReplacer};
