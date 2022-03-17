import flow from 'lodash/fp/flow';
import map from 'lodash/fp/map';
import split from 'lodash/fp/split';
import flatten from 'lodash/fp/flatten';
import compact from 'lodash/fp/compact';
import join from 'lodash/fp/join';


export function pathJoin(parts, sep = "/") {
  return flow(
    map(split(sep)),
    flatten,
    compact,
    join(sep),
  )(parts);
}


export function basename(publicUrl) {
  try {
    const r = `/${pathJoin([new URL(publicUrl).pathname || "", "#"])}`;
    console.log("### basename", r)
    return r;
  } catch (e) {
    console.log("### basename", "/#")
    return "/#";
  }
}
