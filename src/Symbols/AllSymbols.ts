import * as ts from 'typescript'
import { InterfaceDeclaration, scanInterfaceDeclaration } from "./Interface"

type SymbolTypeInterfaceKind = 'interface'

interface SymbolTypeInterface {
    kind: SymbolTypeInterfaceKind,
    interfaceDecl: InterfaceDeclaration
}

export type AnySymbol = SymbolTypeInterface

export function findAllSymbols(program: ts.Program): AnySymbol[] {
    let allSymbols: AnySymbol[] = []

    for (const sourceFile of program.getSourceFiles()) {
        if (sourceFile.isDeclarationFile) {
            continue
        }

        const symbols = findAllSymbolsInSourceFile(sourceFile)
        allSymbols = allSymbols.concat(symbols)
    }

    return allSymbols
}

function findAllSymbolsInSourceFile(sourceFile: ts.SourceFile): AnySymbol[] {
    console.log("Source file:", sourceFile.fileName)
    let allSymbols: AnySymbol[] = []

    ts.forEachChild(sourceFile, child => {
        const symbols = scanNodeForAnySymbols(sourceFile, child, 1)
        allSymbols = allSymbols.concat(symbols)
    })

    return allSymbols
}

function scanNodeForAnySymbols(sourceFile: ts.SourceFile, node: ts.Node, indentationLevel: number): AnySymbol[] {
    let allSymbols: AnySymbol[] = []
    const prexix = '--'.repeat(indentationLevel)

    let nodeText: string|undefined = undefined
    if ((node as any).text) {
        nodeText = node.getText(sourceFile)
    }

    // console.log(`${prexix}${ts.SyntaxKind[node.kind]}${nodeText?` ${nodeText}`: ''}`, )

    if (node.kind == ts.SyntaxKind.InterfaceDeclaration) {
        const interfaceDeclaration = scanInterfaceDeclaration(sourceFile, node)

        if (interfaceDeclaration) {
            allSymbols.push({
                kind: 'interface',
                interfaceDecl: interfaceDeclaration
            })
        }   
    }
    ts.forEachChild(node, (child) => {
        const symbols = scanNodeForAnySymbols(sourceFile, child, indentationLevel + 1)
        allSymbols = allSymbols.concat(symbols)
    })

    return allSymbols
}
