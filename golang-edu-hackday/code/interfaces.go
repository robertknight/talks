package main

import (
	"fmt"
	"io"
	"io/ioutil"
)

type Reader interface {
	Read(p []byte) (n int, err error)
}

type EmptyFile struct{}

func (e EmptyFile) Read(p []byte) (n int, err error) {
	return 0, io.EOF
}

func main() {
	fmt.Println(ioutil.ReadAll(EmptyFile{}))
}
