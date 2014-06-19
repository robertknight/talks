package main

import "fmt"

func sum(nums []int) (sum int) {
	for _, value := range nums {
		sum = sum + value
	}
	return
}

func main() {
	list := []int{1, 1, 2, 3, 5, 8, 11}
	fmt.Println(sum(list[0:3]))
	fmt.Println(sum(list[3:6]))
}
