export const BASE_CONSTRAINT = `// every person
  _type == "person" &&
  // that isn't hidden
  hidden != true &&
  defined(handle.current) &&
  !(_id in path("drafts.**")) &&
  // Has a photo & geolocation defined
  defined(geolocation) &&
  defined(photo)`;

export const PERSON_FRAGMENT = `_id,
  name,
  geolocation,
  handle,
  headline,
  photo,
  _score,`;

export const INITIAL_QUERY = `*[
  ${BASE_CONSTRAINT}
]{${PERSON_FRAGMENT}}`;

export const TECH_OPTIONS_QUERY = `*[
  _type in ['taxonomy.framework', 'taxonomy.integration']
]{
  _id,
  _type,
  title,
}`;
