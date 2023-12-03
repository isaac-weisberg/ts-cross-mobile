import * as ts from 'typescript'

type LiteralTypeStringLiteralKind = 'stringliteral'

export interface LiteralTypeStringLiteral {
    kind: LiteralTypeStringLiteralKind
    literal: string
}

export type LiteralType = LiteralTypeStringLiteral

export function scanLiteralType(sourceFile: ts.SourceFile, literalType: ts.Node): LiteralType|undefined {
    let resultType: LiteralType|undefined

    ts.forEachChild(literalType, child => {
        switch (child.kind) {
        case ts.SyntaxKind.StringLiteral:
            const stringTextFromCode = child.getText(sourceFile)
            const stringTextWithoutQuotes = stringTextFromCode.substring(1, stringTextFromCode.length - 1)

            resultType = {
                kind: 'stringliteral',
                literal: stringTextWithoutQuotes
            }
            break
        }
    })

    return resultType
}
