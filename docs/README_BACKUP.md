<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/nstfkc/gemijs/master/logo.png" height="128">
  </picture>
</p>

Gemi is a full-stack MVC web application framework written in TypeScript runs on bun and uses React in the view layer.

🚧 Under development 🚧

## What differenciates gemi from next.js and remix

Gemi is focused on application development, it prioritises features which are fundamental for application development. It comes with built-in authentication and authorisation, orm, forms and validations, emails, file storage, job queues and task scheduling, events, websockets and more...

With Next.js or Remix you need to roll your own solutions for these features or you need to put together different 3rd party services. 

On the other hand, Next.js and Remix provide cutting edge data fetching and streaming features which will not be prioritised in Gemi e.g. server components. 

Both frameworks amplify React's capabilities whereas Gemi uses React as a layer in its system design. But similar to both, Gemi supports SSR and soft-navigation in the client.

## Documentation

WIP


## Some code samples

### Defining routes

``` ts
const web = {
  '/': Route.view("Home")
}

const api = {
  '/posts': Route.get([PostController, 'list'])
}
```


### Authenticating the routes

``` ts
const api = {
  '/orders': Route.get([OrderController, 'list'], { middlewares: ['auth'] })
}
```


### Accessing authenticated user
``` ts
class OrdersController extends Controller {
   async list(request: HttpRequest){
     const userId = await request.user().id
     return await Order.findMany({ where: { userId } })
   } 
}
```


### Making http requests via `Form` helper

``` tsx
const LoginForm = () => {
  return (
    <Form action="/auth/login" redirectAfter="/dashboard">
      <Input name="username" />
      <Input type="password" name="password" />
      <Button type="submit">Login</Button>
    </Form>
  )
}
```

### Fetching data using http client

``` tsx

const Posts = () => {
  const { data: posts } = http.useQuery('/posts')
  
  return ...
}

```

## Roadmap

  - [x] Routing
  - [ ] Form helpers and 
  - [ ] Http client (useQuery and useMutation hooks)
  - [ ] Authentication and Authorisation
  - [ ] ORM and models
  - [x] Request validations
  - [ ] Notifications
  - [ ] Email
  - [ ] File storage
  - [ ] Job queues
  - [ ] Task scheduling
  - [ ] Events and Websockets
  - [ ] Customizable component library
