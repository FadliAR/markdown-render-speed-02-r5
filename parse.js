// Markdown-to-HTML renderer, byte-identical target: marked 18.1.3 defaults.
// Written from scratch in this session (no vendored code, no marked source).
// Block parser builds a tree first (so link reference definitions work even
// when they appear after their use), then a renderer walks the tree and
// parses inline content with the complete reference map.

const ENT = {
  AElig:'Æ', aelig:'æ', AMP:'&', amp:'&', apos:"'", Auml:'Ä', auml:'ä', copy:'©', COPY:'©',
  Dcaron:'Ď', dcaron:'ď', DifferentialD:'ⅆ', GT:'>', gt:'>', hellip:'…', HilbertSpace:'ℋ',
  ClockwiseContourIntegral:'∲', lt:'<', LT:'<', mdash:'—', nbsp:' ', ngE:'≧̸', nge:'≧̸',
  ouml:'ö', Ouml:'Ö', quot:'"', reg:'®', REG:'®', frac34:'¾', frac14:'¼', frac12:'½',
  frac18:'⅛', frac38:'⅜', frac58:'⅝', frac78:'⅞', times:'×', divide:'÷', plusmn:'±', minus:'−',
  deg:'°', micro:'µ', para:'¶', sect:'§', middot:'·', bull:'•', laquo:'«', raquo:'»',
  iexcl:'¡', iquest:'¿', cent:'¢', pound:'£', curren:'¤', yen:'¥', brvbar:'¦', uml:'¨',
  ordf:'ª', ordm:'º', not:'¬', shy:'­', macr:'¯', acute:'´', cedil:'¸', sup1:'¹',
  sup2:'²', sup3:'³', Agrave:'À', Aacute:'Á', Acirc:'Â', Atilde:'Ã', Aring:'Å', Ccedil:'Ç',
  Egrave:'È', Eacute:'É', Ecirc:'Ê', Euml:'Ë', Igrave:'Ì', Iacute:'Í', Icirc:'Î', Iuml:'Ï',
  ETH:'Ð', Ntilde:'Ñ', Ograve:'Ò', Oacute:'Ó', Ocirc:'Ô', Otilde:'Õ', Oslash:'Ø', Ugrave:'Ù',
  Uacute:'Ú', Ucirc:'Û', Uuml:'Ü', Yacute:'Ý', THORN:'Þ', szlig:'ß', agrave:'à', aacute:'á',
  acirc:'â', atilde:'ã', aring:'å', ccedil:'ç', egrave:'è', eacute:'é', ecirc:'ê', euml:'ë',
  igrave:'ì', iacute:'í', icirc:'î', iuml:'ï', eth:'ð', ntilde:'ñ', ograve:'ò', oacute:'ó',
  ocirc:'ô', otilde:'õ', oslash:'ø', ugrave:'ù', uacute:'ú', ucirc:'û', uuml:'ü', yacute:'ý',
  thorn:'þ', yuml:'ÿ', OElig:'Œ', oelig:'œ', Scaron:'Š', scaron:'š', Yuml:'Ÿ', fnof:'ƒ',
  Alpha:'Α', Beta:'Β', Gamma:'Γ', Delta:'Δ', Epsilon:'Ε', Zeta:'Ζ', Eta:'Η', Theta:'Θ',
  Iota:'Ι', Kappa:'Κ', Lambda:'Λ', Mu:'Μ', Nu:'Ν', Xi:'Ξ', Omicron:'Ο', Pi:'Π', Rho:'Ρ',
  Sigma:'Σ', Tau:'Τ', Upsilon:'Υ', Phi:'Φ', Chi:'Χ', Psi:'Ψ', Omega:'Ω', alpha:'α',
  beta:'β', gamma:'γ', delta:'δ', epsilon:'ε', zeta:'ζ', eta:'η', theta:'θ', iota:'ι',
  kappa:'κ', lambda:'λ', mu:'μ', nu:'ν', xi:'ξ', omicron:'ο', pi:'π', rho:'ρ', sigmaf:'ς',
  sigma:'σ', tau:'τ', upsilon:'υ', phi:'φ', chi:'χ', psi:'ψ', omega:'ω', thetasym:'ϑ',
  upsih:'ϒ', piv:'ϖ', ensp:' ', emsp:' ', thinsp:' ', zwnj:'‌', zwj:'‍', lrm:'‎',
  rlm:'‏', ndash:'–', lsquo:'‘', rsquo:'’', sbquo:'‚', ldquo:'“', rdquo:'”', bdquo:'„',
  dagger:'†', Dagger:'‡', permil:'‰', lsaquo:'‹', rsaquo:'›', euro:'€', trade:'™', TRADE:'™',
  alefsym:'ℵ', larr:'←', uarr:'↑', rarr:'→', darr:'↓', harr:'↔', crarr:'↵', lArr:'⇐',
  uArr:'⇑', rArr:'⇒', dArr:'⇓', hArr:'⇔', forall:'∀', part:'∂', exist:'∃', empty:'∅',
  nabla:'∇', isin:'∈', notin:'∉', ni:'∋', prod:'∏', sum:'∑', lowast:'∗', radic:'√',
  prop:'∝', infin:'∞', ang:'∠', and:'∧', or:'∨', cap:'∩', cup:'∪', int:'∫', there4:'∴',
  sim:'∼', cong:'≅', asymp:'≈', ne:'≠', equiv:'≡', le:'≤', ge:'≥', sub:'⊂', sup:'⊃',
  nsub:'⊄', sube:'⊆', supe:'⊇', oplus:'⊕', otimes:'⊗', perp:'⊥', sdot:'⋅', lceil:'⌈',
  rceil:'⌉', lfloor:'⌊', rfloor:'⌋', lang:'⟨', rang:'⟩', loz:'◊', spades:'♠', clubs:'♣',
  hearts:'♥', diams:'♦', prime:"′", Prime:'″', oline:'‾', frasl:'⁄', image:'ℑ', weierp:'℘',
  real:'ℜ', Tab:'\t', NewLine:'\n', colon:':', semi:';', comma:',', period:'.', sol:'/',
  bsol:'\\', plus:'+', equals:'=', quest:'?', commat:'@', dollar:'$', percnt:'%', num:'#',
  ast:'*', excl:'!', lowbar:'_', Hat:'^', lpar:'(', rpar:')', lsqb:'[', rsqb:']', lcub:'{',
  rcub:'}', verbar:'|', check:'✓', cross:'✗', star:'☆', bigstar:'★', circ:'ˆ', tilde:'˜',
  hellip2:'…', nearr:'↗', searr:'↘', swarr:'↙', nwarr:'↖', hbar:'ℏ', ell:'ℓ',numero:'№',
  planck:'ℎ', ohm:'Ω', mho:'℧', order:'ℴ', iiint:'∭', oiiint:'∰', awint:'∳', minusdu:'⨪',
  congdot:'≭', apE:'≊', bne:'=⃥', mlcp:'⫛', lEg:'⪋', gEl:'⪌', les:'⩽', ges:'⩾',
};

