package tree_sitter_rsml_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_rsml "github.com/tree-sitter/tree-sitter-rsml/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_rsml.Language())
	if language == nil {
		t.Errorf("Error loading Rsml grammar")
	}
}
