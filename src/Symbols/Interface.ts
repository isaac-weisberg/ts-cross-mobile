import * as ts from 'typescript'
import { AnyType, scanAnyType } from './AnyType'


export interface InterfaceDeclaration {
    identifier: string
    props: PropSignature[]
}


export interface PropSignature {
    identifer: string
    type: AnyType
}

export function scanInterfaceDeclaration(sourceFile: ts.SourceFile, interfaceDeclaration: ts.Node): InterfaceDeclaration|undefined {
    let identifier: string|undefined
    let props: PropSignature[] = []
    

    ts.forEachChild(interfaceDeclaration, (child) => {
        switch (child.kind) {
        case ts.SyntaxKind.Identifier:
            identifier = child.getText(sourceFile)
            break
        case ts.SyntaxKind.PropertySignature:
            const propSignature = scanPropSignature(sourceFile, child)
            if (propSignature) {
                props.push(propSignature)
            }
            break
        }
    })

    if (identifier) {
        const interfaceDecl: InterfaceDeclaration = {
            identifier: identifier,
            props: props
        }
        // console.log('Found interface:')
        // console.dir(interfaceDecl, { depth: null })
        return interfaceDecl
    }

    return undefined
}

function scanPropSignature(sourceFile: ts.SourceFile, propSignature: ts.Node): PropSignature|undefined {
    let id: string|undefined
    let type: AnyType|undefined

    ts.forEachChild(propSignature, child => {
        if (ts.isIdentifier(child)) {
            id = child.getText(sourceFile)
            return
        }
        
        const theType = scanAnyType(sourceFile, child)
        if (theType) {
            type = theType
            return
        }
    })

    if (id && type) {
        return {
            identifer: id,
            type: type
        }
    }
    
    return undefined
}