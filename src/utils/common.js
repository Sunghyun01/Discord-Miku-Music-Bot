export function isUrl(text) {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}

export function withTimeout(promise, ms, message) {
  let timer;

  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(message));
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timer);
  });
}
