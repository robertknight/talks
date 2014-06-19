package main

import (
	"fmt"
	"time"
)

func main() {
	go func() {
		for {
			fmt.Println("Hello")
			time.Sleep(1 * time.Second)
		}
	}()
	go func() {
		for {
			fmt.Println("World")
			time.Sleep(1 * time.Second)
		}
	}()
	time.Sleep(10 * time.Second)
}
