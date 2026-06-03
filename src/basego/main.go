package main

import "fmt"

func main() {
	fmt.Println("=== 1. 数组 vs 切片 ===")
	demoArrayVsSlice()

	fmt.Println("\n=== 2. 创建切片 ===")
	demoCreateSlice()

	fmt.Println("\n=== 3. len 与 cap ===")
	demoLenCap()

	fmt.Println("\n=== 4. append 追加 ===")
	demoAppend()

	fmt.Println("\n=== 5. 切片操作 [low:high] ===")
	demoSliceExpr()

	fmt.Println("\n=== 6. copy 复制 ===")
	demoCopy()

	fmt.Println("\n=== 7. range 遍历 ===")
	demoRange()

	fmt.Println("\n=== 8. 函数传参（共享底层数组）===")
	demoPassToFunc()
}

// 数组：长度固定，是值类型；切片：长度可变，是对底层数组的“视图”
func demoArrayVsSlice() {
	arr := [3]int{10, 20, 30} // 数组，类型是 [3]int
	s := arr[:]               // 用数组得到切片，类型是 []int
	fmt.Printf("数组 arr = %v\n", arr)
	fmt.Printf("切片 s  = %v\n", s)
	s[0] = 99 // 改切片会影响底层数组
	fmt.Printf("改 s[0] 后 arr = %v\n", arr)
}

func demoCreateSlice() {
	// 字面量
	a := []int{1, 2, 3}
	// make：预分配长度 len 和容量 cap
	b := make([]int, 3)    // [0 0 0]，len=3 cap=3
	c := make([]int, 0, 5) // 空切片，但 cap=5，适合后面多次 append
	var d []int            // nil 切片，len=0，可与空切片比较
	fmt.Printf("字面量 a = %v\n", a)
	fmt.Printf("make   b = %v\n", b)
	fmt.Printf("make   c = %v (len=%d cap=%d)\n", c, len(c), cap(c))
	fmt.Printf("nil    d = %v, d==nil? %v\n", d, d == nil)
}

func demoLenCap() {
	s := make([]int, 3, 8) // len=3 可见元素数，cap=8 底层最多能扩到多少再搬迁
	fmt.Printf("s=%v len=%d cap=%d\n", s, len(s), cap(s))
	s = append(s, 100, 200) // 未超 cap 时，底层数组不变，只改 len
	fmt.Printf("append 后 s=%v len=%d cap=%d\n", s, len(s), cap(s))
}

func demoAppend() {
	s := []int{1, 2}
	s = append(s, 3)       // 追加一个
	s = append(s, 4, 5, 6) // 追加多个
	s = append(s, []int{7, 8}...) // 追加另一个切片（展开）
	fmt.Println("append 结果:", s)
}

func demoSliceExpr() {
	s := []int{0, 1, 2, 3, 4, 5}
	fmt.Println("原切片:", s)
	fmt.Println("s[1:4]  ", s[1:4])   // 下标 1,2,3（不含 4）
	fmt.Println("s[:3]   ", s[:3])     // 从头到 3 之前
	fmt.Println("s[3:]   ", s[3:])     // 从 3 到末尾
	fmt.Println("s[:]    ", s[:])     // 完整视图（仍共享底层数组）

	sub := s[2:5]
	sub[0] = 999
	fmt.Println("sub 改 sub[0] 后，原 s 也变:", s) // 共享底层数组，需注意
}

func demoCopy() {
	src := []int{1, 2, 3, 4}
	dst := make([]int, 2) // 只拷 2 个
	n := copy(dst, src)
	fmt.Printf("copy %d 个: dst=%v\n", n, dst)

	dst2 := make([]int, len(src))
	copy(dst2, src)
	dst2[0] = 100
	fmt.Println("独立副本 dst2:", dst2, "src 不变:", src)
}

func demoRange() {
	names := []string{"Go", "Slice", "教程"}
	for i, v := range names {
		fmt.Printf("  [%d] %s\n", i, v)
	}
	// 只要值不要下标：for _, v := range names { ... }
}

func demoPassToFunc() {
	s := []int{1, 2, 3}
	modifyFirst(s)
	fmt.Println("函数里改了第一个元素，main 里看到:", s)

	s = grow(s)
	fmt.Println("要在函数里扩容并传回，需要接收返回值:", s)
}

func modifyFirst(s []int) {
	if len(s) > 0 {
		s[0] = 42 // 切片是引用类型：改元素会影响调用方
	}
}

func grow(s []int) []int {
	return append(s, 99) // append 可能换新底层数组，必须 return 给调用方
}
