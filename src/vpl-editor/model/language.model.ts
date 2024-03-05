type Program = {
    block: Block
};

type Block = Statement[];

type Statement = AbstractStatement | CompoundStatement | Command;

type AbstractStatement = {
    name: string
}

type CompoundStatement = AbstractStatement & {
    condition?: Expression,
    block: Block
}

type Command = AbstractStatement & {
    params: Expression[]
}

type Expression = string;

export type {
    Program,
    Block,
    Statement,
    AbstractStatement,
    CompoundStatement,
    Command,
    Expression
};
