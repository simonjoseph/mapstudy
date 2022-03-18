import React from "react";
import { SearchIcon, CloseIcon, TerminalIcon, PinIcon } from "@sanity/icons";
import {
  Card,
  Stack,
  Label,
  Autocomplete,
  Switch,
  Flex,
  Inline,
  Button,
  TextInput,
  Text,
  Code
} from "@sanity/ui";

import { useSearch } from "./SearchWrapper";

const Filters = ({ techOptions }) => {
  const { filterState, setFilterState, query } = useSearch();

  function updateLocation({ coords }) {
    setFilterState({
      ...filterState,
      currentLocation: {
        lat: coords.latitude,
        lng: coords.longitude
      }
    });
  }

  function requestLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(updateLocation);
    }
  }

  // React.useEffect(() => {
  //   requestLocation();
  //   // eslint-disable-next-line
  // }, []);

  return (
    <Stack space={4}>
      <Stack space={2}>
        <Label as="label" size={0} htmlFor="search-input">
          Text search
        </Label>
        <TextInput
          fontSize={1}
          icon={SearchIcon}
          id="search-input"
          placeholder="Ex: Designer"
          onChange={(e) =>
            setFilterState({
              ...filterState,
              textQuery: e.target.value
            })
          }
          value={filterState.textQuery}
        />
      </Stack>
      <Stack space={2}>
        <Label size={0} as="label" htmlFor="available-work">
          Show only people available for work
        </Label>
        <Switch
          id="available-work"
          checked={filterState.availableOnly}
          onChange={(e) => {
            if (
              e.currentTarget.type === "checkbox" &&
              "checked" in e.currentTarget
            ) {
              setFilterState({
                ...filterState,
                availableOnly: Boolean(e.currentTarget.checked)
              });
            }
          }}
        />
      </Stack>
      <Stack space={2}>
        <Label size={0} as="label" htmlFor="distance">
          Distance to your location
        </Label>
        {filterState.currentLocation ? (
          <>
            <input
              id="distance"
              type="range"
              max={25000000}
              min={10000}
              step={10000}
              onChange={(e) =>
                setFilterState({
                  ...filterState,
                  maxDistance: Number(e.target.value)
                })
              }
              value={filterState.maxDistance}
            />
            <Text size={1}>
              Distance:{" "}
              {Number(filterState.maxDistance / 1000).toLocaleString("en")}km
            </Text>
          </>
        ) : (
          <>
            <Text size={1}>
              Allow access to your location to filter by locality
            </Text>
            <Button
              text="Allow access"
              icon={PinIcon}
              tone="primary"
              onClick={requestLocation}
            />
          </>
        )}
      </Stack>
      <Stack space={2}>
        <Label size={0}>Technology</Label>

        <Autocomplete
          fontSize={1}
          icon={TerminalIcon}
          id="autocomplete-tech"
          options={techOptions.map((option) => ({
            value: option.title
            // title: option.title
          }))}
          placeholder="Ex: Shopify"
          value=""
          onSelect={(title) => {
            const option = techOptions.find((opt) => opt.title === title);
            if (option) {
              setFilterState({
                ...filterState,
                tech: [
                  ...(filterState.tech || []),
                  {
                    value: option._id,
                    title: option.title
                  }
                ]
              });
            }
          }}
        />
        {filterState.tech?.length > 0 && (
          <Inline space={2} style={{ gap: ".35em" }}>
            {filterState.tech.map((tech, idx) => (
              <Button
                key={tech.value}
                text={tech.title}
                icon={CloseIcon}
                mode="ghost"
                padding={2}
                fontSize={1}
                space={2}
                onClick={() => {
                  setFilterState({
                    ...filterState,
                    tech: [
                      ...filterState.tech.slice(0, idx),
                      ...filterState.tech.slice(idx + 1)
                    ]
                  });
                }}
              />
            ))}
          </Inline>
        )}
      </Stack>
      {query && (
        <Stack space={2}>
          <Label size={0}>Resulting GROQ query:</Label>
          <Card padding={2} style={{ overflow: "auto" }} border={true}>
            <Code style={{ minWidth: "10px" }} size={0} language="js">
              {query}
            </Code>
          </Card>
        </Stack>
      )}
    </Stack>
  );
};

export default Filters;
