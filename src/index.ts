import * as ts from 'typescript'
import * as fs from 'fs'
import { findAllSymbols } from './Symbols/AllSymbols'
import { generateSwiftFileForAllSymbols } from './Generators/SwiftGenerator'
import { generateKotlinFileForAllSymbols } from './Generators/KotlinGenerator'

const entryPointParam = process.argv[2]
const swiftFileOutput = process.argv[3]
const kotlinFileOutput = process.argv[4]

if (!entryPointParam) {
    throw new Error('No entry point for the module to traverse')
}
if (!swiftFileOutput) {
    throw new Error('No Swift output file dir')
}
if (!kotlinFileOutput) {
    throw new Error('No Kotlin output file dir')
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

console.dir(allSymbols, { depth: null })

const swiftGeneratedFile = generateSwiftFileForAllSymbols(allSymbols)

console.log('Swift generated file:')
console.log(swiftGeneratedFile)

const kotlinGeneratedFile = generateKotlinFileForAllSymbols(allSymbols)

console.log('Kotlin generated file:')
console.log(kotlinGeneratedFile)

fs.writeFileSync(swiftFileOutput, swiftGeneratedFile)
fs.writeFileSync(kotlinFileOutput, kotlinGeneratedFile)
