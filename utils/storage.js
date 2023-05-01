export function set(name, value) {
  window.localStorage.setItem(name, JSON.stringify(value));
}

export function get(name, fallback = 'null') {
  return JSON.parse(window.localStorage.getItem(name)) || fallback;
}

export function del(name) {
  localStorage.removeItem(name);
}