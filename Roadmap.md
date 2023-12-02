# Roadmap

## Pre-alpha v0.1.0 
Due date 15.12.2023

### 1.Router

#### Server API

- [x] Route.view and Route.viewGroup
- [x] Route.(get|post|put|patch|delete) and Route.apiGroup
- [x] Route.layout
- [x] Wildcard routes
- [ ] Route.resource

**Blockers**
- [ ] ResourceController

#### Client API

- [x] Link component
- [x] useNavigate hook
- [x] useRouteParams hook
- [x] useURLSearchParams hook
- [x] usePathname hook


### 2. Authentication 

- [x] request.user()
- [x] AuthController

**Blockers**
- [x] Controller.setCookie, Controller.getCookie, Controller.deleteCookie


### 3. Http Client and Forms

#### Client API

- [x] http.useQuery
- [x] Form component (MVP)
- [-] Form validations


### 4. Models MVP

- [ ] Basic CRUD operations
- [ ] Collection (Maybe)
- [ ] Guarded fields (Maybe)

### 5. Emails

- [ ] send
- [ ] debug


## v1.0.0

### Router 
- [ ] Page<Path> and Layout<Path> types to make views typesafe

### Authentication
- [ ] Github login
- [ ] X login
- [ ] Google login

### Http client
- [ ] http.useMutation
- [ ] Type-safe http.useQuery and http.useMutation
