import React from "react";
import { Heading } from "@sanity/ui";
import { Avatar } from "@sanity/ui";
import { Stack, Inline, Flex } from "@sanity/ui";
import { Grid } from "@sanity/ui";
import { Card } from "@sanity/ui";
import { Text, Badge } from "@sanity/ui";
import { Spinner } from "@sanity/ui";
import { urlFor } from "../lib/sanity";

import { useSearch } from "./SearchWrapper";

const List = () => {
  const { people, status } = useSearch();
  if (status === "loading") {
    return (
      <Flex
        align="center"
        justify="center"
        height="fill"
        style={{ minHeight: "200px" }}
      >
        <Spinner muted />
      </Flex>
    );
  }
  if (!people?.length) {
    return (
      <Flex
        align="center"
        justify="center"
        height="fill"
        style={{ minHeight: "200px" }}
      >
        <Heading as="h2" size={3}>
          No person found with these filters
        </Heading>
      </Flex>
    );
  }
  return (
    <Grid columns={[2, 2, 2, 2, 3, 4, 5]} gap={2}>
      {people.map((person) => (
        <a
          key={person._id}
          href={`https://www.sanity.io/exchange/community/${person.handle?.current}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <Card padding={2} border={true} height="fill" sizing="border">
            <Flex>
              <Avatar
                align="center"
                size={2}
                initials={person.name}
                src={urlFor(person.photo).width(100).height(100).url()}
                loading="lazy"
              />
              <Stack space={2} marginLeft={1} padding={2}>
                {typeof person._score === "number" && (
                  <Badge
                    style={{ display: "inline-block", width: "max-content" }}
                    mode="outline"
                    size={0}
                    tone={person._score > 0.5 ? "primary" : "default"}
                  >
                    Match score: {person._score.toFixed(2)}
                  </Badge>
                )}
                <Heading as="h2" size={0}>
                  {person.name}
                </Heading>
                {person.headline && <Text size={1}>{person.headline}</Text>}
              </Stack>
            </Flex>
          </Card>
        </a>
      ))}
    </Grid>
  );
};

export default List;
