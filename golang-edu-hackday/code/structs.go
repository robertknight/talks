package main

import (
	"fmt"
	"math"
)

type Point struct {
	X float64
	Y float64
}

func (p *Point) DistFromOrigin() float64 {
	return math.Sqrt(p.X*p.X + p.Y*p.Y)
}

func main() {
	p := Point{3, 4}
	fmt.Println(p.DistFromOrigin())
}
