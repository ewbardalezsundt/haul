# HAUL — Image Requirements Checklist

All images should be placed in `public/images/equipment/` (for assets) and `public/images/` (for branding). Once supplied, the `photo` field in `src/lib/data.ts` will be updated from emoji placeholders to the corresponding paths (e.g., `"/images/equipment/cat-320-excavator.jpg"`).

**Recommended format:** JPG or WebP, landscape orientation, minimum 800×600px, white or neutral background preferred for catalog consistency.

---

## Branding (1 image)

| # | Filename | Description | Current State |
|---|---|---|---|
| 1 | `sundt-logo.png` | Sundt Construction logo (transparent background PNG). Used in the header — replaces the red "H" square placeholder. | Red square with white "H" |

**Location:** `public/images/sundt-logo.png`

---

## Equipment Photos (17 images)

Each row maps to an asset in `src/lib/data.ts`. The "Current Emoji" column shows what's being replaced.

### Excavators (3)

| # | Asset ID | Filename | Equipment | Make / Model / Year | Current Emoji |
|---|---|---|---|---|---|
| 2 | asset-1 | `cat-320-excavator.jpg` | CAT 320 Excavator | Caterpillar 320 (2022) | 🏗️ |
| 3 | asset-2 | `cat-330-excavator.jpg` | CAT 330 Excavator | Caterpillar 330 (2021) | 🏗️ |
| 4 | asset-3 | `jd-350g-excavator.jpg` | John Deere 350G Excavator | John Deere 350G (2023) | 🏗️ |

### Skid Steers (3)

| # | Asset ID | Filename | Equipment | Make / Model / Year | Current Emoji |
|---|---|---|---|---|---|
| 5 | asset-4 | `cat-259d-skidsteer.jpg` | CAT 259D Skid Steer | Caterpillar 259D3 (2023) | 🚜 |
| 6 | asset-5 | `jd-333g-skidsteer.jpg` | John Deere 333G Skid Steer | John Deere 333G (2022) | 🚜 |
| 7 | asset-6 | `bobcat-t770-skidsteer.jpg` | Bobcat T770 Skid Steer | Bobcat T770 (2021) | 🚜 |

### Loaders (2)

| # | Asset ID | Filename | Equipment | Make / Model / Year | Current Emoji |
|---|---|---|---|---|---|
| 8 | asset-7 | `cat-950m-loader.jpg` | CAT 950 Wheel Loader | Caterpillar 950M (2022) | 🚛 |
| 9 | asset-8 | `volvo-l90h-loader.jpg` | Volvo L90 Wheel Loader | Volvo L90H (2023) | 🚛 |

### Cranes (2)

| # | Asset ID | Filename | Equipment | Make / Model / Year | Current Emoji |
|---|---|---|---|---|---|
| 10 | asset-9 | `liebherr-ltm1060-crane.jpg` | Liebherr LTM 1060 Crane | Liebherr LTM 1060-3.1 (2020) | 🏗️ |
| 11 | asset-10 | `grove-gmk3060-crane.jpg` | Grove GMK3060 Crane | Grove GMK3060L (2021) | 🏗️ |

### Generators (2)

| # | Asset ID | Filename | Equipment | Make / Model / Year | Current Emoji |
|---|---|---|---|---|---|
| 12 | asset-11 | `cat-xq200-generator.jpg` | CAT XQ200 Generator | Caterpillar XQ200 (2022) | ⚡ |
| 13 | asset-12 | `generac-mdg150-generator.jpg` | Generac MDG150 Generator | Generac MDG150 (2023) | ⚡ |

### Dozers (2)

| # | Asset ID | Filename | Equipment | Make / Model / Year | Current Emoji |
|---|---|---|---|---|---|
| 14 | asset-13 | `cat-d6-dozer.jpg` | CAT D6 Dozer | Caterpillar D6 (2022) | 🚧 |
| 15 | asset-14 | `jd-700k-dozer.jpg` | John Deere 700K Dozer | John Deere 700K (2021) | 🚧 |

### Telehandler (1)

| # | Asset ID | Filename | Equipment | Make / Model / Year | Current Emoji |
|---|---|---|---|---|---|
| 16 | asset-15 | `jlg-1055-telehandler.jpg` | JLG 1055 Telehandler | JLG 1055 (2023) | 🏗️ |

### Compactor (1)

| # | Asset ID | Filename | Equipment | Make / Model / Year | Current Emoji |
|---|---|---|---|---|---|
| 17 | asset-16 | `cat-cs56b-compactor.jpg` | CAT CS56B Compactor | Caterpillar CS56B (2022) | 🚧 |

### Light Tower (1)

| # | Asset ID | Filename | Equipment | Make / Model / Year | Current Emoji |
|---|---|---|---|---|---|
| 18 | asset-17 | `wacker-ltn6l-lighttower.jpg` | Wacker LTN6L Light Tower | Wacker Neuson LTN6L (2023) | 💡 |

### Backhoe (1) — *ESD Spark Idea expansion*

