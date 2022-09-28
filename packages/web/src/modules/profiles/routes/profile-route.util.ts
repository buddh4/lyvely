export function profileRoot() {
  return "/p";
}

export function profileRoute(subPath = "/", pid = ":pid") {
  if (subPath.charAt(0) !== "/") {
    subPath = "/" + subPath;
  }

  const path = `/p/${pid}${subPath}`;

  return pid === ":pid" ? path : { path: path, params: { pid: pid } };
}
