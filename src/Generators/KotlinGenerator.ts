import { AnySymbol } from "../Symbols/AllSymbols";
import { AnyType } from "../Symbols/AnyType";
import { LiteralTypeStringLiteral } from "../Symbols/Literal";

function getTypeIdentifierWriting(type: AnyType): string {
    switch (type.kind) {
        case 'number':
            return 'Double'
        case 'string':
            return 'String'
        case 'typeref':
            return type.identifier
        case 'stringliteral':
            return `"${type.literal}" /* what else did you want? */`
        case 'array':
            return `Array<${getTypeIdentifierWriting(type.elementType)}>`
        case 'void':
            return 'Unit'
        case 'union':
            return type.unionDeclaration.typesOfUnion.map(type => getTypeIdentifierWriting(type)).join(' | ')
    }
}

export function generateKotlinFileForAllSymbols(symbols: AnySymbol[]): string {
    let file = ''

    function text(str: string) { file += text }
    function line(str: string|undefined = undefined) { if (str) { file += `${str}\n` } else { file += '\n' } }

    line('// THIS FILE IS AUTOGENERATED VIA ts-cross-mobile. DO NOT EDIT.')
    line()

    for (const symbol of symbols) {
        switch (symbol.kind) {
        case 'interface':
            const interfaceDeclaration = symbol.interfaceDecl

            line(`data class ${interfaceDeclaration.identifier} (`)

            for (const prop of interfaceDeclaration.props) {
                function declarePropertyOfType(type: string) {
                    line(`    val ${prop.identifer}: ${type}`)
                }

                function declareStringParamWithDefaultValue(valueLiteral: string) {
                    line(`    val ${prop.identifer} = "${valueLiteral}"`)
                }

                if (prop.type.kind == 'stringliteral') {
                    declareStringParamWithDefaultValue(prop.type.literal)
                    continue
                }

                const typeWriting = getTypeIdentifierWriting(prop.type)

                declarePropertyOfType(typeWriting)
            }

            line(')')
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

                    line(`enum class ${typealias.id} {`)
                    for (const type of typealias.type.unionDeclaration.typesOfUnion) {
                        const value = (type as LiteralTypeStringLiteral).literal

                        line(`    ${value},`)
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