package main

import (
	"fmt"
	"net/http"
)

func isSiteUp(url string) bool {
	_, err := http.Get(url)
	return err == nil
}

func main() {
	sites := map[string]string{"Mendeley": "http://www.mendeley.com",
		"Twitter": "http://www.twitter.com"}
	for name, url := range sites {
		if isSiteUp(url) {
			fmt.Printf("%s is up :)\n", name)
		} else {
			fmt.Printf("%s is down :(\n", name)
		}
	}
}
