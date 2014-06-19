package main

import (
	"fmt"
	"io/ioutil"
	"os"
)

func main() {
	file, err := os.Open("code/funcs.go")
	if err != nil {
		fmt.Println("Unable to read code")
	}
	content, err := ioutil.ReadAll(file)
	fmt.Printf("%s\n", content)
}
