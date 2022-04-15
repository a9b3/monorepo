// IMPORTANT
// The purpose of the file is to store go dependencies that are purely meant to
// be used as binaries.
// https://github.com/golang/go/issues/25922#issuecomment-413898264
package main

import (
	"fmt"

	_ "github.com/golang-migrate/migrate/v4"
)

func main() {
	fmt.Println("vim-go")
}
