import React from "react";
import { Box, Stack, Heading, Text } from "@sanity/ui";

const PageHeading = () => {
  return (
    <Box marginBottom={5} style={{ textAlign: "center" }}>
      <Stack space={4}>
        <Heading as="h1" size={4}>
          The Sanity.io Community Map
        </Heading>

        <Text size={2}>
          Where{" "}
          <a href="https://www.sanity.io/exchange/community">
            people in the Sanity.io community
          </a>{" "}
          are located.
        </Text>
      </Stack>
    </Box>
  );
};

export default PageHeading;
