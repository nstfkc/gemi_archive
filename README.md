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

### Routing and Data fetching

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




