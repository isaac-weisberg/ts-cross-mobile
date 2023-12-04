import * as ts from 'typescript'
import * as fs from 'fs'
import { findAllSymbols } from './Symbols/AllSymbols'
import { generateSwiftFileForAllSymbols } from './Generators/SwiftGenerator'

const entryPointParam = process.argv[2]
const swiftFileOutput = process.argv[3]

if (!entryPointParam) {
    throw new Error('No entry point for the module to traverse')
}
if (!swiftFileOutput) {
    throw new Error('No Swift output file dir')
}

if (!fs.existsSync(entryPointParam)) {
    throw new Error(`Entry point ${entryPointParam} doesn't exist`)
}

console.log('Scanning at', entryPointParam)

const program = ts.createProgram({
    rootNames: [ entryPointParam ],
    options: {

    }
})

const allSymbols = findAllSymbols(program)

const swiftGeneratedFile = generateSwiftFileForAllSymbols(allSymbols)

console.dir(allSymbols, { depth: null })
console.log('Swift generated file:')
console.log(swiftGeneratedFile)


fs.writeFileSync(swiftFileOutput, swiftGeneratedFile)
