type Language = {
    variables: Variable[];
    statements: {
        [name: string]: Statement
    },
    err: {
        icon: string,
        color: string,
        backgroundColor: string,
    }
}

type Variable = {
    label: string,
    id: string
}

type Statement = {
    component: "cmd" | "compound",
    name: string,
    label?: string,
    icon?: string,
    color?: string,
    backgroundColor?: string,
    parents?: string[],
    avoidParents?: string[],
    positions?: PreferredPosition[],
    avoidPositions?: PreferredPosition[],
    levels?: number[],
    avoidLevels?: number[],
    extensions?: CommandExtensions & ConditionExtensions
}

type PreferredPosition = (number | "first" | "middle" | "last");

type CommandExtensions = ({
    params?: {
        type: "structure"
        defs: {
            name: string,
            type: "number" | "string" | "boolean"
        }[]
    }
} | {
    params?: {
        type: "array"
        defs: "number" | "string" | "boolean"
    }
})

type ConditionExtensions = {
    enableCondition?: boolean
}

export type {
    Language,
    Variable,
    Statement,
    PreferredPosition,
    CommandExtensions,
    ConditionExtensions
}
