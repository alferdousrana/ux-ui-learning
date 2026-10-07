#!/usr/bin/env python3
"""Release helper — run before every deploy.

    python3 tools/release.py 3.0.1

1. Writes the version into js/version.js
2. Regenerates service-worker.js from service-worker.js.tmpl with the new
   CACHE_VERSION and a complete PRECACHE list of every app file.
Because service-worker.js changes byte-for-byte, every browser and installed
app detects the new version on its next check and shows "Update available".
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP = {'service-worker.js', 'js/firebase/firebase-adapter.js', 'firebase.json'}
EXT = ('.js', '.css', '.html', '.json', '.png', '.svg', '.woff2')

def main():
    if len(sys.argv) != 2 or not re.fullmatch(r'\d+\.\d+\.\d+', sys.argv[1]):
        sys.exit('Usage: python3 tools/release.py MAJOR.MINOR.PATCH')
    v = sys.argv[1]
    vf = os.path.join(ROOT, 'js', 'version.js')
    s = open(vf, encoding='utf-8').read()
    s = re.sub(r"APP_VERSION = '[^']+'", f"APP_VERSION = '{v}'", s)
    open(vf, 'w', encoding='utf-8').write(s)
    files = []
    for d, dirs, fs in os.walk(ROOT):
        dirs[:] = [x for x in dirs if x not in ('tools', '.git', 'node_modules')]
        for f in fs:
            p = os.path.relpath(os.path.join(d, f), ROOT).replace(os.sep, '/')
            if p.endswith(EXT) and p not in SKIP and not p.startswith('tools/'):
                files.append(p)
    files.sort()
    lines = "  './',\n" + "\n".join(f"  './{p}'," for p in files)
    tmpl = open(os.path.join(ROOT, 'service-worker.js.tmpl'), encoding='utf-8').read()
    out = tmpl.replace('__VERSION__', v).replace('__FILES__', lines)
    open(os.path.join(ROOT, 'service-worker.js'), 'w', encoding='utf-8').write(out)
    print(f'Released v{v}: {len(files)} files precached. Add a CHANGELOG entry in js/version.js, then deploy.')

if __name__ == '__main__':
    main()
