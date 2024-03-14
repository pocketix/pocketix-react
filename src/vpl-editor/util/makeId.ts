import { Block, CompoundStatement, Program, Statement } from "../model/language.model";
function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 10); // Random string of 8 characters
}
function generateIds(program: Program): Program {
  // Helper function to generate IDs recursively for a block
  function generateIdsRecursive(block: Block): Block {
    return block.map((statement: Statement) => {
      if ("block" in statement) {
        // If the statement is a CompoundStatement, generate IDs for its block recursively
        return { ...(statement as Statement), block: generateIdsRecursive((statement as CompoundStatement).block), id: generateRandomId()  };
      }

      return { ...statement, id: generateRandomId() };
    });
  }

  return { block: generateIdsRecursive(program.block) };
}

function removeIds(program: Program): Program {
  // Helper function to generate IDs recursively for a block
  function removeIdsRecursive(block: Block): Block {
    return block.map((statement: Statement) => {
      if ("block" in statement) {
        // If the statement is a CompoundStatement, generate IDs for its block recursively
        return { ...(statement as Statement), block: removeIdsRecursive((statement as CompoundStatement).block), id: undefined  };
      }

      return { ...statement, id: undefined };
    });
  }

  return { block: removeIdsRecursive(program.block) };
}

export {generateIds, removeIds}
