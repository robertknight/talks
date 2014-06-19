package main

import (
	"fmt"
	"time"
)

func main() {
	time.AfterFunc(2*time.Second, func() {
		fmt.Println("Hello")
	})
	time.AfterFunc(2*time.Second, func() {
		fmt.Println("World")
	})
	time.Sleep(3 * time.Second)
}
