package main

import (
	"fmt"
	"net/http"
)

func main() {
	greeting := "<b>Hello</b> World!"
	addr := ":4040"
	http.HandleFunc("/foo", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "%s", greeting)
	})
	fmt.Printf("Listening at %s\n", addr)
	http.ListenAndServe(addr, nil)
}
