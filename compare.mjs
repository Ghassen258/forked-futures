import { chapters, tracePath } from "./story.mjs";

/** Returns decision points already traversed, or the opening preview. */
export function availableForks(path, data = chapters) {
  const actual = tracePath(path, data);
  const forks = actual.slice(0, -1)
    .flatMap((node, index) => data[node]?.choices?.length >= 2
      ? [{ index, node, title: data[node].title }] : []);
  if (!forks.length && data[actual.at(-1)]?.choices?.length >= 2) {
    const index = actual.length - 1;
    forks.push({ index, node: actual[index], title: data[actual[index]].title });
  }
  return forks;
}

function projectPath(seed, originalChoicePositions, data) {
  const path = [...seed];
  const seen = new Set(path);
  const limit = Object.keys(data).length + 1;
  for (let n = 0; n < limit; n++) {
    const choices = data[path.at(-1)]?.choices;
    if (!choices?.length) return path;
    const preference = originalChoicePositions[path.length - 1];
    const next = (choices[preference] ?? choices[0])[1];
    if (seen.has(next)) throw new Error("Cannot project a cyclic storyline");
    seen.add(next);
    path.push(next);
  }
  throw new Error("Comparison exceeded story traversal limit");
}

/**
 * Flip a single past decision. Later branches keep the same choice positions
 * when possible. Unplayed choices default to option one. Pure/read-only.
 */
export function compareTimelines(path, forkIndex, data = chapters) {
  const actual = tracePath(path, data);
  const forks = availableForks(actual, data);
  const index = forkIndex === undefined ? forks.at(-1)?.index : forkIndex;
  if (!forks.some(fork => fork.index === index)) {
    throw new RangeError("Select a visited decision to compare");
  }

  const origin = actual[index];
  const choices = data[origin].choices;
  const selected = Math.max(0, choices.findIndex(([, next]) => next === actual[index + 1]));
  const opposite = (selected + 1) % choices.length;
  const positions = actual.slice(0, -1).map((node, depth) =>
    data[node].choices.findIndex(([, next]) => next === actual[depth + 1]));
  const primarySeed = actual[index + 1] ? actual : [...actual, choices[selected][1]];
  const primaryPath = projectPath(primarySeed, positions, data);
  const alternateSeed = [...actual.slice(0, index + 1), choices[opposite][1]];
  const alternatePath = projectPath(alternateSeed, positions, data);
  const changedScenes = Math.max(primaryPath.length, alternatePath.length) -
    primaryPath.filter((node, depth) => alternatePath[depth] === node).length;

  return {
    forkIndex: index,
    origin,
    originalChoice: choices[selected][0],
    alternateChoice: choices[opposite][0],
    isPreview: !actual[index + 1],
    primary: {
      path: primaryPath,
      ending: data[primaryPath.at(-1)].ending,
      projected: primaryPath.length > actual.length
    },
    alternate: {
      path: alternatePath,
      ending: data[alternatePath.at(-1)].ending,
      projected: true
    },
    changedScenes,
    sameEnding: primaryPath.at(-1) === alternatePath.at(-1)
  };
}
