import { Block, CompoundStatement, Program, Statement } from "../model/language.model";
function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 10); // Random string of 8 characters
}
function generateUniqueId(seenIds: Set<string>): string {
  let id = generateRandomId();

  while (seenIds.has(id)) {
    id = generateRandomId();
  }

  return id;
}

function generateIds(program: Program): Program {
  const seenIds = new Set<string>();

  // Helper function to generate IDs recursively for a block
  function generateIdsRecursive(block: Block): Block {
    return block.map((statement: Statement) => {
      // A pre-existing id that collides with one already seen elsewhere in
      // the tree (e.g. a caller-supplied program with duplicate ids) is
      // treated as if it were missing, not reused as-is.
      const id = (statement.id && !seenIds.has(statement.id)) ? statement.id : generateUniqueId(seenIds);
      seenIds.add(id);

      if ("block" in statement) {
        // If the statement is a CompoundStatement, generate IDs for its block recursively
        return { ...(statement as Statement), block: generateIdsRecursive((statement as CompoundStatement).block), id};
      }

      return {...statement, id};
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

export {generateIds, removeIds, generateRandomId}
