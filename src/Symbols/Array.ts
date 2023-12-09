import * as ts from 'typescript'
import { ArrayType, AnyType, scanAnyType } from "./AnyType";

export function scanArrayType(sourceFile: ts.SourceFile, arrayNode: ts.ArrayTypeNode): ArrayType|undefined {
    let elementType: AnyType|undefined

    ts.forEachChild(arrayNode, child => {
        const anyType = scanAnyType(sourceFile, child)

        if (anyType) {
            elementType = anyType
            return true
        }
        return undefined
    })

    if (elementType) {
        return {
            kind: 'array',
            elementType: elementType
        }
    }

    return undefined
}