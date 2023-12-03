import * as ts from 'typescript'
import {AnyType, scanAnyType} from './AnyType'

export interface UnionDeclaration {
    typesOfUnion: AnyType[]
}

export function scanUnionDeclaration(sourceFile: ts.SourceFile, unionDeclaration: ts.Node): UnionDeclaration|undefined { 
    let typesOfUnion: AnyType[] = []

    ts.forEachChild(unionDeclaration, child => {
        const type = scanAnyType(sourceFile, child)

        if (type) {
            typesOfUnion.push(type)
        }
    })

    if (typesOfUnion.length == 0) {
        return undefined
    }

    return {
        typesOfUnion
    }
}