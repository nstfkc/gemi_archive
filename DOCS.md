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


# gemi

Traditional MVC framework for building modern full-stack web applications. 

## Motivation
 Mainstream frameworks like Nextjs and Remix are phenomenal for building websites and online stores where the initial page speed is detrimental, but when it comes to building a complex B2B/B2C apps their flagship features are not quite useful. Developers pretty much have to implement their authentication/authorization, orm, emails, queues, client side data fetching etc. by their own. There is little to no business value in that. Gemi aims to provide a strong foundation with set of features every web application needs so developers can only focus on building valuable features for their businesses.
 
## Features

- Server side rendering ✅
- Server side routing ✅
- Client side routering with soft navigation ✅
- Typesafe data fetching client 🚧
- Headless component library 🚧
- Form helpers 🚧
- Authentication (Email/Password & Social) 🚧
- Authorisation 🚧
- ORM 🚧
- Database Migrations 🚧
- Validations 🚧
- Notifications & Email 🚧
- File Storage 🚧
- Job Queues 🚧
- Testing 🚧
- Events & Web Sockets 🚧


## Core concepts

### Routing and Data fetching test

There are two types of routes. Web routes and api routes. Web routes are to render your web interfaces and api routes are to access and update your application data.

Both routes are defined as an object with `public` and `private` keys determine which pages will be publicly accessible and which ones will require authentication to visit.

In route objects, the keys define the URI and the values are the route handlers. Route handlers can be defined by using `Route` class.

`Route` class have the following methods `view`, `get`, `post`, `put`, `patch`, `delete`, `middleware` and `group`.

#### Web routes

You can define your web routes by passing a view name to the `Route.view` method. It will render the matching React component on the server and respond with html.

```ts
export const web = {
  public: {
    '/': Route.view('Home'), // Renders `/views/Home.tsx`
  },
  private: {
      // If user is authenticated renders `/views/Account.tsx`, if not redirects to the login page
      '/': Route.view('Account'), 
    },
  }
```

To load the data for your views on the server, you can use controllers to handle your data loading logic. 

A very simple controller looks like this;
```ts
export class HomeController extends Controller {
  index = () => {
    return { greeting: 'Hello World!'}
  }
}
```

Then you can pass Controller and method pair as a second argument to the `Route.view` method.

```ts
export const web = {
  public: {
    '/': Route.view('Home', [HomeController, 'index']),
  },
  private: {
      '/': Route.view('Account',[AccountController, 'index']), 
  },
}
```

The server data will be passed to your view component via `props.data` prop.

```tsx
// Page type takes the URI as an argument and makes your data prop typesafe
const Home: Page<'/'> = ({ data }) => {
  return <div>
    <h1>{data.greeting}</h1> 
  </div>
} 

export default Home
```

#### Api routes

You can define your api routes using `Route.get|post|put|patch|delete` methods based on which http method you want to use. 

```ts
export const api = {
  public: {
    '/newsletter': Route.post([NewsletterController, 'subscribe']),
  },
  private: {
    '/posts': Route.get([PostsController, 'list']), 
  },
}

```

In your React components you can interact with your apis in type-safe manner using `useQuery` and `useMutation` hooks.

```tsx
const Posts = () => {
  // data type is captured from the routes, matches with the object type returned from the /posts endpoint.
  const { data: posts } = useQuery('/posts');
  return ...
}
```

```tsx
const NewsletterForm = () => {
  const { mutate: subscribe } = useMutation('/newsletter');

  const handleSubscription = (email: string) => {
    subscribe({ email })
  }

  return ...
}
```

#### Route parameters

You can put `:` in front of your URI segment to define route parameters and add `?` to the end to make it optional.

e.g `/posts/:postId`, `/posts/:postId/:commentId?`

In your web routes, you can access to these parameters via `useParams` hook. 


### Middlewares

You can add middlewares to your routes via `Route.middleware` in route level.

