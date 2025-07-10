/**
 * @file Rsml grammar for tree-sitter
 * @author Cameron P Campbell
 * @license MIT
 */
/// <reference types="tree-sitter-cli/dsl" />
var BRICK_COLORS = "white|grey|lightyellow|brickyellow|lightgreen|lightreddishviolet|pastelblue|lightorangebrown|nougat|brightred|medreddishviolet|brightblue|brightyellow|earthorange|black|darkgrey|darkgreen|mediumgreen|ligyellowichorange|brightgreen|darkorange|lightbluishviolet|transparent|trred|trlgblue|trblue|tryellow|lightblue|trflureddishorange|trgreen|trflugreen|phosphwhite|lightred|mediumred|mediumblue|lightgrey|brightviolet|bryellowishorange|brightorange|brightbluishgreen|earthyellow|brightbluishviolet|trbrown|mediumbluishviolet|trmedireddishviolet|medyellowishgreen|medbluishgreen|lightbluishgreen|bryellowishgreen|ligyellowishgreen|medyellowishorange|brreddishorange|brightreddishviolet|lightorange|trbrightbluishviolet|darknougat|silver|neonorange|neongreen|sandblue|sandviolet|mediumorange|sandyellow|earthblue|earthgreen|trflublue|sandbluemetallic|sandvioletmetallic|sandyellowmetallic|darkgreymetallic|blackmetallic|lightgreymetallic|sandgreen|sandred|darkred|trfluyellow|trflured|gunmetallic|redflipflop|yellowflipflop|silverflipflop|curry|fireyellow|flameyellowishorange|reddishbrown|flamereddishorange|mediumstonegrey|royalblue|darkroyalblue|brightreddishlilac|darkstonegrey|lemonmetalic|lightstonegrey|darkcurry|fadedgreen|turquoise|lightroyalblue|mediumroyalblue|brown|reddishlilac|lightlilac|brightpurple|lightpurple|lightpink|lightbrickyellow|warmyellowishorange|coolyellow|doveblue|mediumlilac|slimegreen|smokygrey|darkblue|parsleygreen|steelblue|stormblue|lapis|darkindigo|seagreen|shamrock|fossil|mulberry|forestgreen|cadetblue|electricblue|eggplant|moss|artichoke|sagegreen|ghostgrey|lilac|plum|olivine|laurelgreen|quillgrey|crimson|mint|babyblue|carnationpink|persimmon|maroon|gold|daisyorange|pearl|fog|salmon|terracotta|cocoa|wheat|buttermilk|mauve|sunrise|tawny|rust|cashmere|khaki|lilywhite|seashell|burgundy|cork|burlap|beige|oyster|pinecone|fawnbrown|hurricanegrey|cloudygrey|linen|copper|mediumbrown|bronze|flint|darktaupe|burntsienna|institutionalwhite|midgray|reallyblack|reallyred|deeporange|alder|dustyrose|olive|newyeller|reallyblue|navyblue|deepblue|cyan|cgabrown|magenta|pink|teal|toothpaste|limegreen|camo|grime|lavender|pastellightblue|pastelorange|pastelviolet|pastelbluegreen|pastelgreen|pastelyellow|pastelbrown|royalpurple|hotpink";
var CSS_COLORS = "aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|goldenrod|gold|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavenderblush|lavender|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen";
var array_remove_null = function (arr) { return arr.filter(function (e) { return e !== null; }); };
var create_color_code = function ($, name, color, shade) {
    return prec.left(999, seq.apply(void 0, array_remove_null([
        field("name", new RustRegex("(?i)".concat(name, ":"))),
        field("color", choice(typeof color == "string"
            ? new RustRegex("(?i)".concat(color))
            : color, $.static_argument)),
        shade ? optional(seq(":", field("shade", choice(typeof shade == "string"
            ? new RustRegex("(?i)".concat(shade))
            : shade, $.static_argument)))) : null
    ])));
};
var create_list = function (item, sep) { return seq(optional(sep), repeat(seq(item, sep)), item); };
var auto_prec_choice = function (start, items) {
    var len_items = items.length;
    return choice.apply(void 0, items.map(function (item, idx) { return prec(start + (len_items - idx), item); }));
};
// rules can't be used inside `token` or `token`.
var IDENTIFIER = new RustRegex("[_a-zA-Z][_a-zA-Z\\d]*");
var NUMBER_AMIGUOUS = new RustRegex("[\\d_]*\\.?[\\d_]+");
module.exports = grammar({
    name: "rsml",
    extras: function ($) { return [$.comment, new RustRegex("\\s"), $.macro_call]; },
    externals: function ($) { return [
        $._block_comment_start,
        $._block_comment_content,
        $._block_comment_end,
        $._block_string_start,
        $._block_string_content,
        $._block_string_end,
    ]; },
    rules: {
        source_file: function ($) { return repeat($._definition); },
        _definition_no_macro: function ($) { return choice($.static_token_assignment, $.token_assignment, $.rule_scope, $.derive_declaration, $._definition_scope_body); },
        _definition: function ($) { return choice($.macro_declaration, $._definition_no_macro); },
        _definition_scope_body: function ($) { return choice($.semi_colon); },
        identifier: function ($) { return IDENTIFIER; },
        comma: function ($) { return ","; },
        semi_colon: function ($) { return ";"; },
        colon: function ($) { return ":"; },
        equals: function ($) { return "="; },
        token: function ($) { return token(seq("$", IDENTIFIER)); },
        static_token: function ($) { return token(seq("$!", IDENTIFIER)); },
        static_argument: function ($) { return token(seq("&", IDENTIFIER)); },
        reference: function ($) { return choice($.static_token, $.static_argument, $.token); },
        property_assignment: function ($) { return prec(5, field("property_assignment", seq($.identifier, $.equals, optional($.datatype), $.semi_colon))); },
        token_assignment: function ($) { return prec(5, field("token_assignment", seq($.token, $.equals, optional($.datatype), $.semi_colon))); },
        static_token_assignment: function ($) { return prec(5, field("static_token_assignment", seq($.static_token, $.equals, optional($.datatype), $.semi_colon))); },
        macro_declaration: function ($) { return seq("@macro", $.identifier, optional($.macro_args), $.macro_scope); },
        macro_args: function ($) { return seq($.tuple_open, optional(create_list($.static_argument, choice($.comma, $.semi_colon))), $.tuple_close); },
        macro_scope: function ($) { return seq($.scope_open, field("body", repeat($.macro_body)), $.scope_close); },
        macro_body: function ($) { return auto_prec_choice(999, [
            $.datatype,
            $._definition_no_macro,
            $.comma, $.semi_colon, $.colon, $.equals,
            $.selector,
            $.static_argument,
            $.identifier,
            $.operator,
            $.priority_declaration,
            $.name_declaration,
            $._definition_scope_body
        ]); },
        macro_call: function ($) { return seq(field("annotation", token(seq(IDENTIFIER, "!"))), $.tuple_open, optional(create_list($.datatype, choice($.comma, $.semi_colon))), $.tuple_close); },
        priority_declaration: function ($) { return seq('@priority', optional($.number), $.semi_colon); },
        name_declaration: function ($) { return seq('@name', optional($.string), $.semi_colon); },
        derive_declaration: function ($) { return seq("@derive", $.derive_value, $.semi_colon); },
        derive_value: function ($) { return choice($.string, seq($.tuple_open, create_list($.derive_value, choice($.comma, $.semi_colon)), $.tuple_close)); },
        class_selector: function ($) { return $.identifier; },
        name_selector: function ($) { return token(seq("#", IDENTIFIER)); },
        tag_selector: function ($) { return token(seq(".", IDENTIFIER)); },
        state_selector: function ($) { return token(seq(":", IDENTIFIER)); },
        pseudo_selector: function ($) { return token(seq("::", IDENTIFIER)); },
        selector: function ($) { return choice($.class_selector, $.name_selector, $.tag_selector, $.state_selector, $.pseudo_selector, $.static_argument); },
        scope_open: function ($) { return "{"; },
        scope_close: function ($) { return "}"; },
        scope_bounds: function ($) { return choice($.scope_open, $.scope_close); },
        tuple_open: function ($) { return "("; },
        tuple_close: function ($) { return ")"; },
        tuple_bounds: function ($) { return choice($.tuple_open, $.tuple_close); },
        rule_scope: function ($) { return seq(field("selector", optional(create_list($.selector, optional($.comma)))), $.scope_open, field("body", repeat($.rule_scope_body)), $.scope_close); },
        rule_scope_body: function ($) { return choice($.rule_scope, $.priority_declaration, $.name_declaration, $.property_assignment, $.token_assignment, $.static_token_assignment, $._definition_scope_body); },
        datatype: function ($) { return choice($.color, $.macro_call, $.tuple, $.number, $.string, $.enum, $.rbx_asset, $.rbx_content, $.reference, $.operation); },
        tuple: function ($) { return seq(field("annotation", optional($.identifier)), $.tuple_open, optional(create_list($.datatype, choice($.comma, $.semi_colon))), $.tuple_close); },
        number: function ($) { return choice($.number_ambiguous, $.number_percent, $.number_offset); },
        number_ambiguous: function ($) { return NUMBER_AMIGUOUS; },
        number_percent: function ($) { return token(seq(NUMBER_AMIGUOUS, "%")); },
        number_offset: function ($) { return token(seq(NUMBER_AMIGUOUS, "px")); },
        pow_operator: function ($) { return "^"; },
        div_operator: function ($) { return "/"; },
        floor_div_operator: function ($) { return "//"; },
        mod_operator: function ($) { return "%"; },
        mult_operator: function ($) { return "*"; },
        add_operator: function ($) { return "+"; },
        sub_operator: function ($) { return "-"; },
        operator: function ($) { return choice($.pow_operator, $.div_operator, $.floor_div_operator, $.mod_operator, $.mult_operator, $.add_operator, $.sub_operator); },
        operation: function ($) { return prec.left(0, seq($.datatype, $.operator, $.datatype)); },
        string: function ($) { return choice($.single_quote_string, $.double_quote_string, $.block_string); },
        single_quote_string: function ($) { return new RustRegex("'[^\'\\n\\t]*'"); },
        double_quote_string: function ($) { return new RustRegex('"[^\"\\n\\t]*"'); },
        block_string: function ($) { return seq(seq(field('start', alias($._block_string_start, '[[')), field('content', alias($._block_string_content, $.string_content)), field('end', alias($._block_string_end, ']]')))); },
        color: function ($) { return choice($.color_code_tailwind, $.color_code_skin, $.color_code_brick, $.color_code_css, $.color_hex); },
        _color_code_shade: function ($) { return new RustRegex("950|900|800|700|600|500|400|300|200|100|50"); },
        color_code_tailwind: function ($) { return create_color_code($, "tw", "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose", $._color_code_shade); },
        color_code_skin: function ($) { return create_color_code($, "skin", "rose|peach|gold|olive", $._color_code_shade); },
        color_code_brick: function ($) { return create_color_code($, "brick", BRICK_COLORS, null); },
        color_code_css: function ($) { return create_color_code($, "css", CSS_COLORS, null); },
        color_hex: function ($) { return new RustRegex("#[\\da-fA-F]+"); },
        enum: function ($) { return choice($.enum_full, $.enum_shorthand); },
        enum_full: function ($) { return seq("Enum", choice(".", $.colon), $.identifier, choice(".", $.colon), $.identifier); },
        enum_shorthand: function ($) { return prec(5, token(seq(":", IDENTIFIER))); },
        rbx_asset: function ($) { return prec(9999999, choice(seq(new RustRegex("(rbxasset|rbxthumb|rbxgameasset|rbxhttp|rbxtemp|https?)://"), alias(new RustRegex("[^)\\s;,]+"), "digits")), seq("rbxassetid://", alias(new RustRegex("[0-9]+"), "digits")))); },
        rbx_content: function ($) { return token(seq("contentid://", alias(new RustRegex("[0-9]+"), "digits"))); },
        comment: function ($) { return choice(seq(field('start', '--'), field('content', alias(/[^\r\n]*/, $.comment_content))), seq(field('start', alias($._block_comment_start, '[[')), field('content', alias($._block_comment_content, $.comment_content)), field('end', alias($._block_comment_end, ']]')))); },
    }
});
