import React from "react";
import { Box, Stack, Text } from "@sanity/ui";

const Footer = () => {
  return (
    <Box marginTop={5} style={{ textAlign: "center" }}>
      <Stack space={4}>
        <Text size={2}>
          Made with{" "}
          <a target="_blank" rel="noopener" href="https://www.sanity.io">
            Sanity
          </a>
          ,{" "}
          <a target="_blank" rel="noopener" href="https://www.sanity.io/ui">
            Sanity UI
          </a>
          ,{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://nextjs.org"
          >
            NextJS
          </a>
          , and{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://leafletjs.com"
          >
            Leaflet
          </a>
          .
        </Text>
      </Stack>
    </Box>
  );
};

export default Footer;
