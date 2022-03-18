import sanityClientPkg from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "81pocpw8",
  useCdn: process.env.NODE_ENV === "production",
  // Setting the client to use the experimental version of SanityDB
  apiVersion: "vX"
};

export const sanityClient = sanityClientPkg(config);

export const urlFor = (source) => imageUrlBuilder(sanityClient).image(source);
