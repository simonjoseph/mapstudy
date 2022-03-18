import React from "react";
import { Card, Container, Flex, Button, Inline, Stack } from "@sanity/ui";
import { PinIcon, ThListIcon } from "@sanity/icons";
import dynamic from "next/dynamic";
import Head from "next/head";

import { sanityClient } from "../lib/sanity";
import { INITIAL_QUERY, TECH_OPTIONS_QUERY } from "../lib/queries";
import Filters from "../components/Filters";
import List from "../components/List";
import PageHeading from "../components/PageHeading";
import SearchWrapper from "../components/SearchWrapper";
import Footer from "../components/Footer";

export default function IndexPage({ communityMembers, techOptions }) {
  const [layout, setLayout] = React.useState("map");

  const Map = dynamic(() => import("../components/Map"), { ssr: false });
  return (
    <SearchWrapper initialPayload={communityMembers}>
      <Head>
        <title>Sanity.io community map</title>
      </Head>
      <Container padding={5} width={6} sizing="border">
        <PageHeading />
        <Flex wrap="wrap-reverse">
          <Card padding={3} style={{ flex: "0 1 300px" }}>
            <Filters techOptions={techOptions} />
          </Card>
          <Card flex={1} style={{ marginLeft: "1rem", flex: "1 0 500px" }}>
            <Stack space={2} height="fill">
              <Inline space={2}>
                <Button
                  onClick={() => setLayout("map")}
                  selected={layout === "map"}
                  text="Map"
                  icon={PinIcon}
                  mode="ghost"
                />
                <Button
                  onClick={() => setLayout("list")}
                  selected={layout === "list"}
                  text="List"
                  icon={ThListIcon}
                  mode="ghost"
                />
              </Inline>
              {layout === "map" ? <Map /> : <List />}
            </Stack>
          </Card>
        </Flex>
        <Footer />
      </Container>
    </SearchWrapper>
  );
}

export async function getServerSideProps() {
  const {
    communityMembers = [],
    techOptions = []
  } = await sanityClient.fetch(`{
    "communityMembers": ${INITIAL_QUERY},
    "techOptions": ${TECH_OPTIONS_QUERY},
  }`);

  return {
    props: {
      communityMembers,
      techOptions
    }
  };
}
