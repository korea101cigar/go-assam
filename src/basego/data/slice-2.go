package main

import "fmt"

func main() {
	s1 := make([]int, 0, 5)
	s1 = append(s1, 1, 3)
	s2 := s1[:3]
	fmt.Println(s1)
	fmt.Println(s2)
}
