import { type } from "os";
import { AnySymbol } from "../Symbols/AllSymbols";
import { LiteralTypeStringLiteral } from "../Symbols/Literal";

export function generateSwiftFileForAllSymbols(symbols: AnySymbol[]): string {
    let file = ''

    function text(str: string) { file += text }
    function line(str: string|undefined = undefined) { if (str) { file += `${str}\n` } else { file += '\n' } }

    line('// swiftlint:disable all')
    line('// THIS FILE IS AUTOGENERATED VIA ts-cross-mobile. DO NOT EDIT.')
    line()

    for (const symbol of symbols) {
        switch (symbol.kind) {
        case 'interface':
            const interfaceDeclaration = symbol.interfaceDecl

            line(`struct ${interfaceDeclaration.identifier} {`)


            for (const prop of interfaceDeclaration.props) {
                function declarePropertyOfType(type: string) {
                    line(`    let ${prop.identifer}: ${type}`)
                }

                function declareConstantString(valueLiteral: string) {
                    line(`    let ${prop.identifer} = "${valueLiteral}"`)
                }

                switch (prop.type.kind) {
                case 'number':
                    declarePropertyOfType('Double')
                    break
                case 'string':
                    declarePropertyOfType('String')
                    break
                case 'typeref':
                    declarePropertyOfType(prop.type.customTypeName)
                    break
                case 'stringliteral':
                    declareConstantString(prop.type.literal)
                    break
                }
            }

            line('}')
            line()

            break
        case 'typealias':
            const typealias = symbol.typealiasDecl

            switch (typealias.type.kind) {
            case 'union':
                const allTypesAreString = typealias.type.unionDeclaration.typesOfUnion.every(type => {
                    return type.kind == 'stringliteral'
                })

                if (allTypesAreString) {
                    // Good, means I can generate an enum

                    line(`enum ${typealias.id}: String, Codable {`)
                    for (const type of typealias.type.unionDeclaration.typesOfUnion) {
                        const value = (type as LiteralTypeStringLiteral).literal

                        line(`    case ${value}`)
                    }

                    line(`}`)
                    line()

                    break
                }

                // unsupported
                
                break
            default:
                // unsupported
                break
            }

            break
        }
    }

    return file
}