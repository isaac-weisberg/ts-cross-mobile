import * as ts from 'typescript'
import { InterfaceDeclaration, scanInterfaceDeclaration } from "./Interface"
import { TypealiasDeclaration, scanTypealiasDeclaration } from './Typealias'

type SymbolTypeTypealiasKind = 'typealias'
type SymbolTypeInterfaceKind = 'interface'

interface GenerationOptions {
    shouldScan: boolean
    shouldGenerate: boolean
    shouldGenerateJsonSerialization: boolean
}

export interface SymbolTypeInterface {
    kind: SymbolTypeInterfaceKind,
    interfaceDecl: InterfaceDeclaration
    generationOptions: GenerationOptions
}

export interface SymbolTypeTypealias {
    kind: SymbolTypeTypealiasKind
    typealiasDecl: TypealiasDeclaration
    generationOptions: GenerationOptions
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
    
    const generationOpts = getGenerationOptions(sourceFile, node)
    if (!generationOpts.shouldScan) {
        return []
    }

    switch (node.kind) {
    case ts.SyntaxKind.InterfaceDeclaration:
        const interfaceDeclaration = scanInterfaceDeclaration(sourceFile, node)

        if (interfaceDeclaration) {
            allSymbols.push({
                kind: 'interface',
                interfaceDecl: interfaceDeclaration,
                generationOptions: generationOpts
            })
        }
        break
    case ts.SyntaxKind.TypeAliasDeclaration:
        const typealiasDeclaration = scanTypealiasDeclaration(sourceFile, node)

        if (typealiasDeclaration) {
            allSymbols.push({
                kind: 'typealias',
                typealiasDecl: typealiasDeclaration,
                generationOptions: generationOpts
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

function getGenerationOptions(sourceFile: ts.SourceFile, node: ts.Node): GenerationOptions {
    let shouldGenerate: boolean|undefined
    let shouldGenerateJson: boolean|undefined

    const commentRanges = ts.getLeadingCommentRanges(
        sourceFile.getFullText(),
        node.getFullStart()
    )

    if (commentRanges) {
        commentRanges.forEach(range => {
            const commentText = sourceFile.getFullText().substring(range.pos, range.end);
            if (commentText.includes('gen')) {
                shouldGenerate = true
            }

            if (commentText.includes('json')) {
                shouldGenerateJson = true
            }
        })
    }

    return {
        shouldScan: true, 
        shouldGenerate: shouldGenerate || false,
        shouldGenerateJsonSerialization: shouldGenerateJson || false
    }
}