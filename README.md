# Gemi

Web framework for building modern full-stack web applications

## Motivation
Current available web frameworks in the javascript ecosystem doesn't provide useful features for application development. They are mostly focused on increasing initial page load performance via optimising hydration and javascript bundle sizes. Those features are very valuable for e-commerce like platforms but not for B2B like applications where the content is not publicly accessible. Anyone who wants to build a web application in these days has to implement their own solutions for pretty much everything e.g ORM, authentication, validations, job queues, emails... 

For some people, having the flexibility of being able to choose tools for their specific requirements can be valuable, but most of the cases spending time on mixing and matching technologies is a big waste of time and resources. 

Gemi is going to provide a solid fundamental that you can focus on your business value from the get go.

## Features in the current road map
  - Customizable component library
  - Form helpers and http client (useQuery and useMutation hooks)
  - Routing (Soft navigation on client side)
  - Authentication and Authorisation
  - ORM
  - Request validations
  - Notifications and Email
  - File storage
  - Job queues
  - Task scheduling
  - Events and Websockets


## Highlights

- Written in Typescript and only supports Typescript
- Uses MVC design pattern
- Only supports bun runtime
- Uses vite for dev server and bundling
- Uses React in the view layer
- Doesn't support RSCs and progressive enchancement (might change, low prio)
- Doesn't support serverless (might change, low prio)


## Code examples

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
   async list(request: Request){
     return await Order.findMany({ where: { userId: request.user.id } })
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

TBD

