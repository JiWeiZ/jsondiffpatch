export const getType = (target) => {
  if (typeof target === "object") {
    return Array.isArray(target)
      ? "array"
      : "object"
  }
  return typeof target
}
