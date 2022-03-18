import React from "react";
import debounce from "lodash.debounce";

import useQuery from "../lib/useQuery";
import { PERSON_FRAGMENT, BASE_CONSTRAINT } from "../lib/queries";

const INITIAL_FILTERS = {
  textQuery: "",
  availableOnly: undefined,
  /**
   * value: string -> _id
   * title: string
   */
  tech: [],
  // GEO FILTERS
  maxDistance: 3000000, // start at 3000km
  currentLocation: undefined,
  /**
   * See Map.js for how these are created
   */
  mapLocations: []
};

export const useSearch = () => React.useContext(SearchContext);

// @TODO: contributionCount? Sorting by join date? Sorting by _createdAt?
const prepareQuery = (filterState = {}) => {
  const availableConstraint =
    filterState.availableOnly === true
      ? `// that is available to work
  && work.availableForWork == true`
      : "";

  const distanceConstraint = filterState.currentLocation
    ? `// and is up to $maxDistance away from us
  && geo::distance(geolocation, $currentLocation) < $maxDistance`
    : "";

  const polygonsConstraint = filterState.mapLocations?.length
    ? `
  // Check if custom areas set in the map contain the person's geolocation
  && (${filterState.mapLocations
    .map(
      (_polygon, i) => `
    geo::contains($mapLocation${i + 1}, geolocation)`
    )
    .join(" ||")}
  )
  `
    : "";

  // Give extra scores if the person:
  // Has the term in their name (4x points)
  // In their headline (2x points)
  // Or in their bio (1x points)
  const textScore =
    filterState.textQuery !== ""
      ? `
  // Give preference to name > headline > bio
  boost(name match $term, 4),
  boost(headline match $term, 2),
  // no need to boost the bio
  pt::text(bio) match $term,`
      : "";
  // Add 1 point for every matched tech
  const techScore = filterState.tech?.length
    ? `
  // IDs of selected tech taxonomies:
  ${filterState.tech
    .map(({ value }) => `"${value}" in tech[]._ref`)
    .join(",\n  ")}
`
    : "";
  const query = `*[
  ${BASE_CONSTRAINT}
  ${availableConstraint}
  ${distanceConstraint}
  ${polygonsConstraint}
] ${
    textScore || techScore
      ? `| score(${textScore} ${techScore})[_score > 0]`
      : ""
  }
{
  ${PERSON_FRAGMENT}
}
  `;

  return {
    query,
    params: Object.assign(
      {
        term: filterState.textQuery,
        currentLocation: filterState.currentLocation || "",
        maxDistance: filterState.maxDistance
      },
      // Add every custom map location polygon as a parameter for the query
      ...(filterState.mapLocations || []).map((polygon, i) => ({
        [`mapLocation${i + 1}`]: polygon
      }))
    )
  };
};

const SearchContext = React.createContext({
  people: [],
  status: "idle",
  filterState: INITIAL_FILTERS,
  setFilterState: () => {
    /* */
  },
  query: prepareQuery({}).query
});

const SearchWrapper = ({ children, initialPayload = [] }) => {
  const [filterState, setFilters] = React.useState(INITIAL_FILTERS);
  const [{ query, params }, setQuery] = React.useState(prepareQuery({}));
  const { data, status } = useQuery({ query, params, skipFirstFetch: true });

  function refetch(filterState) {
    setQuery(prepareQuery(filterState));
  }

  const debouncedSearch = React.useMemo(
    () => debounce(refetch, 300, { maxWait: 1500 }),
    // eslint-disable-next-line
    []
  );

  React.useEffect(() => {
    debouncedSearch(filterState);
    console.log({ filterState });

    // eslint-disable-next-line
  }, [filterState]);
  return (
    <SearchContext.Provider
      value={{
        people: data || initialPayload,
        status,
        setFilterState: setFilters,
        filterState,
        query
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchWrapper;
