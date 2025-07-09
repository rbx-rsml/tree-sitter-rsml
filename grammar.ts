/**
 * @file Rsml grammar for tree-sitter
 * @author Cameron P Campbell
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

type RemoveType<T extends any[], R> = T extends [infer First, ...infer Rest]
    ? First extends R
        ? Exclude<First, R>
        : [First, ...RemoveType<Rest, R>]
    : [];

const BRICK_COLORS = "white|grey|lightyellow|brickyellow|lightgreen|lightreddishviolet|pastelblue|lightorangebrown|nougat|brightred|medreddishviolet|brightblue|brightyellow|earthorange|black|darkgrey|darkgreen|mediumgreen|ligyellowichorange|brightgreen|darkorange|lightbluishviolet|transparent|trred|trlgblue|trblue|tryellow|lightblue|trflureddishorange|trgreen|trflugreen|phosphwhite|lightred|mediumred|mediumblue|lightgrey|brightviolet|bryellowishorange|brightorange|brightbluishgreen|earthyellow|brightbluishviolet|trbrown|mediumbluishviolet|trmedireddishviolet|medyellowishgreen|medbluishgreen|lightbluishgreen|bryellowishgreen|ligyellowishgreen|medyellowishorange|brreddishorange|brightreddishviolet|lightorange|trbrightbluishviolet|darknougat|silver|neonorange|neongreen|sandblue|sandviolet|mediumorange|sandyellow|earthblue|earthgreen|trflublue|sandbluemetallic|sandvioletmetallic|sandyellowmetallic|darkgreymetallic|blackmetallic|lightgreymetallic|sandgreen|sandred|darkred|trfluyellow|trflured|gunmetallic|redflipflop|yellowflipflop|silverflipflop|curry|fireyellow|flameyellowishorange|reddishbrown|flamereddishorange|mediumstonegrey|royalblue|darkroyalblue|brightreddishlilac|darkstonegrey|lemonmetalic|lightstonegrey|darkcurry|fadedgreen|turquoise|lightroyalblue|mediumroyalblue|brown|reddishlilac|lightlilac|brightpurple|lightpurple|lightpink|lightbrickyellow|warmyellowishorange|coolyellow|doveblue|mediumlilac|slimegreen|smokygrey|darkblue|parsleygreen|steelblue|stormblue|lapis|darkindigo|seagreen|shamrock|fossil|mulberry|forestgreen|cadetblue|electricblue|eggplant|moss|artichoke|sagegreen|ghostgrey|lilac|plum|olivine|laurelgreen|quillgrey|crimson|mint|babyblue|carnationpink|persimmon|maroon|gold|daisyorange|pearl|fog|salmon|terracotta|cocoa|wheat|buttermilk|mauve|sunrise|tawny|rust|cashmere|khaki|lilywhite|seashell|burgundy|cork|burlap|beige|oyster|pinecone|fawnbrown|hurricanegrey|cloudygrey|linen|copper|mediumbrown|bronze|flint|darktaupe|burntsienna|institutionalwhite|midgray|reallyblack|reallyred|deeporange|alder|dustyrose|olive|newyeller|reallyblue|navyblue|deepblue|cyan|cgabrown|magenta|pink|teal|toothpaste|limegreen|camo|grime|lavender|pastellightblue|pastelorange|pastelviolet|pastelbluegreen|pastelgreen|pastelyellow|pastelbrown|royalpurple|hotpink"

const CSS_COLORS = "aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|goldenrod|gold|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavenderblush|lavender|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen"

const array_remove_null = <const A extends Array<any>>(arr: A): RemoveType<A, null> => arr.filter(e => e !== null) as any

const create_color_code = (
    $: GrammarSymbols<string>,
    name: string,
    color: string | SymbolRule<string>,
    shade: string | SymbolRule<string> | null
) => {
    return prec(999, seq(
        ...array_remove_null([
            field("name", new RustRegex(`(?i)${name}:`)),
            
            field("color", choice(
                typeof color == "string"
                    ? new RustRegex(`(?i)${color}`)
                    : color,
                $.static_argument
            )),

            shade ? optional(seq(
                ":",
                field("shade", choice(
                    typeof shade == "string"
                        ? new RustRegex(`(?i)${shade}`)
                        : shade,
                    $.static_argument
                ))
            )) : null
        ])
    ))
}

const create_list = (
    item: SymbolRule<string> | SeqRule,
    sep: SymbolRule<string> | ChoiceRule
) => seq(optional(sep), repeat(seq(item, sep)), item)

// rules can't be used inside `token` or `token`.
const IDENTIFIER = new RustRegex("[_a-zA-Z][_a-zA-Z\\d]*")
const NUMBER_AMIGUOUS = new RustRegex("[\\d_]*\\.?[\\d_]+")

module.exports = grammar({
    name: "rsml",

    extras: $ => [$.comment, new RustRegex("\\s"), $.macro_call],

    externals: $ => [
        $._block_comment_start,
        $._block_comment_content,
        $._block_comment_end,

        $._block_string_start,
        $._block_string_content,
        $._block_string_end,
    ],

    rules: {
        source_file: $ => repeat($._definition),

        _definition_no_macro: $ => choice(
            $.static_token_assignment,
            $.token_assignment,
            $.rule_scope,
            $.derive_declaration,
            $.semi_colon
        ),
        _definition: $ => choice(
            $.macro_declaration,
            $._definition_no_macro
        ),

        identifier: $ => IDENTIFIER,

        comma: $ => ",",
        semi_colon: $ => ";",
        colon: $ => ":",
        equals: $ => "=",

        token: $ => token(seq("$", IDENTIFIER)),
        static_token: $ => token(seq("$!", IDENTIFIER)),
        static_argument: $ => token(seq("&", IDENTIFIER)),
        reference: $ => choice($.static_token, $.static_argument, $.token),

        property_assignment: $ => field("property_assignment", seq($.identifier, $.equals, optional($.datatype), $.semi_colon)),
        token_assignment: $ => field("token_assignment", seq($.token, $.equals, optional($.datatype), $.semi_colon)),
        static_token_assignment: $ => field("static_token_assignment", seq($.static_token, $.equals, optional($.datatype), $.semi_colon)),

        macro_declaration: $ => seq("@macro", $.identifier, optional($.macro_args), $.macro_scope),
        macro_args: $ => seq(
            $.tuple_open,
            create_list($.static_argument, choice($.comma, $.semi_colon)),
            $.tuple_close,
        ),
        macro_scope: $ => seq(
            $.scope_open,
            field("body", repeat(choice(
                $._definition_no_macro,
                prec(1, $.static_argument),
                prec(2, $.identifier)
            ))),
            $.scope_close
        ),

        macro_call: $ => seq(
            field("annotation", token(seq(IDENTIFIER, "!"))),
            $.tuple_open,
            create_list($.datatype, choice($.comma, $.semi_colon)),
            $.tuple_close
        ),

        priority_declaration: $ => seq('@priority', optional($.number), $.semi_colon),
        name_declaration: $ => seq('@name', optional($.string), $.semi_colon),

        derive_declaration: $ => seq("@derive", $.derive_value, $.semi_colon),
        derive_value: $ => choice(
            $.string,
            seq(
                $.tuple_open,
                create_list($.derive_value, choice($.comma, $.semi_colon)),
                $.tuple_close
            ),
        ),

        class_selector: $ => $.identifier,
        name_selector: $ => token(seq("#", IDENTIFIER)),
        tag_selector: $ => token(seq(".", IDENTIFIER)),
        state_selector:$ => token(seq(":", IDENTIFIER)),
        pseudo_selector: $ => token(seq("::", IDENTIFIER)),
        selector: $ => choice(
            $.class_selector, $.name_selector, $.tag_selector, 
            $.state_selector, $.pseudo_selector, $.static_argument
        ),

        scope_open: $ => "{",
        scope_close: $ => "}",

        tuple_open: $ => "(",
        tuple_close: $ => ")",

        rule_scope: $ => seq(
            field("selector", create_list($.selector, $.comma)),
            $.scope_open,
            field("body", repeat($.rule_scope_inner)),
            $.scope_close
        ),
        rule_scope_inner: $ => choice(
            $.rule_scope,
            $.priority_declaration,
            $.name_declaration,
            $.property_assignment,
            $.token_assignment,
            $.static_token_assignment
        ),

        datatype: $ => choice(
            $.color,
            $.macro_call,
            $.tuple,
            $.number,
            $.string,
            $.enum,
            $.rbx_asset,
            $.rbx_content,
            $.reference,
            $.operation
        ),

        tuple: $ => seq(
            field("annotation", optional($.identifier)),
            $.tuple_open,
            create_list($.datatype, choice($.comma, $.semi_colon)),
            $.tuple_close
        ),

        number: $ => choice($.number_ambiguous, $.number_percent, $.number_offset),
        number_ambiguous: $ => NUMBER_AMIGUOUS,
        number_percent: $ => token(seq(NUMBER_AMIGUOUS, "%")),
        number_offset: $ => token(seq(NUMBER_AMIGUOUS, "px")),

        pow_operator: $ => "^",
        div_operator: $ => "/",
        floor_div_operator: $ => "//",
        mod_operator: $ => "%",
        mult_operator: $ => "*",
        add_operator: $ => "+",
        sub_operator: $ => "-",
        operator: $ => choice(
            $.pow_operator, $.div_operator, $.floor_div_operator, $.mod_operator, $.mult_operator, $.add_operator, $.sub_operator
        ),
        operation: $ => prec.left(0, seq($.datatype, $.operator, $.datatype)),

        string: $ => choice($.single_quote_string, $.double_quote_string, $.block_string),
        single_quote_string: $ => new RustRegex("'[^\'\\n\\t]*'"),
        double_quote_string: $ => new RustRegex('"[^\"\\n\\t]*"'),
        block_string: $ => seq(
            seq(
                field('start', alias($._block_string_start, '[[')),
                field('content', alias($._block_string_content, $.string_content)),
                field('end', alias($._block_string_end, ']]'))
            )
        ),

        color: $ => choice($.color_code_tailwind, $.color_code_skin, $.color_code_brick, $.color_code_css, $.color_hex),
        _color_code_shade: $ => new RustRegex("950|900|800|700|600|500|400|300|200|100|50"),
        color_code_tailwind: $ => create_color_code($,
            "tw",
            "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose",
            $._color_code_shade
        ),
        color_code_skin: $ => create_color_code($, "skin", "rose|peach|gold|olive", $._color_code_shade),
        color_code_brick: $ => create_color_code($, "brick", BRICK_COLORS, null),
        color_code_css: $ => create_color_code($, "css", CSS_COLORS, null),
        color_hex: $ => new RustRegex("#[\\da-fA-F]+"),

        enum: $ => choice($.enum_full, $.enum_shorthand),
        enum_full: $ => seq(
            "Enum",
            choice(".", $.colon),
            $.identifier,
            choice(".", $.colon),
            $.identifier,
        ),
        enum_shorthand: $ => token(seq(":", IDENTIFIER)),

        rbx_asset: $ => token(choice(
            new RustRegex("(rbxasset|rbxthumb|rbxgameasset|rbxhttp|rbxtemp|https?)://[^) ]*"),
            new RustRegex("rbxassetid://\\d*")
        )),
        rbx_content: $ => token(new RustRegex("contentid://\\d+")),

        comment: $ => choice(
            seq(
                field('start', '--'),
                field('content', alias(/[^\r\n]*/, $.comment_content))
            ),
            seq(
                field('start', alias($._block_comment_start, '[[')),
                field('content', alias($._block_comment_content, $.comment_content)),
                field('end', alias($._block_comment_end, ']]'))
            )
        ),
    }
});