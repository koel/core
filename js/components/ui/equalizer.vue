<template>
  <div id="equalizer">
    <div class="presets">
      <label class="select-wrapper">
        <select v-model="selectedPresetIndex">
          <option v-for="p in presets" :value="p.id" :key="p.id" v-once>{{ p.name }}</option>
        </select>
      </label>
    </div>
    <div class="bands">
      <span class="band preamp">
        <span class="slider"></span>
        <label>Preamp</label>
      </span>

      <span class="indicators">
        <span>+20</span>
        <span>0</span>
        <span>-20</span>
      </span>

      <span class="band amp" v-for="band in bands" :key="band.label">
        <span class="slider"></span>
        <label>{{ band.label }}</label>
      </span>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import nouislider from 'nouislider'

import { event, $ } from '@/utils'
import { equalizerStore, preferenceStore as preferences } from '@/stores'
import { audio as audioService } from '@/services'

let context

export default {
  data: () => ({
    bands: [],
    preampGainValue: 0,
    selectedPresetIndex: -1
  }),

  computed: {
    presets () {
      const clonedPreset = cloneDeep(equalizerStore.presets)
      // Prepend an empty option for instruction purpose.
      clonedPreset.unshift({
        id: -1,
        name: 'Preset'
      })
      return clonedPreset
    }
  },

  watch: {
    selectedPresetIndex (val) {
      // Save the selected preset (index) every time the value's changed.
      preferences.selectedPreset = val

      if (~~val !== -1) {
        this.loadPreset(equalizerStore.getPresetById(val))
      }
    }
  },

  methods: {
    init () {
      const settings = equalizerStore.get()

      context = audioService.getContext()
      this.preampGainNode = context.createGain()
      this.changePreampGain(settings.preamp)

      const source = audioService.getSource()
      source.connect(this.preampGainNode)

      let prevFilter = null

      // Create 10 bands with the frequencies similar to those of Winamp and connect them together.
      const frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000]
      frequencies.forEach((frequency, i) => {
        const filter = context.createBiquadFilter()

        if (i === 0) {
          filter.type = 'lowshelf'
        } else if (i === 9) {
          filter.type = 'highshelf'
        } else {
          filter.type = 'peaking'
        }

        filter.gain.setTargetAtTime(settings[i] || 0, context.currentTime, 0.01)
        filter.Q.setTargetAtTime(1, context.currentTime, 0.01)
        filter.frequency.setTargetAtTime(frequency, context.currentTime, 0.01)

        prevFilter ? prevFilter.connect(filter) : this.preampGainNode.connect(filter)
        prevFilter = filter

        this.bands.push({
          filter,
          label: (frequency + '').replace('000', 'K')
        })
      })

      prevFilter.connect(context.destination)

      this.$nextTick(this.createSliders)

      document.audioSource = source
      document.audioContext = context
    },

    createSliders () {
      const config = equalizerStore.get()
      Array.from(document.querySelectorAll('#equalizer .slider')).forEach((el, i) => {
        nouislider.create(el, {
          connect: [false, true],
          // the first element is the preamp. The rest are gains.
          start: i === 0 ? config.preamp : config.gains[i - 1],
          range: { min: -20, max: 20 },
          orientation: 'vertical',
          direction: 'rtl'
        })

        el.noUiSlider.on('slide', (values, handle) => {
          const value = values[handle]
          if (el.parentNode.matches('.preamp')) {
            this.changePreampGain(value)
          } else {
            this.changeFilterGain(this.bands[i - 1].filter, value)
          }
        })

        el.noUiSlider.on('change', () => {
          // User has customized the equalizer. No preset should be selected.
          this.selectedPresetIndex = -1
          this.save()
        })
      })

      // Now we set this value to trigger the audio processing.
      this.selectedPresetIndex = preferences.selectedPreset
    },

    changePreampGain (dbValue) {
      this.preampGainValue = dbValue
      this.preampGainNode.gain.setTargetAtTime(Math.pow(10, dbValue / 20), context.currentTime, 0.01)
    },

    changeFilterGain: (filter, value) => filter.gain.setTargetAtTime(value, context.currentTime, 0.01),

    loadPreset (preset) {
      Array.from(document.querySelectorAll('#equalizer .slider')).forEach((el, i) => {
        // We treat our preamp slider differently.
        if ($.is(el.parentNode, '.preamp')) {
          this.changePreampGain(preset.preamp)
          // Update the slider values into GUI.
          el.noUiSlider.set(preset.preamp)
        } else {
          this.changeFilterGain(this.bands[i - 1].filter, preset.gains[i - 1])
          // Update the slider values into GUI.
          el.noUiSlider.set(preset.gains[i - 1])
        }
      })

      this.save()
    },

    save () {
      equalizerStore.set(this.preampGainValue, this.bands.map(band => band.filter.gain.value))
    }
  },

  mounted () {
    event.on(event.$names.INIT_EQUALIZER, () => this.init())
  }
}
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";

#equalizer {
  user-select: none;
  position: absolute;
  bottom: $footerHeight;
  width: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  left: 0;

  label {
    margin-top: 8px;
    margin-bottom: 0;
    text-align: left;
  }

  .presets {
    padding: 8px 16px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex: 1;
    align-content: center;
    z-index: 1;
    border-bottom: 1px solid rgba(255, 255, 255, .1);


    .select-wrapper {
      position: relative;
      margin-bottom: 0;

      &::after {
        content: '\f107';
        font-family: FontAwesome;
        color: $colorHighlight;
        display: inline-block;
        position: absolute;
        right: 8px;
        top: 6px;
        pointer-events: none;
      }
    }

    select {
      background: none;
      color: $colorMainText;
      padding-left: 0;
      width: 100px;
      text-transform: none;

      option {
        color: #333;
      }
    }
  }

  .bands {
    padding: 16px;
    z-index: 1;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    label, .indicators {
      font-size: .8rem;
    }

    .band {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .slider {
      height: 100px;
    }

    .indicators {
      height: 100px;
      width: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      margin-left: -16px;
      opacity: 0;
      transition: .4s;

      span:first-child {
        line-height: 8px;
      }

      span:last-child {
        line-height: 8px;
      }
    }

    &:hover .indicators {
      opacity: 1;
    }
  }

  .noUi {
    &-connect {
      background: none;
      box-shadow: none;
      &::after {
        content: " ";
        position: absolute;
        width: 2px;
        height: 100%;
        background: #333;
        top: 0;
        left: 7px;
      }
    }

    &-target {
      background: transparent;
      border-radius: 0;
      border: 0;
      box-shadow: none;
      width: 16px;

      &::after {
        content: " ";
        position: absolute;
        width: 2px;
        height: 100%;
        background: linear-gradient(to bottom, #d13838 0%,#f74245 36%,#529929 100%);
        background-size: 2px;
        top: 0;
        left: 7px;
      }
    }

    &-handle {
      border: 0;
      border-radius: 0;
      box-shadow: none;
      cursor: pointer;

      &::before, &::after {
        display: none;
      }
    }

    &-vertical {
      .noUi-handle {
        width: 16px;
        height: 2px;
        left: 0;
        top: 0;
      }
    }
  }

  @media only screen and (max-width : 768px) {
    position: fixed;
    max-width: 414px;
    left: auto;
    right: 0;
    bottom: $footerHeightMobile + 14px;
    display: block;
    height: auto;

    label {
      line-height: 20px;
    }
  }
}
</style>
