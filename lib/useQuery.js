import React from "react";
import { sanityClient } from "./sanity";

function useQuery({ query, params = {}, skipFirstFetch = false }) {
  const [status, setStatus] = React.useState("idle");
  const [data, setData] = React.useState();
  const [hasSkipped, setSkipped] = React.useState(false);
  const [lastQueried, setLastQueried] = React.useState({
    query: "",
    params: {}
  });

  React.useEffect(() => {
    if (status === "loading" || !query || (skipFirstFetch && !hasSkipped)) {
      setSkipped(true);
      return;
    }
    if (
      lastQueried.query !== query ||
      JSON.stringify(lastQueried.params) !== JSON.stringify(params)
    ) {
      // console.log("querying", { new: { query, params }, old: lastQueried });
      setStatus("loading");
      sanityClient
        .fetch(query, params)
        .then((newData) => {
          setLastQueried({
            query,
            params
          });
          setData(newData);
          setStatus("success");
        })
        .catch((error) => {
          console.error(error);
          setStatus("error");
        });
    }
    // eslint-disable-next-line
  }, [query, params]);
  return {
    status,
    data
  };
}

export default useQuery;
