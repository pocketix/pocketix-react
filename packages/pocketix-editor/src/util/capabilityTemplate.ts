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
      // A string tag here (vs pocketixng's Type<T> constructor reference) is
      // this platform's idiomatic representation - unused at runtime for
      // "array" params on either platform (only the "structure" case reads
      // defs), so not unified across repos.
      defs: "string"
    }
  }
}

export {capabilityTemplate};
