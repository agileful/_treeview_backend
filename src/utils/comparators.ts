export default {
  number: (a, b) => a - b,
  string: (a, b) => (a < b ? -1 : a == b ? 0 : 1),
  object: (a, b) => (a < b ? -1 : a.toString() == b.toString() ? 0 : 1),
  boolean: (a, b) => (a < b ? -1 : a == b ? 0 : 1),
}
