/* eslint no-undef: 0 */
import Sketch from 'sketch-js'
import { audio as audioService } from '@/services'

// Audio visualization originally created by Justin Windle (@soulwire)
// as seen on https://codepen.io/soulwire/pen/Dscga

const NUM_PARTICLES = 128
const NUM_BANDS = 128
const SMOOTHING = 0.5
const SCALE = { MIN: 5.0, MAX: 80.0 }
const SPEED = { MIN: 0.2, MAX: 1.0 }
const ALPHA = { MIN: 0.8, MAX: 0.9 }
const SPIN = { MIN: 0.001, MAX: 0.005 }
const SIZE = { MIN: 0.5, MAX: 1.25 }
const COLORS = [
  '#69D2E7',
  '#1B676B',
  '#BEF202',
  '#EBE54D',
  '#00CDAC',
  '#1693A5',
  '#F9D423',
  '#FF4E50',
  '#E7204E',
  '#0CCABA',
  '#FF006F'
]

class AudioAnalyser {
  constructor (numBands = 256, smoothing = 0.3) {
    this.numBands = numBands
    this.smoothing = smoothing

    this.audio = audioService.getElement()
    this.context = audioService.getContext()
    this.source = audioService.getSource()
    this.jsNode = this.context.createScriptProcessor(2048, 1, 1)

    this.analyser = this.context.createAnalyser()
    this.analyser.smoothingTimeConstant = this.smoothing
    this.analyser.fftSize = this.numBands * 2

    this.bands = new Uint8Array(this.analyser.frequencyBinCount)

    this.audio.addEventListener('canplay', () => {
      this.source.connect(this.analyser)
      this.analyser.connect(this.jsNode)

      this.jsNode.connect(this.context.destination)
      this.source.connect(this.context.destination)

      const ret = this.jsNode.onaudioprocess = () => {
        this.analyser.getByteFrequencyData(this.bands)

        if (!this.audio.paused) {
          return (typeof this.onUpdate === 'function' ? this.onUpdate(this.bands) : undefined)
        }
      }

      return ret
    })
  }
}

class Particle {
  constructor (x = 0, y = 0) {
    this.x = x
    this.y = y
    this.reset()
  }

  reset () {
    this.level = 1 + floor(random(4))
    this.scale = random(SCALE.MIN, SCALE.MAX)
    this.alpha = random(ALPHA.MIN, ALPHA.MAX)
    this.speed = random(SPEED.MIN, SPEED.MAX)
    this.color = random(COLORS)
    this.size = random(SIZE.MIN, SIZE.MAX)
    this.spin = random(SPIN.MAX, SPIN.MAX)
    this.band = floor(random(NUM_BANDS))

    if (random() < 0.5) {
      this.spin = -this.spin
    }

    this.smoothedScale = 0.0
    this.smoothedAlpha = 0.0
    this.decayScale = 0.0
    this.decayAlpha = 0.0
    this.rotation = random(TWO_PI)
    this.energy = 0.0

    return this.energy
  }

  move () {
    this.rotation += this.spin
    this.y -= this.speed * this.level

    return this.y
  }

  draw (ctx) {
    const power = exp(this.energy)
    const scale = this.scale * power
    const alpha = this.alpha * this.energy * 2

    this.decayScale = max(this.decayScale, scale)
    this.decayAlpha = max(this.decayAlpha, alpha)

    this.smoothedScale += (this.decayScale - this.smoothedScale) * 0.3
    this.smoothedAlpha += (this.decayAlpha - this.smoothedAlpha) * 0.3

    this.decayScale *= 0.985
    this.decayAlpha *= 0.975

    ctx.save()
    ctx.beginPath()
    ctx.translate(this.x + (cos(this.rotation * this.speed) * 250), this.y)
    ctx.rotate(this.rotation)
    ctx.scale(this.smoothedScale * this.level, this.smoothedScale * this.level)
    ctx.moveTo(this.size * 0.5, 0)
    ctx.lineTo(this.size * -0.5, 0)
    ctx.lineWidth = 1
    ctx.lineCap = 'round'
    ctx.globalAlpha = this.smoothedAlpha / this.level
    ctx.strokeStyle = this.color
    ctx.stroke()

    return ctx.restore()
  }
}

export default function (container) {
  Sketch.create({
    container,
    particles: [],
    setup () {
      // generate some particles
      let particle
      for (let i = 0, end = NUM_PARTICLES - 1; i <= end; i++) {
        const x = random(this.width)
        const y = random(this.height)

        particle = new Particle(x, y)
        particle.energy = random(particle.band / 256)

        this.particles.push(particle)
      }

      // setup the audio analyser
      const analyser = new AudioAnalyser(NUM_BANDS, SMOOTHING)

      // update particles based on fft transformed audio frequencies
      analyser.onUpdate = bands => {
        return (() => {
          const result = []
          for (particle of Array.from(this.particles)) {
            result.push(particle.energy = bands[particle.band] / 256)
          }
          return result
        })()
      }
    },

    draw () {
      this.globalCompositeOperation = 'lighter'

      return (() => {
        const result = []
        for (const particle of Array.from(this.particles)) {
          if (particle.y < (-particle.size * particle.level * particle.scale * 2)) {
            particle.reset()
            particle.x = random(this.width)
            particle.y = this.height + (particle.size * particle.scale * particle.level * 2)
          }

          particle.move()
          result.push(particle.draw(this))
        }
        return result
      })()
    }
  })
}
