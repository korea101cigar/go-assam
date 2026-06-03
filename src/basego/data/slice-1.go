package main

import "fmt"

func main() {
	s1 := []int{9, 12, 18, 23, 26, 30}

	fmt.Printf("s1 %p %p %d %d %v\n", &s1, &s1[0], len(s1), cap(s1), s1)

	s5 := s1[5:5]
	fmt.Println("s5: len cap", len(s5), cap(s5))

	fmt.Println("--------------------")

	a1 := [...]int{101, 112, 118, 113, 126, 130}
	fmt.Printf("a1 %p %p %d %d %v\n", &a1, &a1[0], len(a1), cap(a1), a1)
	fmt.Printf("%T\n", a1)

	as2 := a1[1:]
	fmt.Printf("%T\n", as2)
	as2[0] = 91101
	fmt.Printf("a1 %p %p %d %d %v\n", &a1, &a1[0], len(a1), cap(a1), a1)
	fmt.Printf("as2 %p %p %d %d %v\n", &as2, &as2[0], len(as2), cap(as2), as2)
	as2 = append(as2, 51, 52, 53)
	fmt.Printf("a1 %p %p %d %d %v\n", &a1, &a1[0], len(a1), cap(a1), a1)
	fmt.Printf("as2 %p %p %d %d %v\n", &as2, &as2[0], len(as2), cap(as2), as2)

	s3 := make([]int, 0, 5)
	as3 := s3[:]
	fmt.Println("s3: ", len(s3), cap(s3))
	fmt.Println("as3: ", len(as3), cap(as3))
}
