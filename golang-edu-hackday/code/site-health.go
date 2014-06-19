package main

import "fmt"
import "net/http"

func isSiteUp(url string) bool {
	_, err := http.Get(url)
	return err == nil
}
func main() {
	sites := map[string]string{
		"Mendeley": "http://www.mendeley.com",
		"Twitter": "http://www.twitter.com",
		"Golang" : "http://www.golang.org",
	}

	// START OMIT
	done := make(chan bool, 10) // HL
	for name, url := range sites {
		go func(name string, url string) { // HL
			fmt.Printf("Checking %s\n", name)
			if isSiteUp(url) {
				fmt.Printf("%s is up :)\n", name)
			} else {
				fmt.Printf("%s is down :(\n", name)
			}
			done <- true // HL
		}(name, url) // HL
	}
	for i := 0; i < len(sites); i++ {
		<-done // HL
	}
	// END OMIT
}
