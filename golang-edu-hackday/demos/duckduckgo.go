package main

import (
	"encoding/json"
	"fmt"
	"image"
	_ "image/gif"  // not used directly, but needed for GIF support
	_ "image/jpeg" // not used directly, but needed for JPEG support
	"image/png"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
)

// JSON struct for a DDG search result
// See http://api.duckduckgo.com/?q=time&format=json&pretty=1
// for an example.
//
// Note that all fields _must_ have capital identifiers.
type DDGSearchResult struct {
	RelatedTopics []struct {
		Snippet string `json:"Result"` // use tags to specify JSON field names
		// that differ from the Go field name
		Icon struct {
			URL string
		}
		Text     string
		FirstURL string
	}
}

func getImageURLs(topic string) ([]string, error) {
	// query DuckDuckGo and get JSON response
	ddgSearchURL := "http://api.duckduckgo.com/?q=" + topic + "&format=json&pretty=1"
	resp, err := http.Get(ddgSearchURL)
	if err != nil {
		return nil, err
	}
	content, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	// parse the result into a struct
	var searchResult DDGSearchResult
	err = json.Unmarshal(content, &searchResult)
	if err != nil {
		return nil, err
	}

	// extract the image URLs
	imageURLs := []string{}
	for _, topic := range searchResult.RelatedTopics {
		if len(topic.Icon.URL) != 0 {
			imageURLs = append(imageURLs, topic.Icon.URL)
		}
	}
	return imageURLs, nil
}

func fetchImages(urls []string, prefix string) {
	done := make(chan bool)

	for index, url := range urls {
		go func(id int, url string) {
			defer func() {
				done <- true
			}()

			// fetch image
			resp, err := http.Get(url)
			if err != nil {
				fmt.Println("Unable to fetch " + url)
				return
			}

			// decode the image in PNG, JPEG or GIF format
			image, _, err := image.Decode(resp.Body)
			if err != nil {
				fmt.Printf("Unable to decode %s\n", url)
				return
			}

			// save the image in PNG format
			fileName := fmt.Sprintf("%s-%d.png", prefix, id)
			output, err := os.Create(fileName)
			if err != nil {
				fmt.Printf("Unable to create output image")
				return
			}

			err = png.Encode(output, image)
			if err != nil {
				fmt.Printf("Unable to encode image to PNG format")
				return
			}

			fmt.Printf("Saved %s as %s\n", url, fileName)
		}(index+1, url)
	}

	for i := 0; i < len(urls); i++ {
		<-done
	}
}

func main() {
	if len(os.Args) < 2 {
		fmt.Printf("Usage: %s <query>", os.Args[0])
		os.Exit(1)
	}

	query := strings.Join(os.Args[1:], " ")

	// use the DuckDuckGo API to find images for the query
	imageURLs, err := getImageURLs(query)
	if err != nil {
		fmt.Printf("Unable to fetch images: %v\n", err)
		os.Exit(1)
	}

	// fetch the images concurrently and save them locally
	// as PNG images
	fetchImages(imageURLs, query)
}
