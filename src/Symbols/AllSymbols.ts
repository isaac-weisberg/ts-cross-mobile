import * as ts from 'typescript'
import { InterfaceDeclaration, scanInterfaceDeclaration } from "./Interface"
import { TypealiasDeclaration, scanTypealiasDeclaration } from './Typealias'

type SymbolTypeTypealiasKind = 'typealias'
type SymbolTypeInterfaceKind = 'interface'

interface SymbolTypeInterface {
    kind: SymbolTypeInterfaceKind,
    interfaceDecl: InterfaceDeclaration
}

interface SymbolTypeTypealias {
    kind: SymbolTypeTypealiasKind
    typealiasDecl: TypealiasDeclaration
}

export type AnySymbol = SymbolTypeInterface | SymbolTypeTypealias

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

    console.log(`${prexix}${ts.SyntaxKind[node.kind]}${nodeText?` ${nodeText}`: ''}`, )

    switch (node.kind) {
    case ts.SyntaxKind.InterfaceDeclaration:
        if (!shouldScanTheNodeProperly(sourceFile, node)) {
            return []
        }

        const interfaceDeclaration = scanInterfaceDeclaration(sourceFile, node)

        if (interfaceDeclaration) {
            allSymbols.push({
                kind: 'interface',
                interfaceDecl: interfaceDeclaration
            })
        }
        break
    case ts.SyntaxKind.TypeAliasDeclaration:
        if (!shouldScanTheNodeProperly(sourceFile, node)) {
            return []
        }
        const typealiasDeclaration = scanTypealiasDeclaration(sourceFile, node)

        if (typealiasDeclaration) {
            allSymbols.push({
                kind: 'typealias',
                typealiasDecl: typealiasDeclaration
            })
        }
        break
    }
    ts.forEachChild(node, (child) => {
        const symbols = scanNodeForAnySymbols(sourceFile, child, indentationLevel + 1)
        allSymbols = allSymbols.concat(symbols)
    })

    return allSymbols
}

function shouldScanTheNodeProperly(sourceFile: ts.SourceFile, node: ts.Node): boolean {
    const commentRanges = ts.getLeadingCommentRanges(
        sourceFile.getFullText(),
        node.getFullStart()
    )

    if (commentRanges) {
        const hasTag = commentRanges.some(range => {
            const commentText = sourceFile.getFullText().substring(range.pos, range.end);
            return commentText.includes('// gen');
        });

        if (hasTag) {
            return true
        }
    }

    return false
}