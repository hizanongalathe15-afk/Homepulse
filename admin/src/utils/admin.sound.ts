'use client'

export type SoundType = 'click' | 'switch' | 'alert' | 'success' | 'notification' | 'thinking'

class SoundEngine {
  private ctx: AudioContext | null = null
  private muted = false

  private getContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  setMuted(value: boolean) {
    this.muted = value
  }

  isMuted() {
    return this.muted
  }

  play(type: SoundType) {
    if (this.muted) return
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime

      switch (type) {
        case 'click': {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(800, now)
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05)
          gain.gain.setValueAtTime(0.06, now)
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
          osc.connect(gain).connect(ctx.destination)
          osc.start(now)
          osc.stop(now + 0.08)
          break
        }
        case 'switch': {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'triangle'
          osc.frequency.setValueAtTime(600, now)
          osc.frequency.exponentialRampToValueAtTime(900, now + 0.06)
          gain.gain.setValueAtTime(0.05, now)
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
          osc.connect(gain).connect(ctx.destination)
          osc.start(now)
          osc.stop(now + 0.1)
          break
        }
        case 'alert': {
          const frequencies = [880, 1100, 880, 1100]
          frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = 'square'
            osc.frequency.setValueAtTime(freq, now + i * 0.08)
            gain.gain.setValueAtTime(0.04, now + i * 0.08)
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.06)
            osc.connect(gain).connect(ctx.destination)
            osc.start(now + i * 0.08)
            osc.stop(now + i * 0.08 + 0.06)
          })
          break
        }
        case 'success': {
          const notes = [523.25, 659.25, 783.99, 1046.5]
          notes.forEach((freq, i) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = 'sine'
            osc.frequency.setValueAtTime(freq, now + i * 0.08)
            gain.gain.setValueAtTime(0.05, now + i * 0.08)
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.12)
            osc.connect(gain).connect(ctx.destination)
            osc.start(now + i * 0.08)
            osc.stop(now + i * 0.08 + 0.12)
          })
          break
        }
        case 'notification': {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(1200, now)
          osc.frequency.setValueAtTime(1600, now + 0.1)
          gain.gain.setValueAtTime(0.04, now)
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
          osc.connect(gain).connect(ctx.destination)
          osc.start(now)
          osc.stop(now + 0.15)
          break
        }
        case 'thinking': {
          for (let i = 0; i < 3; i++) {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = 'sine'
            osc.frequency.setValueAtTime(440 + i * 40, now + i * 0.15)
            gain.gain.setValueAtTime(0.02, now + i * 0.15)
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.1)
            osc.connect(gain).connect(ctx.destination)
            osc.start(now + i * 0.15)
            osc.stop(now + i * 0.15 + 0.1)
          }
          break
        }
      }
    } catch {
      // Silently fail if AudioContext is unavailable
    }
  }
}

export const soundEngine = new SoundEngine()
