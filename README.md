# gemi

Traditional MVC framework for building modern full-stack web applications. 

- SSR React with soft-routing on the client
- All features you need to modern web applications
  - Authentication
  - Authorisation
  - ORM
  - Database Migrations
  - Validations
  - Notifications & Email
  - File Storage
  - Job Queues
  - Testing
  - Events & Web Sockets


## Documentation
### Routing (server)

This section explains how to set up your server routes. For client side routing see [this](#client-side-routing) section.

#### Basic routing
Routes are defined as an object, keys represents the URI and the value represents the route handler.

You can define your handler using `Route` class. The most basic route handler is a function that returns the data to be returned from the respective endpoint.

```ts
import { Route } from "@/lib/http/Route"

export const api = {
  public: {
    "/greeting": Route.get(() => {
      return { message: "Hello" }
    })
  }
}
```

#### The Default Route Files

All of your application routes are defined in your route files which are located in the `routes` directory. 

The `routes/web.ts` file defines routes that are for your web interfaces. These are called view routes, they render a React component (see the [views](#views) section) on the server and respond with an html to the browser. 

The `routes/api.ts` file defines routes for your api. These are called api routes and they return json. They are automatically prefixed with `/api` so you don't have to explicitly add for all of your api routes.

#### View routes

You can define a basic view route by using `Route.view`, it takes a view name (a file name relative to the `app/views` directory contains a react component).

``` tsx
// app/http/routes/web.ts
import { Route } from '@/lib/http/Route'

export const web = {
  '/': Route.view('Home'),
}
```

To pass data to your views, you can pass a function as a second argument to the `Route.view` method. You can access to the `Request` and `Response` objects via arguments.

``` tsx
// app/http/routes/web.ts
import { Route } from '@/lib/http/Route'

export const web = {
  '/': Route.view('Home', (req, res) => {
    return { greeting: "Hello!" }
  }),
}
```

You can access to this data from your view via `props.data`. For this example view component would look like this.

```tsx
//app/views/Home.tsx

export default function Home(props) {
  return <h1>{props.data.message}</h1>
}
```

For more complex data loading logic, you can use controllers to keep your routes more organised. You can pass your controller and the method name in a tuple like in the following example.

``` tsx
// app/http/routes/web.ts
import { Route } from '@/lib/http/Route'
import { PostController } from '../controllers/PostController'

export const web = {
  '/': Route.view('Posts', [PostController, 'list']),
}
```

#### __Api routes__


You can define your api endpoints using `Route.(get | post | patch | put | delete)` (endpoint will only accept the respective http method). 

```ts
// app/http/routes/api.ts
import { Route } from '@/lib/http/Route'
import { Post } from '@/app/models/Post'

export const api = {
  '/posts': Route.get(async () => {
    return { posts: await Post.findMany() }
  }),
}

```

If you want to define your endpoints based on REST api spec, you need to attach multiple handlers to the same endpoint. In that case you can pass an array of Route handlers to the endpoint.

``` ts
// app/http/routes/api.ts
import { Route } from '@/lib/http/Route'
import { Post } from '@/app/models/Post'

export const api = {
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
// app/http/routes/api.ts
import { Route } from '@/lib/http/Route'
import { PostsResourceController } from '@/app/http/controllers/PostsResourceController'

export const routes = {
  '/posts': Route.resource(PostsResourceController)
}

```
To learn more about Resource Controllers see [this](#resource-controllers) section.


#### Middlewares and groups

You can use `Route.middleware` method to run a middleware before your routes.  

```tsx
// app/http/routes/api.ts
import { Route } from '@/lib/http/Route'
import { Post } from '@/app/models/Post'

export const api = {
  '/posts': Route.middleware('auth').get(async () => {
    return { posts: await Post.findMany() }
  }),
}
``` 

`Route.middleware` accepts a single middleware name or an array of names, They will run in the same order. You can also pass a custom middleware class. 

```ts
// app/http/routes/view.ts
import { Route } from '@/lib/http/Route'
import { AdminController } from '@/app/http/controllers/AdminController'
import { IsElonMiddleware } from '@/app/http/middlewares/IsElonMiddleware'

export const web = {
  // This route will only be accessible by admin Elon Musk
  '/admin/elon': Route.middleware(['auth','admin', IsElonMiddleware]).view(AdminController, 'index'),
}
```

You can combine the `middleware` with `group` to apply the same middleware to multiple routes. For example you can group your private routes that should only be accessible by authenticated users like following.

```ts
// app/http/routes/web.ts
import { Route } from '@/lib/http/Route'
import { DashboardController } from '@/app/http/controllers/DashboardController'
import { AccountController } from '@/app/http/controllers/AccountController'

export const web = {
  '/app': Route.middleware('auth').group({
    '/dashboard': Route.post(DashboardController, 'index'),
    '/account': Route.get(AccountController, 'index'),
  })
}
```

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

As your application grows and gets moore complicated, you might want to keep your business logic more organised using controllers.

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

### Views


### Client side routing