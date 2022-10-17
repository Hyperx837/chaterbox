import { RefObject } from "react";

export function getInputValue(ref: RefObject<HTMLInputElement>) {
  if (!ref.current) return "";
  let { value } = ref.current;
  ref.current.value = "";
  return value;
}
