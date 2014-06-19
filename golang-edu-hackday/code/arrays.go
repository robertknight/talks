package main

import "fmt"

func main() {
	list := []int{1, 2, 3, 4}
	for index, value := range list {
		fmt.Printf("%d, %d\n", index, value)
	}
}
