export function defineView(Component: (props: any) => JSX.Element) {
  if (typeof window !== "undefined") {
    window.component = Component;
  }
  return Component;
}
