import { generateIds } from "../../../packages/iotix-editor/src/util/makeId";
import type { Program } from "../../../packages/iotix-editor/src/model/language.model";

// Regression test for "no id-collision detection in util/makeId.ts" (see
// main report: a caller-supplied program with pre-existing duplicate ids
// produced duplicate React keys - generateIds() only filled in ids for
// id-less nodes, it never checked whether an *existing* id collided with
// another node's id elsewhere in the tree).
describe("generateIds id-collision detection", () => {
  it("assigns distinct ids to sibling statements that arrive with the same pre-existing id", () => {
    const program: Program = {
      block: [
        { id: "dup", name: "setValue", params: ["first"] },
        { id: "dup", name: "setValue", params: ["second"] },
      ],
    };

    const result = generateIds(program);
    const ids = result.block.map((statement) => statement.id);

    expect(new Set(ids).size).to.equal(ids.length);
  });

  it("assigns distinct ids across nested compound-statement blocks too", () => {
    const program: Program = {
      block: [
        {
          id: "dup",
          name: "if",
          condition: "",
          block: [{ id: "dup", name: "setValue", params: ["nested"] }],
        },
        { id: "dup", name: "setValue", params: ["sibling"] },
      ],
    };

    const result = generateIds(program);
    const outer = result.block as any[];
    const ids = [outer[0].id, outer[0].block[0].id, outer[1].id];

    expect(new Set(ids).size).to.equal(ids.length);
  });
});
