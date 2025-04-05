import { Device } from "../generated";
import { Variable } from "pocketix-react/dist/types/model/meta-language.model";

const createVariablesFromDevice = (device: Device): Variable[] => device.parameterValues?.map(parameter => ({
  id: `${device.deviceUid}.${parameter.type.name}`,
  label: `${device.deviceName}.${parameter.type.label}`
})) || []

export {createVariablesFromDevice};
