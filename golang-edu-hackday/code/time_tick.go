package main

import (
	"fmt"
	"time"
)

func main() {
	// time.Tick returns a channel of timestamps
	timer := time.Tick(1 * time.Second)
	for _ = range timer {
		fmt.Println("Tick")
	}
}
