# gemi

MVC framework for building modern full-stack web applications. 

## Key features

### MVC design pattern


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
