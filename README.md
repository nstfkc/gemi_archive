# gemijs

Traditional MVC framework for building modern full-stack web applications. 

## Why?




### Routing

``` tsx
// app/http/routes.ts

export const routes = createRoutes({
  '/': Route.view('Home', [HomeController, 'index']),

  '/dashboard': Route.view('Dashboard', [DashboardController, 'index']),

  '/account': [
    Route.view('Account', [AccountController, 'index']),
    Route.post(AccountController, 'update')
  ],
})

```

### Controllers and View

``` tsx
// app/http/controllers/DashboardController.ts

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

