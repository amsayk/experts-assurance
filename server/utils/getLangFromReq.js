export default function getLangFromReq(req) {
  return req.locale.language.split(/\s+/)[0];
}

