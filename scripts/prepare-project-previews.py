"""Optimize captured public website previews without changing their content."""
from pathlib import Path
import hashlib
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / "docs/project-previews/2026-11-03"
OUTPUT = ROOT / "public/projects"
URLS = {
    "lawpro360": "https://legal.igc.co.ke/",
    "cargoforward360": "https://consignment.igc.co.ke/",
    "nashami-limited": "https://nashamiltd.org/",
    "raxos-website": "https://raxos-website.vercel.app/",
    "njoroge-kiriro-advocates": "https://njoroge-kiriro-advocates.vercel.app/",
    "agent-pipeline-foundry": "https://agent-pipeline-foundry.vercel.app/login?redirectTo=%2F",
    "testassessment": "https://testassessment.vercel.app/",
    "igc-portal": "https://igc-portal.vercel.app/",
    "kalamu": "https://kalamu.net/",
    "dolmis": "https://dolmis.go.ke/",
}

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

OUTPUT.mkdir(parents=True, exist_ok=True)
records = []
for slug, url in URLS.items():
    source = SOURCES / f"{slug}.{'png' if slug == 'dolmis' else 'jpg'}"
    with Image.open(source) as original:
        image = original.convert("RGB")
        image.thumbnail((1080, 1080), Image.Resampling.LANCZOS)
        variants = []
        for extension, quality in [("avif", 50), ("webp", 80)]:
            target = OUTPUT / f"{slug}.{extension}"
            image.save(target, quality=quality)
            variants.append({"path": f"/projects/{target.name}", "bytes": target.stat().st_size,
                             "sha256": digest(target)})
        records.append({"slug": slug, "url": url, "capturedOn": "2026-11-03",
                        "kind": "public-sign-in" if slug == "agent-pipeline-foundry" else "public-website",
                        "source": source.relative_to(ROOT).as_posix(), "sourceSha256": digest(source),
                        "width": image.width, "height": image.height, "variants": variants})
        if slug == "dolmis":
            records[-1].pop("capturedOn")
            records[-1].update({"projectSlug": "ecms", "providedOn": "2026-11-03",
                               "sourceMethod": "Owner-supplied screenshot; capture date unspecified."})

manifest = {"method": "Public-page screenshots from browser controls or owner-supplied sources; resize and format optimization only; no private application data.",
            "previews": records,
            "unavailable": []}
(OUTPUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
print(json.dumps([{"slug": r["slug"], "width": r["width"], "height": r["height"],
                   "avifBytes": r["variants"][0]["bytes"]} for r in records], indent=2))
