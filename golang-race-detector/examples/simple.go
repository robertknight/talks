package main

import (
	"fmt"
	"image"
	"image/draw"
	"image/png"
	"os"
)

func processImage(path string) {
	file, _ := os.Open(path)
	img, _, _ := image.Decode(file)
	outFile, _ := os.Create(path + "-greyscale.png")

	greyImg := image.NewGray(img.Bounds())
	draw.Draw(greyImg, img.Bounds(), img, image.Point{X: 0, Y: 0}, draw.Over)
	png.Encode(outFile, greyImg)
}

func main() {
	done := make(chan bool)
	paths := os.Args[1:]

	for _, path := range paths {
		go func() {
			fmt.Printf("Processing %s\n", path)
			processImage(path)
			done <- true
		}()
	}

	for processed := 0; processed < len(paths); processed++ {
		<-done
	}
}
