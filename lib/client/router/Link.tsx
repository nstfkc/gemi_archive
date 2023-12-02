import { ComponentProps } from "react";
import { useNavigate } from "./useNavigate";

interface LinkProps extends Omit<ComponentProps<"a">, "href"> {
  href: string;
}

export const Link = (props: LinkProps) => {
  const { href, onClick = () => {}, ...rest } = props;

  const navigate = useNavigate();

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
        navigate(href);
      }}
      {...rest}
    >
      {props.children}
    </a>
  );
};
