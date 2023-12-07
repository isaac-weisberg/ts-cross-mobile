import * as ts from 'typescript'
import { AnyType, scanAnyType } from './AnyType'

export interface MethodSignatureParam {
    id: string
    type: AnyType
}

export interface MethodSignature {
    identifier: string
    params: MethodSignatureParam[]
}

export function scanMethodSignature(sourceFile: ts.SourceFile, methodSignature: ts.Node): MethodSignature|undefined {
    let identifier: string|undefined
    let params: MethodSignatureParam[] = []

    ts.forEachChild(methodSignature, (child) => {
        if (ts.isIdentifier(child)) {
            identifier = child.getText(sourceFile)
            return
        }
 
        if (ts.isParameter(child)) {
            const param = scanMethodSignatureParam(sourceFile, child)
            if (param) {
                params.push(param)
            }
            return
        }
    })

    if (identifier) {
        return {
            identifier,
            params
        }
    }

    return undefined
}

function scanMethodSignatureParam(sourceFile: ts.SourceFile, param: ts.ParameterDeclaration): MethodSignatureParam|undefined {
    let id: string|undefined
    let type: AnyType|undefined

    ts.forEachChild(param, child => {
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

    if (id && type) {
        return {
            id, type
        }
    }
}

