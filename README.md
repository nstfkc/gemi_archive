# Gemi

Web framework for building modern full-stack web applications

## Highlights

Written in Typescript and only supports Typescript
Uses MVC design pattern
Only supports bun runtime
Uses vite for dev server and bundling
Uses React in the view layer
Doesn't support RSCs and progressive enchancement (might change, low prio)
Doesn't support serverless (might change, low prio)

It comes with everything you need to build a modern web application

- Routing
- Authentication and Authorisation
- ORM
- Forms and HTTP client
- Request validations
- Notifications and Email
- File storage
- Job queues
- Task scheduling
- Events and Websockets


### Declarative routing and middlewares

``` ts
const web = {
  '/: Route.view("Home")
}

const api = {
  '/posts': Route.get([PostController, 'list'])
}
```


### Built in authentication 


``` ts
const api = {
  '/orders': Route.get([OrderController, 'list'], { middlewares: ['auth'] })
}
```


``` ts
class OrdersController extends Controller {
   async list(request: Request){
     return await Order.findMany({ where: { userId: request.user.id } })
   } 
}
```


### Baked in client side router and http client

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


``` tsx

const Posts = () => {
  const { data: posts } = http.useQuery('/posts')
  
  return ...
}

```
