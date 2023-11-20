# Form

Gemi comes with built-in form elements that make your network requests as clean and simple as it gets.

Form component under the hood:
- Includes CSRF token to the request
- Disables the submit button while the request is pending
- Handles errors and validations if the request fails
- Resets the html form after successful request


The `action` prop is type-safe it is inferred from your route manifest. If you put an invalid value, your IDE will let you know and it will break your build.

```tsx
const SignInForm = () => {
  return (
    <Form action="/auth/sign-in">
      <Field name="username"/>
      <Field type="password" name="password" />
      <Button>Sign in</Button>
      <ErrorMessage />
    </Form>
  )
}
```

## Custom form elements

You can implement your own form elements using `useForm` and `useFormField` hooks. 


```tsx

const Field = (props: InputProps) => {
  const { validationError, id } = useFormField(props.name)
  
  return (
    <div>
      { validationErrors ?? <div>{validationError}</div> }
      <label htmlFor={id}>{props.label}</label>
      <input {...props} id={id}  />
    </div>
  )
}

```

```tsx

const Button = (props: ButtonProps) => {
  const { isLoading } = useForm()
  
  return <button disabled={isLoading} {...props} />
}


```

```tsx

const ErrorMessage = () => {
  const { errorMessage, isLoading } = useForm()
  
  if(isLoading || !errorMessage) {
    return null
  }
  
  return <div>{errorMessage}</div>
}

```
