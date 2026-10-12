#!/usr/bin/env python3
"""Optional helper: serve this folder at http://localhost:8000/ (needs Python 3). Stop with Ctrl+C.

    python3 serve.py          # then open http://localhost:8000/
Opening index.html by double-click does NOT work: browsers block the fetch/WebAssembly the lab needs on file:// pages.
"""
import http.server
import socketserver
import webbrowser

PORT = 8000


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, ".wasm": "application/wasm", ".js": "text/javascript", ".mjs": "text/javascript"}


with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
    print(f"Lab running at http://localhost:{PORT}/  (Ctrl+C to stop)")
    webbrowser.open(f"http://localhost:{PORT}/")
    httpd.serve_forever()
