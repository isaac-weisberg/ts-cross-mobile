import * as ts from 'typescript'
import { AnyType, scanAnyType } from './AnyType'

export interface TypealiasDeclaration {
    id: string
    type: AnyType
}

export function scanTypealiasDeclaration(sourceFile: ts.SourceFile, typealiasDeclaration: ts.Node): TypealiasDeclaration|undefined { 
    let id: string|undefined
    let type: AnyType|undefined

    ts.forEachChild(typealiasDeclaration, child => {
        if (ts.isIdentifier(child)) {
            id = child.getText(sourceFile)
            return
        }

        const anyType = scanAnyType(sourceFile, child)
        if (anyType) {
            type = anyType
            return
        }
    })

    console.log(`ASDF Typealias: ${id} type:`)
    console.dir(type, { depth: null })
    if (id && type) {
        return {
            id,
            type
        }
    }

    return undefined
}
