import { Device } from "../generated";
import { Statement } from "pocketix-react/dist/types/model/meta-language.model";
import {capabilityTemplate} from "pocketix-react";

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
