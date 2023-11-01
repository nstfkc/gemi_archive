## gemijs

Traditional MVC framework for building modern full-stack web applications. 

## Why?



### Routing (server)

This section explains, how to set up your server routes. For client side routing see [this](#client-side-routing) section.

#### View routes

You can define a basic view route by using `Route.view`, it takes a view name (a file name relative to the `app/views` directory contains a react component) as a first argument and an optional function that returns an object contains the data to be passed to the view component via its props. 

Routes defined with `Route.view` returns html that is being created by rendering the respective react component on the server. 

To learn more about server side rendering (SSR) see here.

``` tsx
// app/http/routes.ts
import { Route } from '@/lib/http/Route'

export const routes = {
  '/': Route.view('Home'),

  '/about': Route.view('About', () => {
    return { companyName: 'Acme Inc.'}
  }),
}

```

#### Api routes

You can also define an api endpoint using `Route.(get | post | patch | put | delete)` (endpoint will only accept the respective http method). 

```ts
// app/http/routes.ts
import { Route } from '@/lib/http/Route'
import { Post } from '@/app/models/Post'

export const routes = {
  '/posts': Route.get(async () => {
    return { posts: await Post.findMany() }
  }),
}

```

If you want to define your endpoints based on REST api spec, you need to attach multiple handlers to the same endpoint. In that case you can pass an array of Route handlers to the endpoint.

``` ts
// app/http/routes.ts
import { Route } from '@/lib/http/Route'
import { Post } from '@/app/models/Post'

export const routes = {
  '/posts': [
    Route.get(async () => {
      return { posts: await Post.findMany() }
    }),
    Route.post(async(req) => {
      const post = await Post.create(req.body);
      return { post }
    })
  ],
  '/posts/:postId': [
    Route.get(async (req) => {
      return { post: await Post.findOne({ id: req.params.postId })}
    }),
    Route.patch(async (req) => {
      const post = await Post.updateOne({ where: { id: req.params.postId }, data: req.body })
      return { post }
    })
    Route.delete(async (req) => {
      const result = await Post.delete({ where: { id: req.params.postId }})
      return { result }
    })
  ]
}

```

Even though this is technically correct, you can imagine you would repeat the same pattern over an over again for all of your Models and it wouldn't be convenient. Instead, you can use `Route.resource` to define your REST endpoints by using Resource Controllers. 

```ts
// app/http/routes.ts
import { Route } from '@/lib/http/Route'
import { PostsResourceController } from '@/app/http/controllers/PostsResourceController'

export const routes = {
  '/posts': Route.resource(PostsResourceController)
}

```
To learn more about Resource Controllers see [this](#resource-controllers) section.

#### Route parameters

You can use `:parameterName` notion in your route key to define a parameter. The parameters will be parsed from the url and an will be accessible through `req.params`.

If you want to make a parameter optional you can put `?` after the `:`. E.g `/foo/:bar/:?baz`. 

```ts
// app/http/routes.ts
import { Route } from '@/lib/http/Route'
import { Post } from '@/app/models/Post'

export const routes = {
  '/post/:postId': Route.get(async (req) => {
    return { post: await Post.findOne(req.params.postId)}
  })
}
```

### Controllers

When your data loading logic gets complicated, you might want to keep your business logic more organised using controllers.


You can use your controllers to handle the data loading logic for your views or handle the business logic of your endpoints.

Following example shows how to 

```ts
// app/http/controllers/PostController.ts
import { Controller } from '@/lib/http/Controller'
import { Post } from '@/app/models/Post'

class PostController extends Controller {

  list = async (req) => {
    return { posts: await Post.findMany() }
  }
}

// app/http/routes.ts
import { Route } from '@/lib/http/Route'
import { PostController } from '@/app/http/controllers/PostController'

export const routes = {
  '/posts': Route.view('Posts', [PostContoller, 'index'])
}
```




 

#### Defining controllers

All controllers reside in `/app/http/controllers` directory. 

``` tsx
// app/http/controllers/DashboardController.ts
import { Controller } from '@/lib/http/Controller'

export class DashboardController extends Controller {
  index = () => {
    const message = `Hello ${Auth.user().name}!`
    return { message }
  }
}


// app/views/Dashboard.tsx

interface DashboardData {
  message: string;
}

export default function Dashboard({ data }: DashboardData) {
  return (
    <div>{data.message}</div>
  )
}


```

#### Resource Controllers

### Client side routing