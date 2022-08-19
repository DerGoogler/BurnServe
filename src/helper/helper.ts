/**
 * AnyRoute can handle any route do you want, exclude paths makes other routing posible.
 * @param exclude Paths that should be excluded from the routing
 * @returns RegExp object with execluded paths
 */
export function anyRoute(exclude: string[]) {
  return new RegExp(`^\/(?!(${exclude.join("|")})).*$`);
}
