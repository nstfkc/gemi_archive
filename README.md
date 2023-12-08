<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/nstfkc/gemijs/master/logo.png" height="128">
  </picture>
</p>


## Intro

Gemi is a full-stack MVC web application framework written in TypeScript runs on [bun](https://bun.sh) and uses [React](https://react.dev) in the view layer.

The goal of Gemi is to make application development as efficient as possible by providing all the features required for application development out of the box and integrate them tightly so developers can start building features for their products starting from day 0.

🚨 This project is under development, it is not ready for using on production. 

v0.1.0 is going to be release at 15.12.2023

## Comparison

### Next.js and Remix
Both frameworks are driven by innovation (server components, streaming etc.) and making the initial page render as fast as possible. They both are very flexible, and they don't make any decisions for the developers other than routing and data fetching. You need to make your own decisions to build up your own tech stack. 

Gemi on the other hand, has very little to no room for flexibility. It has rigid rules and design patterns need to be followed. It is not as performant as the others when it comes to initial page load. That makes Gemi not a good option for building websites and e-commerce like applications where the initial page load speed is crucical for conversion rate.

Gemi is particularly focused on application development. It comes with built in authentication and authorization, validations, emails, job queues, task scheduling (cron), file storage, events and websockets. You need to implement your own solutions for both next.js and remix.

### Adonis

Gemi is more similar to Adonis than nextjs or remix. The biggest difference is Gemi uses React in the view layer where Adonis have its own template engine called Edge.

## Getting started

Gemi currently runs only on [bun](https://bun.sh) so you need to install bun on your machine to use it. 

Run

```
curl -fsSL https://bun.sh/install | bash
```

to install bun. Visit [bun.sh](https://bun.sh) for more information.

After you installed bun, clone this repo

``` 
https://github.com/nstfkc/gemijs.git
```

and run

```
bun install
```

to install the dependencies.

After you need to rename `.env.example` to `.env` and fill the required variables

Then you can run

```
bun dev
```

to start development server. Development server uses `5173` port as default.

### Directory structure

- app
  - http
    - controllers
    - requests
    - routes
    - kernel
  - models
  - providers
  - views
- db
- lib
- public
- server

### app
`app` directory is where your application code resides.

#### http
`http` directory contains your **controllers**, **requests**, **routes** and **kernel**.

`Controllers` are where your business logic is defined, you can use contollers to pass data to your views and create api endpoints for your database operations.

`Requests` are where you define your validation logic and filter the data that hits to your controllers.

`Routes` are where you define your web and api routes. Web routes are your UI and api routes are your data endpoints.

`Kernel` is where you configure your application. (More on this later).


`views` directory contains all of your React components that represents your pages. Every file can be used as a view as soon as they are not in a `components` directory and they default export a React component. 

`models` directory contains your models that allows you to access and change your data in your database. Models are built on top of `prisma` ORM. You can use `prisma` directly for your database operations but it is recommended to use models to leverage built-in features.

### db
`db` directory is for your database related codes. Currently Gemi uses `prisma` so you will find your `schema.prisma` in this directory.

### lib
`lib` directory contains all the framework related code, you should not change any code there unless you want to debug.

### public
`public` directory is for the assets like images, files that is publicly available to your users.

### server
`server` contains the code to boot your production and developlent servers. You don't need to change anything there as well.


### Create your first route

In the `app/http/routes.ts` file there are two exported objects. `web` and `api`. You define your web routes in `web` object and api routes in `api` object

The most basic route definition is where you pass a view name to the 

``` typescript

export const web = {
  "/": Route.view('Home')
}

```

This code above assumes that there is a React component inside `app/views` directory named `Home.tsx` that default exports a react component. And renders that component on the server on the initial load and returns html to the browser.

### Fetch data on the server side

If you want to pass data to your views you can pass a **Controller** and a method name that exists in that controller. The data returned from the given method will be passed to the view via `props`

For example, if you want to pass a list of products to your `Products` view.

First define the route and pass a controller and method pair as a second argument to `Route.view`
``` typescript
// app/http/routes.ts

import { ProductsController } from '@/app/http/controllers/ProductsController'

export const web = {
  '/products': Route.view('Products', [ProductsController, 'index'])
}

```

Then define your controller and return your data from your method
``` ts
// app/http/controllers/ProductsController.ts

import { Product } from '@/app/models/Product'

export class ProductsController extends Controllers {
  async index() {
    return await Product.findMany()
  }
}

```

Then access to the data via `props.data` in your React component
``` tsx

const Product = (props) => {
  return <ProductGrid items={props.data}></ProductGrid>
}

```


### Create your first api endpoint

You can use `Route.(get|post|patch|put|delete)` methods to define your api endpoints and respective http method.

In the `routes.ts` file you can put your route definition into the `api` object.


This example shows how to create two endpoints

1- list products
2- update a product

``` typescript
import { ProductsController } from '@/app/http/controllers/ProductsController'

export const api = {
  '/products': Route.get([ProductsController, 'index']),
  '/products/:productId': Route.patch([ProductsController, 'edit']) 
}
```

### Make a request to api endpoint

You can use built in http client and Form component to make request to your api endpoints.

For example to access to the endopoints defined above, for the get request you can use `http.useQuery`

``` tsx
import { http } from '@/lib/client/http'

const Products = () => {
  const { data, isLoading, error } = http.useQuery('/products');
  
  if(error) {
    return <div>Something went wrong:(</div>
  }
  
  if(isLoading) {
    return <LoadingSpinner />
  }
  
  return <ProductGrid products={data} />
}

```
For the patch request you can use the built in `Form` component

``` tsx
import { Form } from '@/lib/client/form'

const EditProduct = (props) => {
  return (
    <Form action={`/products/props.productId`} method="PATCH">
      <input name="name" />
      <textarea name="description" />
      <input name="price" />
      <button type="submit" />
    </Form>
  )
}

```

With the built in `Form` component, you don't need to use controlled inputs. `Form` component under the hood uses [client actions](https://twitter.com/reactjs/status/1716573569193476467) to send the data to the endpoint given in the action prop. 

To access to the form state you can use `useForm` hook.

E.g If you want to show a loading spinner or disable the button while the request is pending you can create a custom submit button.

``` tsx
const SubmitButton = () => {
  const { isPending } = useForm()
  
  return (
    <button disabled={isPending}>
      {isPending && <IconSpinner />} Submit
    </button>
  )
}


```

You can also access to the validation errors from `useForm` and render your error messages.

### Protecting routes

You can use built in `auth` middleware to protect your routes by passing an object as an argument to your route definitions.

``` typescript
export const web = {
  '/dashboard': Route.view('Dashboard', { middlewares: ['auth'] })
}

export const api = {
  '/products': Route.get([ProductsController, 'index'], { middlewares: ['auth'] })
}
```


### Authentication

Gemi comes with built-in authentication. It currently supports authentication with email/passport, magic link and google.


### Client side routing

You can use `Link` component or `useNavigate` hook to navigate between your pages.

### Sending Emails

Gemi comes with built-in email support. It uses `react-email` to create the html from your react components for the email. 

Email templates are located in `app/views/emails` directory. 

You can use `Email.send` method to send an email. You need to pass the template path as first argument and the data to be passed to the template as a second argument.

``` typescript

await Email.send('auth/MagicLink', { magicLink: '...' });

```

Gemi currently only supports `resend` to send emails but soon there will be support for all the major email providers like, nodemailer, sendgrid, AWS SES etc.

