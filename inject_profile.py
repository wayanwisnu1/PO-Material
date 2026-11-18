import pathlib

root = pathlib.Path("resources/views")
skip = {"login.blade.php"}

snippet = """    @auth
    <script>
        window.__HALCYON_PROFILE__ = @json([
            'name' => auth()->user()->name,
            'email' => auth()->user()->email,
            'role' => auth()->user()->role?->name,
        ]);
        window.__HALCYON_PERMISSIONS__ = @json(auth()->user()->permissionNames());
    </script>
    @endauth
"""

changed = []
for f in sorted(root.glob("*.blade.php")):
    if f.name in skip:
        continue
    text = f.read_text(encoding="utf-8")
    if 'id="app"' not in text:
        continue
    if "__HALCYON_PROFILE__" in text:
        continue
    if "</head>" not in text:
        print("NO HEAD:", f.name)
        continue
    text = text.replace("</head>", snippet + "</head>", 1)
    f.write_text(text, encoding="utf-8")
    changed.append(f.name)

print("changed:", len(changed))
for c in changed:
    print(" -", c)
