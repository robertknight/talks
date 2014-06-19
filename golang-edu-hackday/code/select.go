package main

import (
	"fmt"
	"time"
)

// START OMIT
func main() {
	fastTicker := time.Tick(200 * time.Millisecond)
	slowTicker := time.Tick(500 * time.Millisecond)
	finish := time.Tick(3 * time.Second)

	for {
		select {
		case t := <-fastTicker:
			fmt.Printf("Fast tick %v\n", t)
		case t := <-slowTicker:
			fmt.Printf("Slow tick %v\n", t)
		case <-finish:
			return
		}
	}
}
// END OMIT
