import { Device } from "../generated";
import { Variable } from "iotix-react/dist/types/model/meta-language.model";

const createVariablesFromDevice = (device: Device): Variable[] => {
  // Matches createCapabilitiesFromDeviceAndCapabilityTemplate.ts's
  // sanitization - an unsanitized device name containing a space embeds an
  // invalid token into condition strings once its label is substituted in.
  const deviceName = device.deviceName.replace(/[\s\-+*/.]/g, "");

  return device.parameterValues?.map(parameter => ({
    id: `${device.deviceUid}.${parameter.type.name}`,
    label: `${deviceName}.${parameter.type.label}`
  })) || [];
}

export {createVariablesFromDevice};
