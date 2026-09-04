import {
  serializedToReadableCapabilityAndVariablesReplacer,
  readableToSerializedCapabilityAndVariablesReplacer,
} from "../../src/util/capabilityAndVariablesReplacers";
import { createVariablesFromDevice } from "../../src/util/createVariablesFromDevice";

// Regression test for "naive whole-JSON substring replace" (see main
// report: a plain `.replaceAll(id, name)` over the whole serialized
// program has no boundary anchoring, so an id/label that's a string-prefix
// of another id/label gets partially replaced too).
describe("capabilityAndVariablesReplacers boundary anchoring", () => {
  it("does not let a shorter capabilityId corrupt a longer one that contains it as a prefix", () => {
    const program = { block: [{ name: "5451", params: [] }] } as any;
    const capabilities = [
      { capabilityId: "54", name: "ShortDevice", component: "cmd" },
      { capabilityId: "5451", name: "LongDevice", component: "cmd" },
    ] as any;

    const result = serializedToReadableCapabilityAndVariablesReplacer(program, capabilities, []);

    expect(result.block[0].name).to.equal("LongDevice");
  });

  it("does not let a shorter variable id corrupt a longer one embedded in a condition string", () => {
    const program = {
      block: [{ name: "if", condition: "5451.Relay1 === 'open'", block: [] }],
    } as any;
    const variables = [
      { id: "54", label: "shortVar" },
      { id: "5451.Relay1", label: "relayState" },
    ];

    const result = serializedToReadableCapabilityAndVariablesReplacer(program, [], variables);

    expect(result.block[0].condition).to.equal("relayState === 'open'");
  });

  it("round-trips a program through readable and back to serialized form", () => {
    const program = { block: [{ name: "5451", params: [] }] } as any;
    const capabilities = [
      { capabilityId: "54", name: "ShortDevice", component: "cmd" },
      { capabilityId: "5451", name: "LongDevice", component: "cmd" },
    ] as any;

    const readable = serializedToReadableCapabilityAndVariablesReplacer(program, capabilities, []);
    const backToSerialized = readableToSerializedCapabilityAndVariablesReplacer(readable, capabilities, []);

    expect(backToSerialized).to.deep.equal(program);
  });
});

// Regression test for "capability names are sanitized but variable labels
// are not" (see main report: createCapabilitiesFromDeviceAndCapabilityTemplate.ts
// strips whitespace/operators/dots from device.deviceName, but
// createVariablesFromDevice.ts didn't - a variable label containing a
// space embeds an invalid token into condition strings once its label is
// substituted in, now that checkExpression() actually validates syntax).
describe("createVariablesFromDevice label sanitization", () => {
  it("strips whitespace and operator characters from the device name in the label", () => {
    const device = {
      deviceUid: "5451",
      deviceName: "Living Room Lamp",
      parameterValues: [{ type: { name: "brightness", label: "Brightness" } }],
    } as any;

    const variables = createVariablesFromDevice(device);

    expect(variables).to.deep.equal([
      { id: "5451.brightness", label: "LivingRoomLamp.Brightness" },
    ]);
  });
});
