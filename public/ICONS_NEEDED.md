# PWA Icon Placeholders

These icon files need to be created with actual graphics:

- icon-192x192.png (192x192 pixels)
- icon-512x512.png (512x512 pixels)

## Design Requirements (T008)

- **Theme**: Cannabis terpene/botanical theme
- **Colors**: Brand green (#4caf50) as primary
- **Format**: PNG with transparency
- **Purpose**: Both "any" and "maskable" variants
- **Maskable Safe Zone**: 80% of canvas (40px margin on 192px, 102px margin on 512px)

## Recommended Tools

- Figma, Adobe Illustrator, or Inkscape for vector design
- Export as PNG at exact dimensions
- Use PWA Asset Generator for maskable variants

## Temporary Workaround

Until actual icons are created, the app will use the browser's default PWA icon.
The manifest.json is correctly configured and waiting for the icon files.

## Task Reference

See tasks.md T008 for complete PWA setup requirements.
