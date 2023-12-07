import * as ts from 'typescript'
import { LiteralType, scanLiteralType } from './Literal'
import { UnionDeclaration, scanUnionDeclaration } from './Union'

type UnionTypeKind = 'union'
type TypeReferenceTypeKind = 'typeref'
type BuiltInTypeKind = 'string' | 'number' | 'void'

interface TypeReferenceType {
    kind: TypeReferenceTypeKind,
    identifier: string
    genericTypeParameters: AnyType[]
}

interface BuiltInType {
    kind: BuiltInTypeKind
}

interface UnionType {
    kind: UnionTypeKind
    unionDeclaration: UnionDeclaration
}

export type AnyType = BuiltInType | TypeReferenceType | LiteralType | UnionType

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
        const typeRef = scanTypeReference(sourceFile, node as ts.TypeReferenceType)
        if (typeRef) {
            type = typeRef
        }
        break
    case ts.SyntaxKind.VoidKeyword:
        type = {
            kind: 'void'
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

export function scanTypeReference(sourceFile: ts.SourceFile, typeref: ts.TypeReferenceType): TypeReferenceType|undefined {
    let id: string|undefined
    let genericTypeParams: AnyType[] = []

    ts.forEachChild(typeref, child => {
        if (ts.isIdentifier(child)) {
            id = child.getText(sourceFile)
            return
        }

        const anyType = scanAnyType(sourceFile, child)
        if (anyType) {
            genericTypeParams.push(anyType)
        }
    })
    if (id) {
        return {
            kind: 'typeref',
            identifier: id,
            genericTypeParameters: genericTypeParams
        }
    }
    return undefined
}