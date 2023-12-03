import * as ts from 'typescript'
import { InterfaceDeclaration, scanInterfaceDeclaration } from './Symbols/Interface'
import { findAllSymbols } from './Symbols/AllSymbols'

const entryPointParam = process.argv[2]

if (!entryPointParam) {
    throw new Error('No entry point for the module to traverse')
}

console.log('Scanning at', entryPointParam)

const program = ts.createProgram({
    rootNames: [ entryPointParam ],
    options: {

    }
})

const allSymbols = findAllSymbols(program)

console.dir(allSymbols, { depth: null })
