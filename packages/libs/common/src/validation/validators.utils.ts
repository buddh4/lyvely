export function validateEmail(email: string) {
  // tslint:disable-next-line:max-line-length
  const expression =
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return expression.test(email);
}

export const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

export function isValidObjectId(identity?: string | null): identity is string {
  return !!identity && OBJECT_ID_REGEX.test(identity);
}
