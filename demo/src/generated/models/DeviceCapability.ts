/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CapabilityParameter } from './CapabilityParameter';
import type { CapabilityType } from './CapabilityType';
import type { Device } from './Device';

export type DeviceCapability = {
    id: number;
    name: string;
    type: CapabilityType;
    parameters: Array<CapabilityParameter>;
    device: Device;
};
