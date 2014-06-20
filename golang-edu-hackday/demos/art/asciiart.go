package main

import (
	"flag"
	"fmt"
	"image"
	"image/color"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"os"
)

type threshold struct {
	min  float64
	char rune
}

var symbols []threshold = []threshold{
	{0.1, ' '},
	{0.2, '.'},
	{0.3, '+'},
	{0.4, 'o'},
	{0.45, '#'},
}

func AsciiArtChar(greyVal float64) rune {
	ch := ' '
	for _, sym := range symbols {
		if greyVal > sym.min {
			ch = sym.char
		}
	}
	return ch
}

func Asciify(img image.Image, charWidth int, charHeight int) []string {
	result := []string{}

	height := img.Bounds().Max.Y - img.Bounds().Min.Y
	width := img.Bounds().Max.X - img.Bounds().Min.X
	rows := height / charHeight
	cols := width / charWidth
	greyVals := make([]float64, rows*cols)

	for row := 0; row < rows; row++ {
		for col := 0; col < cols; col++ {
			greySum := 0.0
			for x := col * charWidth; x < (col+1)*charWidth; x++ {
				for y := row * charHeight; y < (row+1)*charHeight; y++ {
					pixel := img.At(x, y)
					grey, _, _, _ := color.GrayModel.Convert(pixel).RGBA()
					greyFloat := float64(grey) / (2 << 16)
					greySum += greyFloat
				}
			}
			meanGrey := greySum / float64(charWidth*charHeight)
			greyVals[row*cols+col] = meanGrey
		}
	}

	for row := 0; row < rows; row++ {
		greyLine := ""
		for col := 0; col < cols; col++ {
			greyVal := greyVals[row*cols+col]
			greyLine += string(AsciiArtChar(greyVal))
		}
		result = append(result, greyLine)
	}

	return result
}

func main() {
	var charWidth = flag.Int("charwidth", 10, "Number of pixels (horizontal) per ASCII-art char")
	var charHeight = flag.Int("charheight", 20, "Number of pixels (vertical) per ASCII-art char")
	flag.Parse()

	fileName := flag.Args()[0]

	file, err := os.Open(fileName)
	if err != nil {
		fmt.Printf("Unable to open %s\n", fileName)
		os.Exit(1)
	}

	img, _, err := image.Decode(file)
	if err != nil {
		fmt.Printf("Unable to load %s\n", fileName)
		os.Exit(1)
	}

	art := Asciify(img, *charWidth, *charHeight)
	for _, line := range art {
		fmt.Println(line)
	}
}