```ts
Route.middleware(YourCustomMiddleware).get(...)
// or you can pass multiple middlewares, they will be applied in the given order
Route.middleware([FirstMiddleware, SecondMiddleware]).get(...)
```

or you can add them to the `GlobalMiddleware` class. 

```ts

export class GlobalMiddleware extends ApplicationMiddleware {
  all = () => {
    return {
      all: [/* Applies to all routes */],
      public: [/* Only applies to public routes */],
      private: [/* Only applies to private routes */]
    }
  }

  web = () => {
    return {
      all: [/* Applies to all web routes */],
      public: [/* Only applies to public web routes */],
      private: [/* Only applies to private web routes */]
    }
  }

  api = () => {
    return {
      all: [/* Applies to all api routes */],
      public: [/* Only applies to public api routes */],
      private: [/* Only applies to private api routes */]
    }
  }
}
```

#### Defining Middlewares

TBD

#### Default middlewares

TBD

### Controllers

Controllers are where you put your application's business logic. You can access to your controllers via http through your routes. Only public methods can be accessed through your routes, this makes it easier for you to organise your business logic by creating re-usable private methods.

```ts

export class PostController extends Controller {

  list = async () => {
    const posts = await Post.findMany()
    const similarPosts = this.getSimilarPosts(posts[0])
    return { posts, similarPosts }
  }

  // '/post/:postId': Route.get([PostController, 'show'])
  // You can access to the :postId via req.params
  show = async ({ req }) => {
    const post = await Post.findOne(req.params.postId)
    const similarPosts = this.getSimilarPosts(post)
    return { post, similarPosts }
  }

  private getSimilarPosts = (post: Post) => {
    const similarPosts = await Post.findMany({ where: { tags: post.tags }})
  }
}

```

#### Resource Controllers

It is very common in web applications that you want to perform CRUD operations for a model. It will be tedious to create those routes manually. Resource Controller is a special type of controller that you can assign to single route and it will automatically handle all of the CRUD request.

```ts
const api = {
  private: {
    '/posts': Route.resource(PostsResourceController)
  }
}
```

This will automatically create the following routes, and attach to the respective controller method.

```
GET:     /posts          PostsResourceController.list
POST:    /posts          PostsResourceController.create
GET:     /posts/:postId  PostsResourceController.show
PATCH:   /posts/:postId  PostsResourceController.update
DELETE:  /posts/:postId  PostsResourceController.delete
```

```ts

export class PostsResourceController extends ResourceController {
  list = () => {...}
  create = () => {...}
  show = () => {...}
  update = () => {...}
  delete = () => {...}
}

```

#### Validation

TBD

### Authentication

Gemi comes with built in authentication routes. It supports basic auth with email and password, Oauth and magic links.

More TBD

#### Retrieving the authenticated user

You can use `Auth` helper class to retrieve the authenticated user in your server side business logic.

```ts

Auth.id // Returns the user id
await Auth.user() // Returns the user model

```

In example

```ts

class UserController extends Controller {
  posts = async () => {
    const userPosts = await Post.findMany({ where: { userId: Auth.id }})
    return {
      posts: userPosts
    }
  }
}

```

### Authorization

#### Policies

Policies are the contracts prevent the user to perform certain operations over a model.

You can define a simple policy like following
```ts
export class PostPolicy extends Policy {

  update = (post: Post) => {
    return post.userId === Auth.id
  }

}

```

After your register this policy to the Post model, every update operation will be limited to the users who owns the post.

```ts

export class PostModel extends Model {
  protected policies = [PostPolicy]

  //...
}
```


For example an authenticated user might change the post id in the request and try to update a post of another person. Policies are an eloquent way to prevent such scenarios.

```ts
export class PostController extends Controller {

  update: async ({ req }) => {
    // This will throw an exception if the post is not belong to the authenticated user 
    const post = await Post.updateOne({ where: { id: req.params.postId }, data: req.body })

    return { post }

  }
}
```




