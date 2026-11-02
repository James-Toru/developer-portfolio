"""Reproduce the approved original artwork derivatives with Pillow."""
from pathlib import Path
from PIL import Image
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'docs/art-source'
OUTPUT = ROOT / 'public/art'
OUTPUT.mkdir(parents=True, exist_ok=True)
manifest = {'provenance': 'Original OpenAI imagegen artwork; exact prompts retained under docs/art-source. No mockup pixels are shipped.', 'assets': []}

def export(name, source_name, dimensions, crop=None, quality=58):
    source = SOURCE / source_name
    original = Image.open(source).convert('RGB')
    art = original.crop(crop) if crop else original
    art = art.resize(dimensions, Image.Resampling.LANCZOS)
    for extension, settings in [('avif', {'quality': quality, 'speed': 6}), ('webp', {'quality': 80, 'method': 6})]:
        target = OUTPUT / f'{name}.{extension}'
        art.save(target, **settings)
        with Image.open(target) as check:
            check.load()
            assert check.size == dimensions
        manifest['assets'].append({'file': target.name, 'width': dimensions[0], 'height': dimensions[1], 'bytes': target.stat().st_size, 'source': source_name, 'sourceWidth': original.width, 'sourceHeight': original.height, 'crop': crop, 'sha256': hashlib.sha256(target.read_bytes()).hexdigest()})

export('city-desktop', 'city-master.png', (1536, 1024))
export('city-mobile', 'city-master.png', (720, 960), (430, 0, 1198, 1024))
export('workflow', 'workflow-master.png', (1080, 360))
export('portal', 'portal-master.png', (1080, 360))
export('lugawa', 'city-master.png', (1080, 360), (0, 160, 1536, 672))
(OUTPUT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
for item in manifest['assets']:
    print(f"{item['file']}: {item['width']}x{item['height']}, {item['bytes']:,} bytes")
