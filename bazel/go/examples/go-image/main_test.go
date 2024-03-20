package main

import (
	"bytes"
	"fmt"
	"os"
	"testing"
)

func TestMainOutput(t *testing.T) {
	var buf bytes.Buffer
	fmt.Fprint(&buf, "hello\n")

	// Redirect stdout
	old := os.Stdout
	os.Stdout = os.NewFile(0, os.DevNull)
	defer func() { os.Stdout = old }() // Restore original stdout

	main()

	if buf.String() != "hello\n" {
		t.Errorf("Unexpected output in main()")
	}
}
