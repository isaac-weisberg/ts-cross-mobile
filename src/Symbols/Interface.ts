import * as ts from 'typescript'


export interface InterfaceDeclaration {
    identifier: string
    props: PropSignature[]
}


type PropSignatureCustomTypeKind = 'typeref'
type PropSignatureBuildInTypeKind = 'string' | 'number'

interface PropSignatureCustomType {
    kind: PropSignatureCustomTypeKind,
    customTypeName: string
}

interface PropSignatureBuildInType {
    kind: PropSignatureBuildInTypeKind
}

type PropSignatureType = PropSignatureBuildInType | PropSignatureCustomType

interface PropSignature {
    identifer: string
    type: PropSignatureType
}

export function scanInterfaceDeclaration(sourceFile: ts.SourceFile, interfaceDeclaration: ts.Node): InterfaceDeclaration|undefined {
    let identifier: string|undefined
    let props: PropSignature[] = []

    ts.forEachChild(interfaceDeclaration, (child) => {
        switch (child.kind) {
        case ts.SyntaxKind.ExportKeyword:
            break
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
    let id: string
    let type: PropSignatureType|undefined

    ts.forEachChild(propSignature, child => {
        switch (child.kind) {
        case ts.SyntaxKind.Identifier:
            id = child.getText(sourceFile)
            break
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
                customTypeName: child.getText(sourceFile)
            }
            break
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