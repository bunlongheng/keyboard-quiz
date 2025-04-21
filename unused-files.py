import os

PUBLIC_DIR = "public"
SRC_DIR = "src"

def collect_svg_files():
    svgs = []
    for root, _, files in os.walk(PUBLIC_DIR):
        for file in files:
            if file.endswith(".svg"):
                rel_path = os.path.relpath(os.path.join(root, file), PUBLIC_DIR)
                svgs.append((file, rel_path.replace("\\", "/")))
    return svgs

def find_used_svg_filenames(svg_filenames):
    used = set()
    for root, _, files in os.walk(SRC_DIR):
        for file in files:
            if not file.endswith((".js", ".jsx", ".ts", ".tsx")):
                continue
            try:
                with open(os.path.join(root, file), "r", encoding="utf-8") as f:
                    content = f.read()
                    for svg, _ in svg_filenames:
                        if svg in content:
                            used.add(svg)
            except Exception:
                pass
    return used

def main():
    svg_files = collect_svg_files()
    used_filenames = find_used_svg_filenames(svg_files)

    unused_svgs = [path for name, path in svg_files if name not in used_filenames]

    print(f"\n🖼 Total SVGs in public/: {len(svg_files)}")
    print(f"✅ Used SVGs: {len(used_filenames)}")
    print(f"🧹 Unused SVGs: {len(unused_svgs)}\n")

    for svg in unused_svgs:
        print(f" - {svg}")

if __name__ == "__main__":
    main()