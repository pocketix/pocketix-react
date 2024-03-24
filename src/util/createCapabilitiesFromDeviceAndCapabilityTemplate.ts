import { Device } from "../generated";
import { Statement } from "../vpl-editor/model/meta-language.model";
import { capabilityTemplate } from "../vpl-editor/util/capabilityTemplate";

const createCapabilitiesFromDeviceAndCapabilityTemplate = (device: Device): (Statement & {capabilityId: string})[] => {
  const deviceName = device.deviceName.replace(/[\s-+*/.]/g, "");
  return device.capabilities?.map(capability => ({
    ...capabilityTemplate,
    label: `${deviceName}.${capability.name}`,
    name: `${deviceName}.${capability.name}`,
    capabilityId: `${device.deviceUid}.${capability.id}`
  })) || [];
}

export {createCapabilitiesFromDeviceAndCapabilityTemplate};
