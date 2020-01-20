const URN_REGEX = /(?<company>[a-z,\s]+):{?(?<ressources>[a-z,\s]+)}?:{?(?<rights>[a-z,\s]+)}?/m;
export type AMSParsedScope = {
  [key: string]: boolean;
};
/* TODOS:
 * Merge Maps when multiple urns are given
 * handle edgecases and provide good error preventions inside
 * Custom AMSMap which enables easy acces to certain rights
 */

class ParsingError extends Error {
  constructor(property: string) {
    const message = `[ParsingError]: Missing property ${property} in URN`;
    super(message);
    this.message = message;
    this.name = 'ParsingError';
  }
}

function parseGlob(glob: string) {
  return glob.split(',');
}

export function parseURN(urn: string) {
  urn = urn.replace(/\s/g, '');
  const {
    groups: { company, ressources, rights }
  } = URN_REGEX.exec(urn);
  if (!company) {
    throw new ParsingError('company');
  }
  if (!ressources) {
    throw new ParsingError('ressources');
  }
  if (!rights) {
    throw new ParsingError('rights');
  }

  const parsedRessources = parseGlob(ressources);
  const parsedRights = parseGlob(rights);

  const result = new Map<string, AMSParsedScope>();

  const formatted = parsedRights.reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: true
    }),
    {}
  );
  for (const resource of parsedRessources) {
    result.set(resource, formatted);
  }
  return result;
}
