// Generates the default Open Graph / Twitter card image (1200x630) from the REAL photo of
// Xclusive Barber Coburg already shipped in the repo. Re-run after changing the source photo:
//   node scripts/generate-og-image.mjs
import sharp from 'sharp'

const SOURCE = 'public/assets/landing/barbershop-hero.jpg' // 4284x5712 portrait
const OUTPUT = 'public/og/xclusive-barber-academy.jpg'
const WIDTH = 1200
const HEIGHT = 630

const meta = await sharp(SOURCE).metadata()
// Full-width crop with the 1200:630 ratio, centred on the hexagon ceiling lights + the chairs.
const cropHeight = Math.round((meta.width * HEIGHT) / WIDTH)
const top = Math.round(meta.height * 0.3)

await sharp(SOURCE)
  .extract({ left: 0, top, width: meta.width, height: cropHeight })
  .resize(WIDTH, HEIGHT)
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(OUTPUT)

console.log(`wrote ${OUTPUT} (${WIDTH}x${HEIGHT}) from ${SOURCE}`)
