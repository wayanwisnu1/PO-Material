import pathlib

root = pathlib.Path("resources/views")

old = """    @auth
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

new = """    @auth
    @php
        $__halcyonUser = auth()->user();
        $__halcyonProfile = [
            'name' => $__halcyonUser->name,
            'email' => $__halcyonUser->email,
            'role' => optional($__halcyonUser->role)->name,
        ];
        $__halcyonPerms = $__halcyonUser->permissionNames();
    @endphp
    <script>
        window.__HALCYON_PROFILE__ = {!! json_encode($__halcyonProfile) !!};
        window.__HALCYON_PERMISSIONS__ = {!! json_encode($__halcyonPerms) !!};
    </script>
    @endauth
"""

changed = []
for f in sorted(root.glob("*.blade.php")):
    text = f.read_text(encoding="utf-8")
    if old not in text:
        continue
    f.write_text(text.replace(old, new), encoding="utf-8")
    changed.append(f.name)

print("fixed:", len(changed))
for c in changed:
    print(" -", c)
