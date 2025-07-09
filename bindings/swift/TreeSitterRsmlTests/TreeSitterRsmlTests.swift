import XCTest
import SwiftTreeSitter
import TreeSitterRsml

final class TreeSitterRsmlTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_rsml())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Rsml grammar")
    }
}
