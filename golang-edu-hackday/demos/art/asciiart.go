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
	"runtime/pprof"
)

type threshold struct {
	min  float64
	char rune
}

var symbols []threshold = []threshold{
	{0, ' '},
	{0.0166667, '*'},
	{0.0333333, '%'},
	{0.0666667, '-'},
	{0.0833333, '"'},
	{0.1, '}'},
	{0.116667, '\''},
	{0.133333, '!'},
	{0.15, ';'},
	{0.166667, '+'},
	{0.183333, '$'},
	{0.2, ')'},
	{0.216667, '&'},
	{0.233333, '3'},
	{0.25, 'Y'},
	{0.266667, '7'},
	{0.283333, '9'},
	{0.3, '0'},
	{0.316667, '5'},
	{0.333333, '2'},
	{0.35, '1'},
	{0.366667, 'K'},
	{0.383333, 'T'},
	{0.4, '4'},
	{0.416667, 'h'},
	{0.433333, '#'},
	{0.466667, 'D'},
	{0.483333, 'R'},
	{0.533333, 'M'},
	{0.55, 'B'},
	{0.566667, 'H'},
	{0.583333, 'E'},
}

func AsciiArtChar(greyVal float64, symbols []threshold) rune {
	ch := ' '
	for _, sym := range symbols {
		if greyVal > sym.min {
			ch = sym.char
		}
	}
	return ch
}

func Asciify(img image.Image, charWidth int, charHeight int, charFunc func(float64) rune) []string {
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
			greyLine += string(charFunc(greyVal))
		}
		result = append(result, greyLine)
	}

	return result
}

func main() {
	var charWidth = flag.Int("charwidth", 10, "Number of pixels (horizontal) per ASCII-art char")
	var charHeight = flag.Int("charheight", 20, "Number of pixels (vertical) per ASCII-art char")
	var brightness = flag.Float64("brightness", 0.0, "Brightness adjustment (default 0)")
	//var contrast = flag.Float64("contrast", 0.0, "Contrast adjustment (default 0)")
	flag.Parse()

	profile, _ := os.Create("profile.pprof")
	pprof.StartCPUProfile(profile)
	defer func() {
		pprof.StopCPUProfile()
	}()

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

	art := Asciify(img, *charWidth, *charHeight, func(greyVal float64) rune {
		greyVal += *brightness
		return AsciiArtChar(greyVal, symbols)
	})

	for _, line := range art {
		fmt.Println(line)
	}
}
