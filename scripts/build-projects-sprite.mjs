import sharp from "sharp";
import fs from "node:fs/promises";
// The exported atlas retains the original head pixels and palette.
// Every pose occupies a native 32px cell.
const input = await sharp("public/photography/pixel-photographer.png")
  .ensureAlpha()
  .raw()
  .toBuffer();
const palette = [
  [0, 0, 0, 0],
  [33, 30, 34, 255],
  [233, 177, 132, 255],
  [147, 163, 178, 255],
  [216, 146, 36, 255],
  [139, 54, 75, 255],
  [65, 67, 75, 255],
];
const frames = [];
function pose(kind) {
  const p = new Uint8Array(32 * 32 * 4);
  function dot(x, y, c) {
    if (x >= 0 && x < 32 && y >= 0 && y < 32)
      p.set(palette[c], (y * 32 + x) * 4);
  }
  function box(x, y, w, h, c) {
    for (let j = y; j < y + h; j++)
      for (let i = x; i < x + w; i++) dot(i, j, c);
  }
  function stroke(points, c, width = 2) {
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1],
        b = points[i],
        n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]));
      for (let j = 0; j <= n; j++)
        box(
          Math.round(a[0] + ((b[0] - a[0]) * j) / n),
          Math.round(a[1] + ((b[1] - a[1]) * j) / n),
          width,
          width,
          c,
        );
    }
  }
  const crouched = kind === "crouch" || kind === "land";
  const airborne = kind === "launch" || kind === "air";
  const shift =
    kind === "land"
      ? 2
      : crouched
        ? 3
        : airborne
          ? -2
          : kind === "shift"
            ? 1
            : 0;
  // Exact head pixels from the original frontal pose, excluding its camera.
  for (let y = 6; y <= 15; y++)
    for (let x = 11; x <= 20; x++) {
      const at = (y * 128 + 32 + x) * 4;
      if (input[at + 3] && !(input[at] === 147 && input[at + 1] === 163))
        p.set(input.subarray(at, at + 4), ((y + shift) * 32 + x) * 4);
    }
  if (kind === "blink") {
    for (const x of [14, 17]) dot(x, 12, 2);
  }
  const t = 16 + shift;
  box(13, t, 6, 7, 6);
  box(15, t, 2, 1, 2);
  box(15, t + 1, 2, 6, 5);
  box(13, t + 6, 6, 2, 1);
  if (crouched) {
    box(11, 25, 5, 2, 1);
    box(17, 25, 5, 2, 1);
    box(11, 26, 2, 2, 1);
    box(20, 26, 2, 2, 1);
    box(10, 27, 4, 1, 1);
    box(19, 27, 4, 1, 1);
  } else if (kind === "air") {
    box(11, 21, 5, 3, 1);
    box(17, 21, 5, 3, 1);
    box(12, 24, 4, 1, 1);
    box(18, 24, 4, 1, 1);
  } else if (kind === "launch") {
    stroke(
      [
        [13, 21],
        [11, 26],
      ],
      1,
    );
    stroke(
      [
        [17, 21],
        [19, 24],
      ],
      1,
    );
    box(10, 27, 4, 1, 1);
    box(18, 25, 4, 1, 1);
  } else {
    box(13, 23, 2, 4, 1);
    box(17, 23, 2, 4, 1);
    box(12, 27, 4, 1, 1);
    box(17, 27, 4, 1, 1);
  }
  if (kind === "lift") {
    stroke(
      [
        [12, 17],
        [8, 10],
        [14, 4],
      ],
      6,
    );
    box(14, 2, 2, 2, 2);
    stroke(
      [
        [19, 17],
        [24, 10],
        [18, 4],
      ],
      6,
    );
    box(18, 2, 2, 2, 2);
  } else if (kind === "strain") {
    stroke(
      [
        [12, 17],
        [7, 12],
        [14, 6],
      ],
      6,
    );
    box(14, 4, 2, 2, 2);
    stroke(
      [
        [19, 17],
        [25, 12],
        [19, 6],
      ],
      6,
    );
    box(19, 4, 2, 2, 2);
  } else if (kind === "reach") {
    stroke(
      [
        [12, 17],
        [17, 22],
        [21, 26],
      ],
      6,
    );
    box(22, 26, 2, 2, 2);
    stroke(
      [
        [19, 17],
        [23, 21],
        [26, 26],
      ],
      6,
    );
    box(27, 26, 2, 2, 2);
  } else if (kind === "place") {
    stroke(
      [
        [12, 17],
        [16, 21],
        [22, 23],
      ],
      6,
    );
    box(23, 23, 2, 2, 2);
    stroke(
      [
        [19, 17],
        [22, 20],
        [25, 22],
      ],
      6,
    );
    box(26, 22, 2, 2, 2);
  } else if (kind === "turn") {
    stroke(
      [
        [12, 17],
        [10, 22],
      ],
      6,
    );
    box(10, 23, 2, 2, 2);
    stroke(
      [
        [19, 17],
        [23, 22],
        [27, 26],
      ],
      6,
    );
    box(28, 26, 2, 2, 2);
  } else if (kind === "hold") {
    stroke(
      [
        [12, 17],
        [15, 20],
        [23, 20],
      ],
      6,
    );
    box(24, 19, 2, 2, 2);
    stroke(
      [
        [19, 17],
        [23, 16],
        [26, 18],
      ],
      6,
    );
    box(27, 18, 2, 2, 2);
  } else if (kind === "look") {
    stroke(
      [
        [12, 17],
        [11, 21],
      ],
      6,
    );
    box(11, 22, 2, 2, 2);
    stroke(
      [
        [19, 17],
        [23, 19],
      ],
      6,
    );
    box(24, 18, 2, 2, 2);
  } else if (kind === "wave") {
    stroke(
      [
        [19, 17],
        [21, 17],
        [23, 13],
      ],
      6,
    );
    box(23, 10, 2, 3, 2);
    stroke(
      [
        [12, 17],
        [11, 21],
      ],
      6,
    );
    box(11, 22, 2, 2, 2);
  } else if (kind === "present") {
    stroke(
      [
        [19, 17],
        [22, 19],
        [25, 17],
      ],
      6,
    );
    box(26, 16, 2, 2, 2);
    box(28, 16, 1, 1, 2);
    stroke(
      [
        [12, 17],
        [11, 21],
      ],
      6,
    );
    box(11, 22, 2, 2, 2);
  } else if (kind === "point_down") {
    stroke(
      [
        [19, 17],
        [23, 21],
        [26, 24],
      ],
      6,
    );
    box(27, 24, 2, 2, 2);
    box(29, 26, 1, 2, 2);
    stroke(
      [
        [12, 17],
        [11, 21],
      ],
      6,
    );
    box(11, 22, 2, 2, 2);
  } else if (kind === "point") {
    stroke(
      [
        [19, 17],
        [22, 15],
        [25, 12],
      ],
      6,
    );
    box(26, 10, 2, 2, 2);
    box(28, 9, 1, 2, 2);
    stroke(
      [
        [12, 17],
        [11, 21],
      ],
      6,
    );
    box(11, 22, 2, 2, 2);
  } else if (kind === "launch") {
    stroke(
      [
        [12, t + 1],
        [9, t - 2],
      ],
      6,
    );
    box(8, t - 4, 2, 2, 2);
    stroke(
      [
        [19, t + 1],
        [22, t - 2],
      ],
      6,
    );
    box(23, t - 4, 2, 2, 2);
  } else if (kind === "air") {
    stroke(
      [
        [12, t + 1],
        [8, t],
      ],
      6,
    );
    box(6, t - 1, 2, 2, 2);
    stroke(
      [
        [19, t + 1],
        [23, t],
      ],
      6,
    );
    box(25, t - 1, 2, 2, 2);
  } else if (kind === "land") {
    stroke(
      [
        [12, t + 1],
        [10, t + 4],
      ],
      6,
    );
    box(9, t + 6, 2, 2, 2);
    stroke(
      [
        [19, t + 1],
        [22, t + 4],
      ],
      6,
    );
    box(23, t + 6, 2, 2, 2);
  } else if (crouched) {
    stroke(
      [
        [12, t + 1],
        [11, t + 4],
        [14, t + 4],
      ],
      6,
    );
    box(14, t + 4, 2, 2, 2);
    stroke(
      [
        [19, t + 1],
        [21, t + 4],
      ],
      6,
    );
    box(21, t + 4, 2, 2, 2);
  } else {
    stroke(
      [
        [12, t + 1],
        [11, t + 5],
      ],
      6,
    );
    box(11, t + 6, 2, 2, 2);
    stroke(
      [
        [19, t + 1],
        [20, t + 5],
      ],
      6,
    );
    box(20, t + 6, 2, 2, 2);
  }
  if (["lift", "strain"].includes(kind))
    for (let y = 6; y <= 15; y++)
      for (let x = 11; x <= 20; x++) {
        const at = (y * 128 + 32 + x) * 4;
        if (input[at + 3] && !(input[at] === 147 && input[at + 1] === 163))
          p.set(input.subarray(at, at + 4), (y * 32 + x) * 4);
      }
  return Buffer.from(p);
}
const names = [
  "rest",
  "wave",
  "present",
  "crouch",
  "launch",
  "air",
  "land",
  "point",
  "blink",
  "shift",
  "look",
  "reach",
  "lift",
  "hold",
  "strain",
  "place",
  "turn",
  "point_down",
];
const directory = "public/assets/projects-v3";
await fs.mkdir(`${directory}/poses`, { recursive: true });
const metadata = { width: 32, height: 32, palette, frames: {} };
for (const [index, name] of names.entries()) {
  const pixels = pose(name);
  frames.push(pixels);
  for (let i = 0; i < pixels.length; i += 4) {
    if (!palette.some((c) => c.every((v, j) => v === pixels[i + j])))
      throw new Error(`Palette mismatch: ${name}`);
  }
  const hands =
    name === "lift"
      ? [
          [15, 4],
          [19, 4],
        ]
      : name === "strain"
        ? [
            [15, 6],
            [20, 6],
          ]
        : name === "reach"
          ? [
              [23, 28],
              [28, 28],
            ]
          : name === "place"
            ? [
                [24, 25],
                [27, 24],
              ]
            : name === "turn"
              ? [
                  [11, 25],
                  [29, 28],
                ]
              : name === "hold"
                ? [
                    [25, 20],
                    [28, 19],
                  ]
                : name === "present"
                  ? [
                      [12, 24],
                      [27, 18],
                    ]
                  : name === "point_down"
                    ? [
                        [12, 24],
                        [28, 26],
                      ]
                    : name === "point"
                      ? [
                          [12, 24],
                          [27, 12],
                        ]
                      : [
                          [12, 24],
                          [21, 24],
                        ];
  metadata.frames[name] = {
    index,
    feet: ["crouch", "land"].includes(name)
      ? [
          [12, 28],
          [21, 28],
        ]
      : name === "launch"
        ? [
            [12, 28],
            [20, 26],
          ]
        : name === "air"
          ? [
              [14, 25],
              [20, 25],
            ]
          : [
              [14, 28],
              [19, 28],
            ],
    hands,
    prop:
      name === "lift"
        ? [17, 4]
        : name === "strain"
          ? [17.5, 6]
          : name === "reach"
            ? [25.5, 28]
            : name === "place"
              ? [25.5, 24.5]
              : name === "turn"
                ? [29, 28]
                : [27, 20],
  };
  await sharp(pixels, { raw: { width: 32, height: 32, channels: 4 } })
    .png()
    .toFile(`${directory}/poses/${name}.png`);
}
const atlas = Buffer.alloc(names.length * 32 * 32 * 4);
frames.forEach((pixels, i) => {
  for (let y = 0; y < 32; y++)
    pixels.copy(
      atlas,
      (y * names.length * 32 + i * 32) * 4,
      y * 32 * 4,
      (y + 1) * 32 * 4,
    );
});
await sharp(atlas, {
  raw: { width: names.length * 32, height: 32, channels: 4 },
})
  .png()
  .toFile(`${directory}/will-host.png`);
await fs.writeFile(
  `${directory}/will-frames.json`,
  JSON.stringify(metadata, null, 2),
);
await fs.writeFile(
  "src/data/projects-will-frames.json",
  JSON.stringify(metadata, null, 2),
);
await fs.mkdir("artifacts/projects-review", { recursive: true });
await sharp(atlas, {
  raw: { width: names.length * 32, height: 32, channels: 4 },
})
  .resize(names.length * 192, 192, { kernel: "nearest" })
  .png()
  .toFile("artifacts/projects-review/native-host-atlas.png");
console.log(`${names.length} native 32 × 32 frames validated and exported.`);
