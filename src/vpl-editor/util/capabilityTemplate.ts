import { Statement } from "../model/meta-language.model";

const capabilityTemplate: Statement = {
  name: "cmd",
  component: "cmd",
  icon: "pi-bolt",
  color: "white",
  backgroundColor: "#99A8D7",
  avoidParents: [ "fork", "switch" ],
  extensions: {
    params: {
      type: "array",
      defs: "string"
    }
  }
}

export {capabilityTemplate};
