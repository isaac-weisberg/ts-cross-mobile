import * as ts from 'typescript'
import { LiteralType, scanLiteralType } from './Literal'
import { UnionDeclaration, scanUnionDeclaration } from './Union'


type UnionTypeKind = 'union'
type CustomTypeKind = 'typeref'
type BuiltInTypeKind = 'string' | 'number'

interface CustomType {
    kind: CustomTypeKind,
    customTypeName: string
}

interface BuiltInType {
    kind: BuiltInTypeKind
}

interface UnionType {
    kind: UnionTypeKind
    unionDeclaration: UnionDeclaration
}

export type AnyType = BuiltInType | CustomType | LiteralType | UnionType

export function scanAnyType(sourceFile: ts.SourceFile, node: ts.Node): AnyType|undefined {
    let type: AnyType|undefined
    switch (node.kind) {
    case ts.SyntaxKind.StringKeyword:
        type = {
            kind: 'string'
        }
        break
    case ts.SyntaxKind.NumberKeyword:
        type = {
            kind: 'number'
        }
        break
    case ts.SyntaxKind.TypeReference:
        type = {
            kind: 'typeref',
            customTypeName: node.getText(sourceFile)
        }
        break
    case ts.SyntaxKind.LiteralType:
        const literalType = scanLiteralType(sourceFile, node)

        if (literalType) {
            type = literalType
        }
        break
    case ts.SyntaxKind.UnionType:
        const unionDecl = scanUnionDeclaration(sourceFile, node) 
        
        if (unionDecl) {
            type = {
                kind: 'union',
                unionDeclaration: unionDecl
            }
        }
        break
    default:
        type = undefined
    }

    return type
}
