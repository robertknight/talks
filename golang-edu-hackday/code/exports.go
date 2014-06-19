package main

import (
	"fmt"
	"net/http"
)

func main() {
	fmt.Println(http.Get("http://www.mendeley.com"))
}
