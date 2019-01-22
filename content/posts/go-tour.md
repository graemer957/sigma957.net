---
title: "Go Tour"
date: 2019-01-22T12:03:00Z
draft: false
tags:
  - exercism
  - go
---
As part of a side project, I have recently finished the [Tour of Go](https://tour.golang.org). It is a great introduction to the language and specific Go concepts. I really appreciated the fact you can take the tour offline to work through it at your own pace. I find myself often going off on tangents exploring areas that interest me particularly.

A couple of the examples spring to mind...

## slice-bounds.go
Caught me out, as the output was not what I was expecting upon the first glace:

```go
func main() {
    s := []int{2, 3, 5, 7, 11, 13}

    s = s[1:4]
    fmt.Println(s)

    s = s[:2]
    fmt.Println(s)

    s = s[1:]
    fmt.Println(s)
}
```

Here `s` is being progressively resliced, rather than being reset each time.

## exercise-fibonacci-closure.go
Find it really elegant how you can use a closure to return the Fibonacci sequence:

```go
func fibonacci() func() int {
    first, second := 0, 1
    return func() int {
        next := first
        first, second = second, first+second
        return next
    }
}
```

## exercise-equivalent-binary-trees.go and exercise-web-crawler.go
Interesting exercises introducing the concurrency features of Go. Plenty of opportunities to experiment with the wrong way of using goroutines to see how deadlocks and races are detected/handled.

In hindsight, I would highly recommend watching [Google I/O 2012 - Go Concurrency Patterns](https://www.youtube.com/watch?v=f6kdp27TYZs) first and then returning to these exercises. With said hindsight, I definitely would have structured my solutions in a different way... using the 'Generator' pattern for example.

## Conclusion
I am looking forward to continuing to use Go and furthering my knowledge with the language using the following resources:

* [Go Track on Exercism](https://exercism.io/my/tracks/go)
* [gophercises](https://gophercises.com/)