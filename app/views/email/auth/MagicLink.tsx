import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

const baseUrl = process.env.HOST ?? "";

export const MagicLink = (props: {
  data: { token: string; magicLink: string };
}) => {
  const { token, magicLink } = props.data;
  return (
    <Html>
      <Head />
      <Preview>Your login code for Gemi</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/gemi-logo.png`}
            width="42"
            height="42"
            alt="Gemi"
            style={logo}
          />
          <Heading style={heading}>Your login code for Gemi</Heading>
          <Section style={buttonContainer}>
            <Button style={button} href={magicLink}>
              Login to Gemi
            </Button>
          </Section>
          <Text style={paragraph}>
            This link and code will only be valid for the next 5 minutes. If the
            link does not work, you can use the login verification code
            directly:
          </Text>
          <code style={code}>{token}</code>
          <Hr style={hr} />
          <Link href="https://gemijs.dev" style={reportLink}>
            Gemi
          </Link>
        </Container>
      </Body>
    </Html>
  );
};

export default MagicLink;

const logo = {
  borderRadius: 21,
  width: 42,
  height: 42,
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "560px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
};

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
};

const buttonContainer = {
  padding: "27px 0 27px",
};

const button = {
  backgroundColor: "#000",
  borderRadius: "32px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "16px",
};

const reportLink = {
  fontSize: "14px",
  color: "#b4becc",
};

const hr = {
  borderColor: "#dfe1e4",
  margin: "42px 0 26px",
};

const code = {
  fontFamily: "monospace",
  fontWeight: "700",
  padding: "1px 4px",
  backgroundColor: "#dfe1e4",
  letterSpacing: "-0.3px",
  fontSize: "21px",
  borderRadius: "4px",
  color: "#3c4149",
};
