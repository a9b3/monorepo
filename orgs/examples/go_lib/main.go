package go_lib

import (
	"fmt"

	cowsay "github.com/Code-Hex/Neo-cowsay/v2"
)

func HelloWorld() {
	say, err := cowsay.Say(
		"Hello",
		cowsay.Type("default"),
		cowsay.BallonWidth(40),
	)
	if err != nil {
		panic(err)
	}
	fmt.Println(say)
}