// ---------- small helpers ----------
function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function escAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
// decode one entity body (without & and ;): returns string or null
function decodeEntity(body) {
  if (body[0] === '#') {
    let n;
    if (body[1] === 'x' || body[1] === 'X') {
      if (!/^[0-9a-fA-F]+$/.test(body.slice(2))) return null;
      n = parseInt(body.slice(2), 16);
    } else {
      if (!/^[0-9]+$/.test(body.slice(1))) return null;
      n = parseInt(body.slice(1), 10);
    }
    if (!n || n > 0x10ffff || (n >= 0xd800 && n <= 0xdfff)) return '�';
    return String.fromCodePoint(n);
  }
  const v = ENT[body];
  return v === undefined ? null : v;
}
// resolve backslash escapes + entities in a raw string (used for alt text,
// link destinations and titles, and inside code-span-free contexts)
function resolveEscapesEntities(s) {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '\\' && i + 1 < s.length && /[!-/:-@\[-`{-~]/.test(s[i + 1])) { out += s[i + 1]; i++; continue; }
    if (c === '&') {
      const m = /^#(?:[xX][0-9a-fA-F]+|[0-9]+)|[A-Za-z][A-Za-z0-9]{1,31}/.exec(s.slice(i + 1));
      if (m && s[i + 1 + m[0].length] === ';') {
        const d = decodeEntity(m[0]);
        if (d !== null) { out += d; i += m[0].length + 1; continue; }
      }
    }
    out += c;
  }
  return out;
}
const PUNCT = /[!-/:-@\[-`{-~]/;
function isSpace(c) { return c === ' ' || c === '\t' || c === '\n' || c === '\r'; }
function isBlankLine(l) { return /^[ \t]*$/.test(l); }
// column width of leading whitespace (tab advances to next multiple of 4)
function indentOf(l) {
  let col = 0;
  for (let i = 0; i < l.length; i++) {
    const c = l[i];
    if (c === ' ') col++;
    else if (c === '\t') col += 4 - (col % 4);
    else break;
  }
  return col;
}
// strip n columns of leading whitespace. A tab's width depends on its
// absolute column, so the leading whitespace is first expanded to spaces
// (using absolute columns from startCol) and only then cut; otherwise a
// tab kept past the cut would change width and corrupt the indent.
function stripCols(l, n, startCol = 0) {
  let col = startCol, i = 0, spaces = '';
  while (i < l.length && (l[i] === ' ' || l[i] === '\t')) {
    if (l[i] === ' ') { col++; spaces += ' '; i++; }
    else { const w = 4 - (col % 4); col += w; spaces += ' '.repeat(w); i++; }
  }
  return spaces.slice(n) + l.slice(i);
}
// case-fold + collapse whitespace, per CommonMark link-label normalization
function normalizeLabel(s) {
  return s.trim().replace(/\s+/g, ' ').toLowerCase()
    .replace(/ß/g, 'ss').replace(/ﬀ/g, 'ff').replace(/ﬁ/g, 'fi').replace(/ﬂ/g, 'fl')
    .replace(/ﬃ/g, 'ffi').replace(/ﬄ/g, 'ffl').replace(/ﬅ/g, 'st').replace(/ﬆ/g, 'st');
}
function isLetter(c) { return c !== undefined && ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')); }
function isDigit(c) { return c !== undefined && c >= '0' && c <= '9'; }
function isAlnum(c) { return isLetter(c) || isDigit(c); }
function isPunctChar(c) { return c !== undefined && PUNCT.test(c); }
// flanking per CommonMark
function flanking(prev, next) {
  const prevWs = prev === undefined || isSpace(prev);
  const nextWs = next === undefined || isSpace(next);
  const prevP = isPunctChar(prev);
  const nextP = isPunctChar(next);
  const left = !nextWs && (!nextP || prevWs || prevP);
  const right = !prevWs && (!prevP || nextWs || nextP);
  return [left, right];
}

// ---------- link destination / title parsing (work on raw strings) ----------
// parse a link destination starting at s[i]; returns {dest, next} or null.
// dest is the RAW destination (escapes/entities still encoded).
function parseDest(s, i) {
  if (s[i] === '<') {
    let j = i + 1, out = '';
    while (j < s.length) {
      const c = s[j];
      if (c === '\n' || c === '<') return null;
      if (c === '\\' && j + 1 < s.length && PUNCT.test(s[j + 1])) { out += s.slice(j, j + 2); j += 2; continue; }
      if (c === '>') return { dest: out, next: j + 1 };
      out += c; j++;
    }
    return null;
  }
  let j = i, depth = 0, out = '';
  while (j < s.length) {
    const c = s[j];
    if (isSpace(c) || c === '\n') break;
    if (c === '\\' && j + 1 < s.length && PUNCT.test(s[j + 1])) { out += s.slice(j, j + 2); j += 2; continue; }
    if (c === '(') { depth++; out += c; j++; continue; }
    if (c === ')') {
      if (depth === 0) break;
      depth--; out += c; j++; continue;
    }
    if (c < ' ' || c === '\x7f') return null;
    out += c; j++;
  }
  if (j === i) return null;
  return { dest: out, next: j };
}
// parse a link title starting at s[i] (after skipped whitespace);
// returns {title, next} or null. Title is RAW.
function parseTitle(s, i) {
  const q = s[i];
  if (q !== '"' && q !== "'" && q !== '(') return null;
  const close = q === '(' ? ')' : q;
  let j = i + 1, out = '';
  while (j < s.length) {
    const c = s[j];
    if (c === close) return { title: out, next: j + 1 };
    if (c === '\n' && q === '(') return null;
    if (c === '\\' && j + 1 < s.length && (s[j + 1] === close || s[j + 1] === '\\' || PUNCT.test(s[j + 1]))) {
      if (s[j + 1] === close || s[j + 1] === '\\') { out += s[j + 1]; j += 2; continue; }
    }
    if (c === '\\' && j + 1 < s.length && PUNCT.test(s[j + 1])) { out += s.slice(j, j + 2); j += 2; continue; }
    out += c; j++;
  }
  return null;
}
// skip spaces/tabs/newlines; returns new index
function skipWs(s, i) { while (i < s.length && (s[i] === ' ' || s[i] === '\t' || s[i] === '\n')) i++; return i; }

// ---------- inline parsing ----------
const DISALLOWED = new Set(['title', 'textarea', 'style', 'xmp', 'iframe', 'noembed', 'noframes', 'script', 'plaintext']);
const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

// parse a raw HTML tag starting at s[i] === '<'; returns {tag, next, name, closing} or null
function parseTag(s, i) {
  let j = i + 1;
  if (s.startsWith('!--', j)) {
    if (s[j + 3] === '>') return { tag: s.slice(i, j + 4), next: j + 4, name: '', closing: false };
    if (s.startsWith('->', j + 3)) return { tag: s.slice(i, j + 5), next: j + 5, name: '', closing: false };
    const e = s.indexOf('-->', j + 3);
    if (e === -1) return null;
    return { tag: s.slice(i, e + 3), next: e + 3, name: '', closing: false };
  }
  if (s.startsWith('![CDATA[', j)) {
    const e = s.indexOf(']]>', j + 8);
    if (e === -1) return null;
    return { tag: s.slice(i, e + 3), next: e + 3, name: '', closing: false };
  }
  if (s[j] === '!') {
    if (!isLetter(s[j + 1])) return null;
    const e = s.indexOf('>', j + 1);
    if (e === -1) return null;
    return { tag: s.slice(i, e + 1), next: e + 1, name: '', closing: false };
  }
  if (s[j] === '?') {
    const e = s.indexOf('?>', j + 1);
    if (e === -1) return null;
    return { tag: s.slice(i, e + 2), next: e + 2, name: '', closing: false };
  }
  let closing = false;
  if (s[j] === '/') { closing = true; j++; }
  if (!isLetter(s[j])) return null;
  const nameStart = j;
  while (j < s.length && (isAlnum(s[j]) || s[j] === '-')) j++;
  const name = s.slice(nameStart, j).toLowerCase();
  if (closing) {
    while (j < s.length && (s[j] === ' ' || s[j] === '\t' || s[j] === '\n')) j++;
    if (s[j] !== '>') return null;
    return { tag: s.slice(i, j + 1), next: j + 1, name, closing };
  }
  // open tag: attributes (each attribute must be preceded by whitespace)
  while (j < s.length) {
    if (s[j] === '>') return { tag: s.slice(i, j + 1), next: j + 1, name, closing };
    if (s[j] === '/' && s[j + 1] === '>') return { tag: s.slice(i, j + 2), next: j + 2, name, closing };
    if (s[j] !== ' ' && s[j] !== '\t' && s[j] !== '\n') return null;
    while (j < s.length && (s[j] === ' ' || s[j] === '\t' || s[j] === '\n')) j++;
    if (s[j] === '>') return { tag: s.slice(i, j + 1), next: j + 1, name, closing };
    if (s[j] === '/' && s[j + 1] === '>') return { tag: s.slice(i, j + 2), next: j + 2, name, closing };
    if (!isLetter(s[j]) && s[j] !== '_' && s[j] !== ':') return null;
    while (j < s.length && (isAlnum(s[j]) || s[j] === '_' || s[j] === ':' || s[j] === '.' || s[j] === '-')) j++;
    while (j < s.length && (s[j] === ' ' || s[j] === '\t' || s[j] === '\n')) j++;
    if (s[j] === '=') {
      j++;
      while (j < s.length && (s[j] === ' ' || s[j] === '\t' || s[j] === '\n')) j++;
      const q = s[j];
      if (q === '"' || q === "'") {
        j++;
        while (j < s.length && s[j] !== q) j++;
        if (j >= s.length) return null;
        j++;
      } else {
        if (j >= s.length || s[j] === ' ' || s[j] === '\t' || s[j] === '\n' || s[j] === '"' || s[j] === "'" || s[j] === '=' || s[j] === '<' || s[j] === '>' || s[j] === '`') return null;
        while (j < s.length && !isSpace(s[j]) && s[j] !== '"' && s[j] !== "'" && s[j] !== '=' && s[j] !== '<' && s[j] !== '>' && s[j] !== '`') j++;
      }
    }
  }
  return null;
}

// find the matching ']' for a link text starting at s[j] (after '[').
// returns {end, text} or null. Code spans hide brackets.
function scanLinkText(s, j) {
  let depth = 1, i = j;
  while (i < s.length) {
    const c = s[i];
    if (c === '\\' && i + 1 < s.length && PUNCT.test(s[i + 1])) { i += 2; continue; }
    if (c === '`') {
      let n = 0; while (s[i + n] === '`') n++;
      // find a closing run of exactly n backticks
      let k = i + n, closed = -1;
      while (k < s.length) {
        if (s[k] === '`') {
          let m = 0; while (s[k + m] === '`') m++;
          if (m === n) { closed = k; break; }
          k += m;
        } else k++;
      }
      if (closed === -1) return null;
      i = closed + n;
      continue;
    }
    if (c === '[') { depth++; i++; continue; }
    if (c === ']') {
      depth--;
      if (depth === 0) return { end: i, text: s.slice(j, i) };
      i++; continue;
    }
    i++;
  }
  return null;
}

// marked's URL cleaning: encode, then restore already-encoded sequences
function cleanUrl(href) {
  try { return encodeURI(href).replace(/%25/g, '%'); } catch (e) { return null; }
}

// try to parse a link/image starting at bracket index b (s[b] === '[').
// isImage: the '[' is preceded by '!'. Returns {html, next, isLink} or null.
// A failed inline/full reference falls through to the shortcut reference.
function tryLink(s, b, isImage, refs) {
  const lt = scanLinkText(s, b + 1);
  if (!lt) return null;
  const text = lt.text;
  let k = lt.end + 1;
  let dest, title;
  if (s[k] === '(') {
    let p = skipWs(s, k + 1);
    if (s[p] === ')') { dest = ''; k = p + 1; }
    else {
      const d = parseDest(s, p);
      if (d) {
        let q = skipWs(s, d.next);
        if (s[q] === ')') { dest = d.dest; k = q + 1; }
        else {
          const t = parseTitle(s, q);
          if (t) {
            const r = skipWs(s, t.next);
            if (s[r] === ')') { dest = d.dest; title = t.title; k = r + 1; }
          }
        }
      }
    }
  }
  if (dest === undefined && s[k] === '[') {
    let e = k + 1;
    while (e < s.length && s[e] !== ']') {
      if (s[e] === '\\' && e + 1 < s.length && PUNCT.test(s[e + 1])) e += 2;
      else e++;
    }
    if (e < s.length) {
      const raw = s.slice(k + 1, e);
      const label = raw === '' ? text : raw;
      const norm = normalizeLabel(label);
      const ref = norm !== '' && norm.length <= 999 ? refs.get(norm) : undefined;
      if (ref) { dest = ref.dest; title = ref.title; k = e + 1; }
      else return null; // explicit label given but not defined: no shortcut
    }
  }
  if (dest === undefined) {
    // shortcut reference: the link text is the label (reached only when no
    // '(' inline link and no '[label]' were attempted, or the inline failed)
    if (text === '') return null;
    const norm = normalizeLabel(text);
    if (norm === '' || norm.length > 999) return null;
    const ref = refs.get(norm);
    if (!ref) return null;
    dest = ref.dest; title = ref.title;
    k = lt.end + 1;
  }
  const href = cleanUrl(resolveEscapesEntities(dest));
  const children = inline(text, refs);
  if (!isImage && children.hasLink) return null; // links cannot contain links
  if (isImage) {
    const alt = escAttr(resolveEscapesEntities(text));
    if (href === null) return { html: alt, next: k, isLink: false };
    return {
      html: '<img src="' + escAttr(href) + '" alt="' + alt + '"' +
        (title !== undefined ? ' title="' + escAttr(resolveEscapesEntities(title)) + '"' : '') + '>',
      next: k, isLink: false,
    };
  }
  if (href === null) return { html: children.html, next: k, isLink: false };
  return {
    html: '<a href="' + escAttr(href) + '"' +
      (title !== undefined ? ' title="' + escAttr(resolveEscapesEntities(title)) + '"' : '') + '>' +
      children.html + '</a>',
    next: k, isLink: true,
  };
}

// extended autolink helpers (GFM): consume a URL from s[i], trim trailing
// punctuation per the spec. Returns the trimmed URL or ''.
function scanExtUrl(s, i) {
  let j = i;
  while (j < s.length && !isSpace(s[j]) && s[j] !== '<') j++;
  let url = s.slice(i, j);
  for (;;) {
    if (url.length === 0) break;
    const last = url[url.length - 1];
    if (last === ')') {
      let open = 0, close = 0;
      for (const ch of url) { if (ch === '(') open++; else if (ch === ')') close++; }
      if (close > open) { url = url.slice(0, -1); continue; }
      break;
    }
    if (last === ';') {
      // keep the ';' only if it closes a real entity
      const m = /&(?:#(?:[xX][0-9a-fA-F]+|[0-9]+)|[A-Za-z][A-Za-z0-9]{1,31});$/.exec(url);
      if (m && decodeEntity(m[0].slice(1, -1)) !== null) break;
      url = url.slice(0, -1); continue;
    }
    if ('?!.,:*_~'.includes(last)) { url = url.slice(0, -1); continue; }
    break;
  }
  return url;
}
function validDomain(d) {
  if (!d || d.length > 253) return false;
  const labels = d.split('.');
  if (labels.length < 2) return false;
  for (const lab of labels) {
    if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(lab)) return false;
  }
  const tld = labels[labels.length - 1];
  return /^[A-Za-z]{2,}$/.test(tld);
}
// domain part of a www/scheme URL (up to / ? # or :port)
function urlDomain(url) {
  const m = /^[^/?#:]+/.exec(url);
  return m ? m[0] : '';
}

function renderAtom(a) {
  if (a.k === 't') return esc(a.s);
  if (a.k === 'd') return a.ch.repeat(a.n);
  return a.s;
}
function processDelims(atoms) {
  for (let ci = 0; ci < atoms.length; ci++) {
    const c = atoms[ci];
    if (c.k !== 'd' || !c.close || c.n === 0) continue;
    for (let oi = ci - 1; oi >= 0; oi--) {
      const o = atoms[oi];
      if (o.k !== 'd' || o.ch !== c.ch || !o.open || o.n === 0) continue;
      if ((o.open && o.close) || (c.open && c.close)) {
        if ((o.n + c.n) % 2 === 1) continue;
      }
      const use = (o.n >= 2 && c.n >= 2) ? 2 : 1;
      if (c.ch === '~' && use < 2) continue;
      const tag = c.ch === '~' ? 'del' : (use === 2 ? 'strong' : 'em');
      let inner = '';
      for (let k = oi + 1; k < ci; k++) inner += renderAtom(atoms[k]);
      const before = [];
      if (o.n - use > 0) before.push({ k: 't', s: o.ch.repeat(o.n - use) });
      before.push({ k: 'h', s: '<' + tag + '>' });
      const after = [{ k: 'h', s: inner }, { k: 'h', s: '</' + tag + '>' }];
      if (c.n - use > 0) after.push({ k: 't', s: c.ch.repeat(c.n - use) });
      atoms.splice(oi, ci - oi + 1, ...before, ...after);
      return processDelims(atoms);
    }
  }
  return atoms;
}

// inline parsing: returns {html, hasLink}
function inline(s, refs) {
  const atoms = [];
  let hasLink = false;
  const addText = (str) => {
    if (str === '') return;
    const last = atoms[atoms.length - 1];
    if (last && last.k === 't') last.s += str;
    else atoms.push({ k: 't', s: str });
  };
  let i = 0;
  const n = s.length;
  while (i < n) {
    const c = s[i];
    // backslash escape / hard break
    if (c === '\\') {
      if (s[i + 1] === '\n') { atoms.push({ k: 'h', s: '<br>' }); i += 2; continue; }
      if (i + 1 < n && PUNCT.test(s[i + 1])) { addText(s[i + 1]); i += 2; continue; }
      addText('\\'); i++; continue;
    }
    // code span
    if (c === '`') {
      let run = 0; while (s[i + run] === '`') run++;
      let k = i + run, closed = -1;
      while (k < n) {
        if (s[k] === '`') {
          let m = 0; while (s[k + m] === '`') m++;
          if (m === run) { closed = k; break; }
          k += m;
        } else k++;
      }
      if (closed === -1) { addText('`'.repeat(run)); i += run; continue; }
      let content = s.slice(i + run, closed).replace(/\n/g, ' ');
      if (content.length >= 2 && content[0] === ' ' && content[content.length - 1] === ' ' && content.trim() !== '') {
        content = content.slice(1, -1);
      }
      atoms.push({ k: 'h', s: '<code>' + esc(content) + '</code>' });
      i = closed + run;
      continue;
    }
    // '<' : autolink or raw HTML
    if (c === '<') {
      const rest = s.slice(i + 1);
      const am = /^([A-Za-z][A-Za-z0-9+.-]{1,31}:[^<>\s]*)>/.exec(rest);
      if (am) {
        const dest = cleanUrl(resolveEscapesEntities(am[1]));
        if (dest !== null) {
          atoms.push({ k: 'h', s: '<a href="' + escAttr(dest) + '">' + esc(am[1]) + '</a>' });
          hasLink = true; i += 1 + am[0].length; continue;
        }
      }
      const em = /^([A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*)>/.exec(rest);
      if (em) {
        const addr = em[1];
        atoms.push({ k: 'h', s: '<a href="mailto:' + escAttr(addr) + '">' + esc(addr) + '</a>' });
        hasLink = true; i += 1 + em[0].length; continue;
      }
      const tag = parseTag(s, i);
      if (tag) {
        if (tag.name && DISALLOWED.has(tag.name)) {
          atoms.push({ k: 'h', s: '&lt;' + tag.tag.slice(1) });
        } else {
          atoms.push({ k: 'h', s: tag.tag });
        }
        i = tag.next; continue;
      }
      addText('<'); i++; continue;
    }
    // links / images
    if (c === '!' && s[i + 1] === '[') {
      const l = tryLink(s, i + 1, true, refs);
      if (l) { atoms.push({ k: 'h', s: l.html }); i = l.next; continue; }
      addText('!'); i++; continue;
    }
    if (c === '[') {
      const l = tryLink(s, i, false, refs);
      if (l) { atoms.push({ k: 'h', s: l.html }); hasLink = true; i = l.next; continue; }
      addText('['); i++; continue;
    }
    // emphasis / strikethrough delimiter runs
    if (c === '*' || c === '_' || c === '~') {
      let run = 0; while (s[i + run] === c) run++;
      const prev = i > 0 ? s[i - 1] : undefined;
      const next = i + run < n ? s[i + run] : undefined;
      const [left, right] = flanking(prev, next);
      let open, close;
      if (c === '_') {
        open = left && (!right || isPunctChar(prev));
        close = right && (!left || isPunctChar(next));
      } else {
        open = left; close = right;
      }
      atoms.push({ k: 'd', ch: c, n: run, open, close });
      i += run;
      continue;
    }
    // newline: hard break if 2+ trailing spaces, else soft break
    if (c === '\n') {
      const last = atoms[atoms.length - 1];
      if (last && last.k === 't') {
        const m = / +$/.exec(last.s);
        if (m && m[0].length >= 2) {
          last.s = last.s.slice(0, -m[0].length);
          atoms.push({ k: 'h', s: '<br>' });
          i++; continue;
        }
      }
      addText('\n'); i++; continue;
    }
    // '&' : entity
    if (c === '&') {
      const m = /^#(?:[xX][0-9a-fA-F]+|[0-9]+)|[A-Za-z][A-Za-z0-9]{1,31}/.exec(s.slice(i + 1));
      if (m && s[i + 1 + m[0].length] === ';') {
        const d = decodeEntity(m[0]);
        if (d !== null) { addText(d); i += m[0].length + 2; continue; }
      }
      addText('&'); i++; continue;
    }
    // extended autolink: www. (lowercase only)
    if (c === 'w' && s.startsWith('www.', i)) {
      const prev = i > 0 ? s[i - 1] : undefined;
      if (prev === undefined || isSpace(prev) || '*_~('.includes(prev)) {
        const url = scanExtUrl(s, i);
        if (url.length > 4 && validDomain(urlDomain(url))) {
          atoms.push({ k: 'h', s: '<a href="' + escAttr(cleanUrl('http://' + resolveEscapesEntities(url)) || '') + '">' + esc(url) + '</a>' });
          hasLink = true; i += url.length; continue;
        }
      }
      addText('w'); i++; continue;
    }
    // extended autolink: scheme://
    if (c === ':') {
      let b = i - 1;
      while (b >= 0 && /[A-Za-z0-9+.-]/.test(s[b])) b--;
      const scheme = s.slice(b + 1, i);
      const prev = b >= 0 ? s[b] : undefined;
      if (/^[A-Za-z][A-Za-z0-9+.-]{1,31}$/.test(scheme) && s.startsWith('//', i + 1) &&
          (prev === undefined || isSpace(prev) || '*_~('.includes(prev))) {
        const url = scanExtUrl(s, b + 1);
        if (url.length > scheme.length + 3 && validDomain(urlDomain(url.slice(scheme.length + 3)))) {
          const last = atoms[atoms.length - 1];
          if (last && last.k === 't' && last.s.endsWith(scheme)) {
            last.s = last.s.slice(0, -scheme.length);
            if (last.s === '') atoms.pop();
          } else { addText(':'); i++; continue; }
          atoms.push({ k: 'h', s: '<a href="' + escAttr(cleanUrl(resolveEscapesEntities(url)) || '') + '">' + esc(url) + '</a>' });
          hasLink = true; i = b + 1 + url.length; continue;
        }
      }
      addText(':'); i++; continue;
    }
    // extended autolink: email (check at '@')
    if (c === '@') {
      let b = i - 1;
      while (b >= 0 && /[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]/.test(s[b])) b--;
      const local = s.slice(b + 1, i);
      const prev = b >= 0 ? s[b] : undefined;
      if (local.length > 0 && (prev === undefined || isSpace(prev) || '*_~('.includes(prev)) && prev !== '/') {
        const rest = s.slice(i + 1);
        const dm = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*/.exec(rest);
        if (dm && validDomain(dm[0])) {
          const email = local + '@' + dm[0];
          // rewind the local part out of the last text atom
          const last = atoms[atoms.length - 1];
          if (last && last.k === 't' && last.s.endsWith(local)) {
            last.s = last.s.slice(0, -local.length);
            if (last.s === '') atoms.pop();
          } else { addText('@'); i++; continue; }
          atoms.push({ k: 'h', s: '<a href="mailto:' + escAttr(email) + '">' + esc(email) + '</a>' });
          hasLink = true; i += 1 + dm[0].length; continue;
        }
      }
      addText('@'); i++; continue;
    }
    // plain text run: stop at the next special character
    let j = i;
    while (j < n) {
      const ch = s[j];
      if (ch === '\\' || ch === '`' || ch === '<' || ch === '[' || ch === '*' || ch === '_' || ch === '~' || ch === '\n' || ch === '&' || ch === '@' || ch === ':') break;
      if (ch === '!' && s[j + 1] === '[') break;
      if (ch === 'w' && s.startsWith('www.', j)) break;
      j++;
    }
    if (j === i) { addText(s[i]); i++; continue; }
    addText(s.slice(i, j));
    i = j;
  }
  const done = processDelims(atoms);
  let html = '';
  for (const a of done) html += renderAtom(a);
  return { html, hasLink };
}

// ---------- block parsing ----------
const BLOCK_TAGS = new Set(['address', 'article', 'aside', 'base', 'basefont', 'blockquote', 'body', 'caption', 'center', 'col', 'colgroup', 'dd', 'details', 'dialog', 'dir', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'iframe', 'legend', 'li', 'link', 'main', 'menu', 'menuitem', 'nav', 'noframes', 'ol', 'optgroup', 'option', 'p', 'param', 'section', 'source', 'summary', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'title', 'tr', 'track', 'ul']);

// try to parse a link reference definition starting at lines[i].
// Returns the index after the definition, or -1. The destination may sit
// on the next line and the title may span several lines, so the definition
// is parsed from the following lines joined with '\n'.
function tryDef(lines, i, refs) {
  const line = lines[i];
  const ind = indentOf(line);
  if (ind > 3) return -1;
  const s = stripCols(line, ind);
  if (s[0] !== '[') return -1;
  // the label may span lines, so join the following non-blank lines first
  let joined = s;
  let k = i + 1, count = 1;
  while (k < lines.length && count < 12 && !isBlankLine(lines[k])) {
    joined += '\n' + lines[k];
    count++;
    k++;
  }
  let j = 1, depth = 0;
  while (j < joined.length) {
    if (joined[j] === '\\' && j + 1 < joined.length && PUNCT.test(joined[j + 1])) { j += 2; continue; }
    if (joined[j] === '[') depth++;
    if (joined[j] === ']') { if (depth === 0) break; depth--; }
    j++;
  }
  if (j >= joined.length || joined[j] !== ']' || joined[j + 1] !== ':') return -1;
  const norm = normalizeLabel(joined.slice(1, j));
  if (norm === '' || norm.length > 999) return -1;
  let p = j + 2;
  while (p < joined.length && (joined[p] === ' ' || joined[p] === '\t')) p++;
  if (joined[p] === '\n') {
    p++;
    while (p < joined.length && (joined[p] === ' ' || joined[p] === '\t')) p++;
  }
  const d = parseDest(joined, p);
  if (!d) return -1;
  let title;
  let endPos = d.next;
  let destLines = 1;
  for (let x = 0; x < d.next; x++) if (joined[x] === '\n') destLines++;
  let titleAttempted = false;
  let r = d.next;
  while (r < joined.length && (joined[r] === ' ' || joined[r] === '\t')) r++;
  const wsBefore = r > d.next; // a title must be separated from the dest by whitespace
  if (wsBefore && r < joined.length && joined[r] !== '\n' &&
      (joined[r] === '"' || joined[r] === "'" || joined[r] === '(')) {
    titleAttempted = true;
    const t = parseTitle(joined, r);
    if (!t) return -1; // a title on the destination's own line that cannot
    // be parsed invalidates the whole definition
    let r2 = t.next;
    while (r2 < joined.length && (joined[r2] === ' ' || joined[r2] === '\t')) r2++;
    if (r2 < joined.length && joined[r2] !== '\n') return -1;
    title = t.title; endPos = t.next;
  } else if (joined[r] === '\n') {
    let r2 = r + 1;
    while (r2 < joined.length && (joined[r2] === ' ' || joined[r2] === '\t')) r2++;
    if (r2 < joined.length && (joined[r2] === '"' || joined[r2] === "'" || joined[r2] === '(')) {
      titleAttempted = true;
      const t = parseTitle(joined, r2);
      if (t) {
        let r3 = t.next;
        while (r3 < joined.length && (joined[r3] === ' ' || joined[r3] === '\t')) r3++;
        if (r3 >= joined.length || joined[r3] === '\n') { title = t.title; endPos = t.next; }
        // trailing junk after a title: fall back to the destination alone
      }
    }
  }
  if (!titleAttempted) {
    // no title: only whitespace may follow the destination on its line
    let e = d.next;
    while (e < joined.length && (joined[e] === ' ' || joined[e] === '\t')) e++;
    if (e < joined.length && joined[e] !== '\n') return -1;
  }
  let consumed = 1;
  for (let x = 0; x < endPos; x++) if (joined[x] === '\n') consumed++;
  if (endPos === d.next) consumed = destLines;
  if (!refs.has(norm)) refs.set(norm, { dest: d.dest, title });
  return i + consumed;
}

// HTML block start: returns {type:1..7, endRe?, endStr?} or null
function htmlBlockStart(line) {
  const ind = indentOf(line);
  if (ind > 3) return null;
  const s = stripCols(line, ind);
  if (!s.startsWith('<')) return null;
  const low = s.toLowerCase();
  const m1 = /^<(script|pre|style|textarea)([ \t>]|$)/.exec(low);
  if (m1) return { type: 1, endRe: new RegExp('</' + m1[1] + '>', 'i') };
  if (low.startsWith('<!--')) return { type: 2, endStr: '-->' };
  if (low.startsWith('<?')) return { type: 3, endStr: '?>' };
  if (/^<![a-z]/i.test(s)) return { type: 4, endStr: '>' };
  if (low.startsWith('<![cdata[')) return { type: 5, endStr: ']]>' };
  const m = /^<\/?([A-Za-z][A-Za-z0-9-]*)/.exec(s);
  if (!m) return null;
  const after = s[m[0].length];
  if (after !== undefined && after !== ' ' && after !== '\t' && after !== '>' && !(after === '/' && s[m[0].length + 1] === '>')) return null;
  // a tag whose text (up to the first >) contains a backtick is not an
  // HTML block start (marked behaviour, cm-344)
  const gt = s.indexOf('>');
  if (gt !== -1 && s.slice(0, gt).includes('`')) return null;
  return { type: BLOCK_TAGS.has(m[1].toLowerCase()) ? 6 : 7 };
}

function fenceStart(line) {
  const ind = indentOf(line);
  if (ind > 3) return null;
  const s = stripCols(line, ind);
  const m = /^(`{3,}|~{3,})/.exec(s);
  if (!m) return null;
  const ch = m[0][0];
  const info = s.slice(m[0].length);
  if (ch === '`' && info.includes('`')) return null;
  return { ch, len: m[0].length, info: info.trim() };
}
function isFenceClose(line, fence) {
  const ind = indentOf(line);
  if (ind > 3) return false;
  const s = stripCols(line, ind);
  const m = new RegExp('^\\' + fence.ch + '{' + fence.len + ',}[ \t]*$').exec(s);
  return !!m;
}

function atxHeading(line) {
  const ind = indentOf(line);
  if (ind > 3) return null;
  const s = stripCols(line, ind);
  const m = /^(#{1,6})(?:[ \t]+(.*)|[ \t]*)$/.exec(s);
  if (!m) return null;
  let text = (m[2] === undefined ? '' : m[2]).replace(/[ \t]+$/, '');
  if (/^#+$/.test(text)) text = '';
  else {
    const cm = /[ \t](#+)$/.exec(text);
    if (cm) text = text.slice(0, cm.index);
  }
  return { level: m[1].length, text };
}
function isHr(line) {
  const ind = indentOf(line);
  if (ind > 3) return false;
  const s = stripCols(line, ind).replace(/[ \t]+/g, '');
  return /^(\*{3,}|-{3,}|_{3,})$/.test(s);
}
// returns 1 for ===, 2 for ---, 0 otherwise
function setextUnderline(line) {
  const ind = indentOf(line);
  if (ind > 3) return 0;
  const s = stripCols(line, ind);
  if (/^=+[ \t]*$/.test(s)) return 1;
  if (/^-+[ \t]*$/.test(s)) return 2;
  return 0;
}
function isQuoteStart(line) {
  const ind = indentOf(line);
  if (ind > 3) return false;
  return stripCols(line, ind).startsWith('>');
}

// content after a marker: skip the marker, then consume up to `cols`
// columns of whitespace (expanded to spaces at absolute columns)
function afterMarker(s, ind, markerLen, cols) {
  return stripCols(s.slice(markerLen), cols, ind + markerLen);
}
function colWidthFrom(ws, startCol) {
  let col = startCol;
  for (const c of ws) {
    if (c === ' ') col++;
    else if (c === '\t') col += 4 - (col % 4);
  }
  return col - startCol;
}

// list marker: returns {ordered, delim, startNum, indent, contentCol, content} or null
function listMarker(line) {
  const ind = indentOf(line);
  if (ind > 3) return null;
  const s = stripCols(line, ind);
  let m = /^([*+-])([ \t]*)(.*)$/.exec(s);
  if (m) {
    const markerLen = 1;
    if (m[2] === '' && m[3] !== '') return null;
    if (m[3] === '') {
      // empty item: the spaces after the marker do not count; content
      // indent is marker width + 1
      return { ordered: false, delim: m[1], startNum: 0, indent: ind, contentCol: ind + markerLen + 1, content: '' };
    }
    const wsWidth = colWidthFrom(m[2], ind + markerLen);
    const consume = wsWidth >= 5 ? 1 : wsWidth;
    return { ordered: false, delim: m[1], startNum: 0, indent: ind, contentCol: ind + markerLen + consume, content: afterMarker(s, ind, markerLen, consume) };
  }
  m = /^([0-9]{1,9})([.)])([ \t]*)(.*)$/.exec(s);
  if (m) {
    const markerLen = m[1].length + 1;
    if (m[3] === '' && m[4] !== '') return null;
    if (m[4] === '') {
      return { ordered: true, delim: m[2], startNum: parseInt(m[1], 10), indent: ind, contentCol: ind + markerLen + 1, content: '' };
    }
    const wsWidth = colWidthFrom(m[3], ind + markerLen);
    const consume = wsWidth >= 5 ? 1 : wsWidth;
    return { ordered: true, delim: m[2], startNum: parseInt(m[1], 10), indent: ind, contentCol: ind + markerLen + consume, content: afterMarker(s, ind, markerLen, consume) };
  }
  return null;
}

// split a table row on |, code-span aware; \| is a literal pipe
function splitCells(line) {
  const cells = [];
  let cur = '', i = 0;
  while (i < line.length) {
    const c = line[i];
    if (c === '\\' && i + 1 < line.length && line[i + 1] === '|') { cur += '\\|'; i += 2; continue; }
    if (c === '`') {
      let run = 0; while (line[i + run] === '`') run++;
      let k = i + run, closed = -1;
      while (k < line.length) {
        if (line[k] === '`') {
          let m2 = 0; while (line[k + m2] === '`') m2++;
          if (m2 === run) { closed = k; break; }
          k += m2;
        } else k++;
      }
      if (closed === -1) { cur += line.slice(i); break; }
      cur += line.slice(i, closed + run); i = closed + run; continue;
    }
    if (c === '|') { cells.push(cur); cur = ''; i++; continue; }
    cur += c; i++;
  }
  cells.push(cur);
  if (cells.length > 0 && cells[0].trim() === '') cells.shift();
  if (cells.length > 0 && cells[cells.length - 1].trim() === '') cells.pop();
  return cells;
}
// is lines[j] a table header with a valid delimiter row at j+1?
function isTableStart(lines, j, b) {
  if (j + 1 >= b) return false;
  const h = lines[j];
  if (indentOf(h) > 3 || !h.includes('|')) return false;
  const head = splitCells(h);
  if (head.length === 0) return false;
  const d = lines[j + 1];
  if (indentOf(d) > 3) return false;
  const delims = splitCells(d);
  if (delims.length !== head.length) return false;
  for (const cell of delims) {
    if (!/^:?-+:?$/.test(cell.trim())) return false;
  }
  return true;
}

// is this line plain paragraph text (not the start of another block)?
function isParaLine(line) {
  if (isBlankLine(line)) return false;
  if (atxHeading(line)) return false;
  if (fenceStart(line)) return false;
  if (isHr(line)) return false;
  if (isQuoteStart(line)) return false;
  if (listMarker(line)) return false;
  const hb = htmlBlockStart(line);
  if (hb && hb.type <= 6) return false;
  if (indentOf(line) >= 4) return false;
  return true;
}

function collectQuote(lines, i, b) {
  const sub = [];
  let j = i;
  while (j < b) {
    const line = lines[j];
    const ind = indentOf(line);
    if (ind <= 3 && stripCols(line, ind).startsWith('>')) {
      const rest = stripCols(stripCols(line, ind).slice(1), 1, ind + 1);
      sub.push(rest);
      j++;
      continue;
    }
    // a blank line without '>' ends the quote (laziness covers paragraph
    // continuation lines only, never a blank line)
    if (isBlankLine(line)) break;
    // lazy continuation: merge into the open paragraph line (a lazy line is
    // paragraph text, never a new block — e.g. a list marker below the
    // content column must not become a phantom nested list). The candidate
    // itself must be paragraph continuation text: never a setext underline,
    // fence, heading, hr, quote, or HTML block start.
    if (sub.length > 0 && isParaLine(sub[sub.length - 1]) && setextUnderline(line) === 0 && (isParaLine(line) || listMarker(line))) { sub[sub.length - 1] += '\n' + line; j++; continue; }
    break;
  }
  return { sub, next: j };
}

function parseList(lines, i, b, refs, first) {
  const ordered = first.ordered;
  const delim = first.delim;
  const baseIndent = first.indent;
  const items = [];
  let j = i;
  let loose = false;
  let prevTrailingBlank = false;
  while (j < b) {
    const line = lines[j];
    const lm = listMarker(line);
    if (!lm || lm.ordered !== ordered || lm.delim !== delim || lm.indent !== baseIndent) break;
    if (prevTrailingBlank) loose = true;
    // task marker on the first content line
    let task = false, checked = false;
    let content = lm.content;
    const tm = /^\[([ xX])\]([ \t]|$)/.exec(content);
    if (tm) { task = true; checked = tm[1] !== ' '; content = content.slice(3); }
    const itemLines = [content];
    j++;
    while (j < b) {
      const l = lines[j];
      if (isBlankLine(l)) { itemLines.push(''); j++; continue; }
      const nm = listMarker(l);
      if (nm && nm.ordered === ordered && nm.delim === delim && nm.indent === baseIndent) break;
      if (indentOf(l) >= lm.contentCol) { itemLines.push(stripCols(l, lm.contentCol)); j++; continue; }
      if (itemLines.length > 0 && isParaLine(itemLines[itemLines.length - 1])) { itemLines[itemLines.length - 1] += '\n' + l; j++; continue; }
      break;
    }
    // looseness: blank line between two non-blank lines inside the item
    let firstNB = -1, lastNB = -1;
    for (let k = 0; k < itemLines.length; k++) {
      if (!isBlankLine(itemLines[k])) { if (firstNB === -1) firstNB = k; lastNB = k; }
    }
    for (let k = firstNB + 1; k < lastNB; k++) {
      if (isBlankLine(itemLines[k])) { loose = true; break; }
    }
    prevTrailingBlank = lastNB !== -1 && lastNB < itemLines.length - 1;
    const children = parseBlocks(itemLines, 0, itemLines.length, refs);
    items.push({ task, checked, children });
  }
  // trailing blanks after the LAST item do not loosen the list
  return { node: { t: 'list', ordered, start: first.startNum, tight: !loose, items }, next: j };
}

function tryTable(lines, i, b) {
  if (!isTableStart(lines, i, b)) return null;
  const head = splitCells(lines[i]).map((c) => c.trim());
  const delims = splitCells(lines[i + 1]);
  const aligns = delims.map((c) => {
    const t = c.trim();
    const left = t.startsWith(':'), right = t.endsWith(':');
    if (left && right) return 'center';
    if (right) return 'right';
    if (left) return 'left';
    return null;
  });
  const rows = [];
  let j = i + 2;
  while (j < b) {
    const l = lines[j];
    if (isBlankLine(l)) break;
    if (isQuoteStart(l)) break;
    if (atxHeading(l)) break;
    if (fenceStart(l)) break;
    if (isHr(l)) break;
    if (listMarker(l)) break;
    const hb = htmlBlockStart(l);
    if (hb && hb.type <= 6) break;
    let cells = splitCells(l).map((c) => c.trim());
    while (cells.length < head.length) cells.push('');
    if (cells.length > head.length) cells = cells.slice(0, head.length);
    rows.push(cells);
    j++;
  }
  return { node: { t: 'table', aligns, head, rows }, next: j };
}

function parseParagraph(lines, i, b, refs) {
  const textLines = [];
  let j = i;
  while (j < b) {
    const line = lines[j];
    if (isBlankLine(line)) break;
    if (textLines.length > 0) {
      const su = setextUnderline(line);
      if (su) return { node: { t: 'h', level: su, text: textLines.join('\n') }, next: j + 1 };
      if (atxHeading(line)) break;
      if (fenceStart(line)) break;
      if (isHr(line)) break;
      if (isQuoteStart(line)) break;
      const hb = htmlBlockStart(line);
      if (hb && hb.type <= 6) break;
      const lm = listMarker(line);
      if (lm) {
        const nonEmpty = lm.content.trim() !== '';
        if (!lm.ordered && nonEmpty) break;
        if (lm.ordered && lm.startNum === 1 && nonEmpty) break;
      }
      if (isTableStart(lines, j, b)) break;
    }
    textLines.push(line);
    j++;
  }
  if (textLines.length === 0) return { node: null, next: j };
  return { node: { t: 'para', text: textLines.join('\n') }, next: j };
}

function parseBlocks(lines, a, b, refs) {
  const nodes = [];
  let i = a;
  while (i < b) {
    const line = lines[i];
    if (isBlankLine(line)) { i++; continue; }
    const ind = indentOf(line);
    const atx = atxHeading(line);
    if (atx) { nodes.push({ t: 'h', level: atx.level, text: atx.text }); i++; continue; }
    const fence = fenceStart(line);
    if (fence) {
      const content = [];
      i++;
      while (i < b) {
        if (isFenceClose(lines[i], fence)) { i++; break; }
        content.push(lines[i]);
        i++;
      }
      nodes.push({ t: 'code', lang: fence.info ? fence.info.split(/\s+/)[0] : null, text: content.join('\n') + (content.length ? '\n' : '') });
      continue;
    }
    const hb = htmlBlockStart(line);
    if (hb) {
      if (hb.type <= 5) {
        let j = i;
        while (j < b) {
          if (hb.endRe ? hb.endRe.test(lines[j]) : lines[j].includes(hb.endStr)) break;
          j++;
        }
        if (j >= b) j = b - 1;
        const nextLine = lines[j + 1];
        let text = lines.slice(i, j + 1).join('\n');
        if (nextLine !== undefined && nextLine !== '') text += '\n';
        nodes.push({ t: 'html', text });
        i = j + 1;
        continue;
      }
      let j = i;
      while (j < b && !isBlankLine(lines[j])) j++;
      const nextLine = lines[j];
      let text = lines.slice(i, j).join('\n');
      if (nextLine !== undefined && !isBlankLine(nextLine)) text += '\n';
      nodes.push({ t: 'html', text });
      i = j;
      continue;
    }
    if (isHr(line)) { nodes.push({ t: 'hr' }); i++; continue; }
    if (isQuoteStart(line)) {
      const { sub, next } = collectQuote(lines, i, b);
      nodes.push({ t: 'quote', children: parseBlocks(sub, 0, sub.length, refs) });
      i = next; continue;
    }
    const lm = listMarker(line);
    if (lm) {
      const { node, next } = parseList(lines, i, b, refs, lm);
      nodes.push(node);
      i = next; continue;
    }
    const table = tryTable(lines, i, b);
    if (table) { nodes.push(table.node); i = table.next; continue; }
    if (ind >= 4) {
      const content = [];
      while (i < b) {
        const l = lines[i];
        if (isBlankLine(l)) {
          let k = i + 1;
          while (k < b && isBlankLine(lines[k])) k++;
          if (k < b && indentOf(lines[k]) >= 4) { content.push(''); i++; continue; }
          break;
        }
        if (indentOf(l) < 4) break;
        content.push(stripCols(l, 4));
        i++;
      }
      while (content.length && content[content.length - 1] === '') content.pop();
      nodes.push({ t: 'code', lang: null, text: content.join('\n') + (content.length ? '\n' : '') });
      continue;
    }
    const defNext = tryDef(lines, i, refs);
    if (defNext > i) { i = defNext; continue; }
    const { node, next } = parseParagraph(lines, i, b, refs);
    if (node) nodes.push(node);
    i = next;
  }
  return nodes;
}

function renderBlocks(blocks, refs, tight = false) {
  let out = '';
  for (const blk of blocks) {
    switch (blk.t) {
      case 'para':
        out += tight ? inline(blk.text, refs).html : '<p>' + inline(blk.text, refs).html + '</p>\n';
        break;
      case 'h':
        out += '<h' + blk.level + '>' + inline(blk.text, refs).html + '</h' + blk.level + '>\n';
        break;
      case 'code':
        out += '<pre><code' + (blk.lang ? ' class="language-' + escAttr(blk.lang) + '"' : '') + '>' + esc(blk.text) + '</code></pre>\n';
        break;
      case 'hr':
        out += '<hr>\n';
        break;
      case 'quote':
        out += '<blockquote>\n' + renderBlocks(blk.children, refs) + '</blockquote>\n';
        break;
      case 'list': {
        out += blk.ordered ? '<ol' + (blk.start !== 1 ? ' start="' + blk.start + '"' : '') + '>\n' : '<ul>\n';
        for (const item of blk.items) {
          const cb = item.task
            ? (item.checked ? '<input checked="" disabled="" type="checkbox">' : '<input disabled="" type="checkbox">')
            : '';
          let inner = renderBlocks(item.children, refs, blk.tight);
          if (cb) {
            if (inner.startsWith('<p>')) inner = '<p>' + cb + inner.slice(3);
            else inner = cb + inner;
          }
          out += '<li>' + inner + '</li>\n';
        }
        out += blk.ordered ? '</ol>\n' : '</ul>\n';
        break;
      }
      case 'html':
        out += blk.text;
        break;
      case 'table': {
        out += '<table>\n<thead>\n<tr>\n';
        for (let k = 0; k < blk.head.length; k++) {
          out += '<th' + (blk.aligns[k] ? ' align="' + blk.aligns[k] + '"' : '') + '>' + inline(blk.head[k], refs).html + '</th>\n';
        }
        out += '</tr>\n</thead>\n';
        if (blk.rows.length > 0) {
          out += '<tbody>';
          for (const row of blk.rows) {
            out += '<tr>\n';
            for (let k = 0; k < blk.head.length; k++) {
              out += '<td' + (blk.aligns[k] ? ' align="' + blk.aligns[k] + '"' : '') + '>' + inline(row[k] || '', refs).html + '</td>\n';
            }
            out += '</tr>\n';
          }
          out += '</tbody></table>\n';
        } else {
          out += '</table>\n';
        }
        break;
      }
    }
  }
  return out;
}

export function parse(src) {
  const text = src.replace(/\r\n?/g, '\n');
  const lines = text.split('\n');
  const refs = new Map();
  const blocks = parseBlocks(lines, 0, lines.length, refs);
  return renderBlocks(blocks, refs);
}