| # | Asset ID | Filename | Equipment | Make / Model / Year |
|---|---|---|---|---|
| 19 | asset-18 | `cat-420-backhoe.jpg` | CAT 420 Backhoe | Caterpillar 420 (2022) |

### Boom Lift (1) — *ESD Spark Idea expansion*

| # | Asset ID | Filename | Equipment | Make / Model / Year |
|---|---|---|---|---|
| 20 | asset-19 | `jlg-600s-boomlift.jpg` | JLG 600S Boom Lift | JLG 600S (2023) |

### Reach Fork (1) — *ESD Spark Idea expansion*

| # | Asset ID | Filename | Equipment | Make / Model / Year |
|---|---|---|---|---|
| 21 | asset-20 | `cat-th357d-reachfork.jpg` | CAT TH357D Reach Fork | Caterpillar TH357D (2022) |

### Trench Plate (1) — *ESD Spark Idea expansion*

| # | Asset ID | Filename | Equipment | Make / Model / Year |
|---|---|---|---|---|
| 22 | asset-21 | `roadplate-trenchplate.jpg` | Steel Trench Plate 8'×16' | RoadPlate 8x16-1.0 (2021) |

### Camera (1) — *ESD Spark Idea expansion*

| # | Asset ID | Filename | Equipment | Make / Model / Year |
|---|---|---|---|---|
| 23 | asset-22 | `sensera-mc30-camera.jpg` | Sensera MC30 Site Camera | Sensera MC30 (2024) |

### Specialty Tool (1) — *ESD Spark Idea expansion*

| # | Asset ID | Filename | Equipment | Make / Model / Year |
|---|---|---|---|---|
| 24 | asset-23 | `hilti-te70-rotaryhammer.jpg` | Hilti TE 70-ATC Rotary Hammer | Hilti TE 70-ATC (2023) |

---

## Summary

| Category | Count |
|---|---|
| Branding (Sundt logo) | 1 |
| Excavators | 3 |
| Skid Steers | 3 |
| Loaders | 2 |
| Cranes | 2 |
| Generators | 2 |
| Dozers | 2 |
| Telehandler | 1 |
| Compactor | 1 |
| Light Tower | 1 |
| Backhoe | 1 |
| Boom Lift | 1 |
| Reach Fork | 1 |
| Trench Plate | 1 |
| Camera | 1 |
| Specialty Tool | 1 |
| **Total images needed** | **24** |

---

## Folder Structure After Images Are Added

```
public/
├── images/
│   ├── sundt-logo.png
│   └── equipment/
│       ├── cat-320-excavator.jpg
│       ├── cat-330-excavator.jpg
│       ├── jd-350g-excavator.jpg
│       ├── cat-259d-skidsteer.jpg
│       ├── jd-333g-skidsteer.jpg
│       ├── bobcat-t770-skidsteer.jpg
│       ├── cat-950m-loader.jpg
│       ├── volvo-l90h-loader.jpg
│       ├── liebherr-ltm1060-crane.jpg
│       ├── grove-gmk3060-crane.jpg
│       ├── cat-xq200-generator.jpg
│       ├── generac-mdg150-generator.jpg
│       ├── cat-d6-dozer.jpg
│       ├── jd-700k-dozer.jpg
│       ├── jlg-1055-telehandler.jpg
│       ├── cat-cs56b-compactor.jpg
│       └── wacker-ltn6l-lighttower.jpg
        ├── cat-420-backhoe.jpg
        ├── jlg-600s-boomlift.jpg
        ├── cat-th357d-reachfork.jpg
        ├── roadplate-trenchplate.jpg
        ├── sensera-mc30-camera.jpg
        └── hilti-te70-rotaryhammer.jpg
```

---

## Where to Find Stock Photos (for demo stage)

| Manufacturer | Product Image Page |
|---|---|
| Caterpillar | cat.com → Products → select model → Media Gallery |
| John Deere | deere.com → Equipment → select model → Photos & Videos |
| Bobcat | bobcat.com → Equipment → select model → Gallery |
| Liebherr | liebherr.com → Products → Mobile Cranes → select model |
| Grove | manitowoc.com → Grove → Products → select model |
| Volvo CE | volvoce.com → Products → select model → Gallery |
| JLG | jlg.com → Equipment → Telehandlers → select model |
| Generac | generac.com → Industrial Power → select model |
| Wacker Neuson | wackerneuson.com → Products → Light Towers → select model |
| Sensera | sensera.com → Products → Jobsite Cameras → select model |
| Hilti | hilti.com → Products → Drilling → Rotary Hammers → select model |
| RoadPlate (generic) | Generic steel trench plate photo — search "steel trench plate 8x16" |

> **Note:** For production use, actual photos of Sundt's fleet (with visible asset tags) are strongly preferred over manufacturer stock photos. Stock photos are acceptable for the hackathon demo only.

---

*Generated June 25, 2026 — companion to HAUL_MVP_Plan.md § 4.4 (P0: Real Equipment Photography)*