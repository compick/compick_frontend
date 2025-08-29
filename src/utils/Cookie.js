// utils/cookie.js
export function getCookie(name) {
  const matches = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return matches ? decodeURIComponent(matches[2]) : null;
}


export function setCookie(name, val) {
  document.cookie = `${name}=${encodeURIComponent(val)}; Path=/; Max-Age=3600; SameSite=Lax`;
}

// utils/cookie.js
export function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; Secure; SameSite=Lax`;
}

