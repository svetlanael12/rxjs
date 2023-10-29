import { from, range, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

const o1 = range(0, 10)

o1.subscribe({
    next: (value: any) => console.log('Next:', value),
    complete: () => console.log('Complete!'),
    error: (error) => console.log('Error:', error.message)
})

const producer = (observer) => {
    fetch('https://api.github.com/search/repositories?q=theart84')
        .then(res => res.json())
        .then(value => observer.next(value))
}

const stream = new Observable(producer)

stream.subscribe(value => console.log(value))

const o2 = from(fetch('https://api.github.com/search/repositories?q=theart84'))

o2.subscribe(value => console.log(value.json()))

const producer2 = (observer) => {
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(res => res.json())
        .then(value => observer.next(value))
}

// @ts-ignore
const o3 = new Observable(producer2).pipe(map(value => value.filter(item => item.id)))

o3.subscribe(value => console.log(value))

const producer3 = (observer) => {
    let id = 1
    const timerId = setInterval(() => {
        fetch(`http://jsonplaceholder.typicode.com/posts/${id}`)
            .then(res => res.json())
            .then(value => observer.next(value))
            .then(() => id++)

        if (id > 10) {
            observer.complete()
            console.log('Stream ended')
            clearInterval(timerId)
        }
    }, 1000)
}

const o4 = new Observable(producer3)

o4.subscribe(value => console.log(value))
