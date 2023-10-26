import { LinkProps, useNavigate } from "react-router-dom";

export const Link = (props: LinkProps) => {
  const navigate = useNavigate();
  return (
    <a
      href={props.to.toString()}
      onClick={(e) => {
        e.preventDefault();
        setTimeout(() => {
          navigate(props.to);
        }, 2000);
      }}
    >
      {props.children}
    </a>
  );
};
