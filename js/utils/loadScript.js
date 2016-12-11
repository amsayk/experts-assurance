export default function loadScript(url) {
  return new Promise((resolve, reject) => {
    const scriptElm = document.createElement('script');
    scriptElm.type = 'application/javascript';
    scriptElm.src = url;
    scriptElm.async = true;
    scriptElm.onload = resolve;
    scriptElm.onerror = reject;
    document.body.appendChild(scriptElm);
  });
}

