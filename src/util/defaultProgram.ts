import { Program } from "../vpl-editor/model/language.model";

const defaultProgram = {
  "block": [
    {
      "name": "fork",
      "block": [
        {
          "name": "if",
          "block": [
            {
              "name": "if",
              "block": [
                {
                  "name": "PowerStrip.1",
                  "params": [
                    "false"
                  ]
                }
              ],
              "condition": "Power Strip.socket_1=== 'true'"
            }
          ],
          "condition": "(hours(now) > 5 && hours(now) < 12 || hours(now) > 13 && hours(now) < 23) && Water Level.lvl_measurement_percent_full > 50"
        },
        {
          "name": "else",
          "block": [
            {
              "name": "if",
              "block": [
                {
                  "name": "PowerStrip.1",
                  "params": [
                    "true"
                  ]
                }
              ],
              "condition": "Power Strip.socket_1 === 'false'"
            },
            {
              "name": "if",
              "block": [
                {
                  "name": "PowerStrip.1",
                  "params": [
                    "false"
                  ]
                }
              ],
              "condition": "Power Strip.socket_1 === 'true'"
            }
          ],
          "condition": ""
        }
      ],
      "condition": ""
    }
  ]
} as Program;

export {defaultProgram};
