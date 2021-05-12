import { Helmet } from "react-helmet";
import { Box, Container, Typography } from "@material-ui/core";

const NotFound = () => (
  <>
    <Helmet>
      <title>404 | AU Projects</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="md">
        <Typography align="center" color="textPrimary" variant="h1">
          404: The page you are looking for isn’t here
        </Typography>
        <Typography align="center" color="textPrimary" variant="subtitle2">
          You came here by mistake. Try pressing the back button
        </Typography>
        <Box sx={{ textAlign: "center" }}>
          <img
            alt="Under development"
            src="/static/images/not_found.png"
            style={{
              marginTop: 50,
              display: "inline-block",
              maxWidth: "100%",
              width: 560,
            }}
          />
        </Box>
      </Container>
    </Box>
  </>
);

export default NotFound;
