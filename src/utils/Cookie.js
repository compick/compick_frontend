// utils/cookie.js
export function getCookie(name) {
  const matches = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return matches ? decodeURIComponent(matches[2]) : null;
}


export function setCookie(name, val) {
  document.cookie = `${name}=${encodeURIComponent(val)}; Path=/; Max-Age=3600; SameSite=Lax`;
}

// utils/cookie.js
export function deleteCookie(name, { path='/', sameSite='Lax' } = {}) {
  document.cookie =
    `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=${path}; SameSite=${sameSite}`;
  // Domain은 처음에 안 썼으니 쓰지 말기. (localhost ↔ 192.168.x.x 다르면 원래 못 지움)
}


