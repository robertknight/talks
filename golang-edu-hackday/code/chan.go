package main

import "fmt"

func main() {
	ch := make(chan string) // HL
	go func() {
		ch <- "Hello" // HL
	}()
	msg := <-ch // HL
	fmt.Println(msg)
}
