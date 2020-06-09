<template>
  <section id="uploadWrapper">
    <h1 class="heading">
      <span>Upload <sup>Beta</sup></span>
      <btn-group uppercased>
        <btn v-show="failedUploadsAvailable" @click="retryAll" green>
          <i class="fa fa-repeat"></i>
          Retry All
        </btn>
        <btn v-show="failedUploadsAvailable" @click="removeFailedEntries" orange>
          <i class="fa fa-times"></i>
          Remove Failed
        </btn>
      </btn-group>
    </h1>

    <div class="main-scroll-wrap">
      <div class="upload-panel"
        @dragenter.prevent="onDragEnter"
        @dragleave.prevent="onDragLeave"
        @drop.stop.prevent="onDrop"
        @dragover.prevent
        :class="{ droppable }"
        v-if="mediaPath"
      >
        <div class="upload-files" v-if="uploadState.files.length">
          <upload-item v-for="file in uploadState.files" :key="file.id" :file="file"/>
        </div>

        <div class="instruction" v-else>
          <div>
            <i class="fa fa-upload"></i>
            <p>{{ instructionText }}</p>
          </div>
        </div>
      </div>

      <p class="none" v-else>No media path set.</p>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import ismobile from 'ismobilejs'
import { settingStore, userStore } from '@/stores'
import { getAllFileEntries, eventBus, isDirectoryReadingSupported } from '@/utils'
import { UploadFile, validMediaMimeTypes, events } from '@/config'
import md5 from 'blueimp-md5'
import { upload } from '@/services'
import UploadItem from '@/components/ui/upload/upload-item.vue'
import BtnGroup from '@/components/ui/btn-group.vue'
import Btn from '@/components/ui/btn.vue'

export default Vue.extend({
  components: { UploadItem, BtnGroup, Btn },

  data: () => ({
    settingsState: settingStore.state,
    droppable: false,
    userState: userStore.state,
    uploadState: upload.state,
    failedUploadsAvailable: false
  }),

  computed: {
    mediaPath (): string | undefined {
      return this.settingsState.settings.media_path
    },

    allowsUpload (): boolean {
      return this.userState.current.is_admin && !ismobile.any
    },

    instructionText (): string {
      return isDirectoryReadingSupported
        ? 'Drop files or folders to upload'
        : 'Drop files to upload'
    }
  },

  methods: {
    onDragEnter (): void {
      this.droppable = this.allowsUpload
    },

    onDragLeave (): void {
      this.droppable = false
    },

    async onDrop (e: DragEvent): Promise<void> {
      this.droppable = false

      if (!e.dataTransfer) {
        return
      }

      const fileEntries = await getAllFileEntries(e.dataTransfer.items)
      const files = await Promise.all(fileEntries.map(async entry => await this.fileEntryToFile(entry)))

      const uploadCandidates = files
        .filter(file => validMediaMimeTypes.includes(file.type))
        .map((file: File): UploadFile => ({
          file,
          id: md5(`${file.name}-${file.size}`), // for simplicity, a file's identity is determined by its name and size
          status: 'Ready',
          name: file.name,
          progress: 0
        }))

      upload.queue(uploadCandidates)
    },

    fileEntryToFile: async (entry: FileSystemEntry): Promise<File> => new Promise(resolve => {
      entry.file((file: File) => resolve(file))
    }),

    retryAll (): void {
      upload.retryAll()
      this.failedUploadsAvailable = false
    },

    removeFailedEntries (): void {
      upload.removeFailed()
      this.failedUploadsAvailable = false
    }
  },

  created (): void {
    eventBus.on(events.UPLOAD_QUEUE_FINISHED, (): void => {
      this.failedUploadsAvailable = upload.getFilesByStatus('Errored').length !== 0
    })
  }
})
</script>

<style lang="scss">
@import "~#/partials/_vars.scss";

#uploadWrapper {
  sup {
    vertical-align: super;
    font-size: .4em;
    text-transform: uppercase;
    opacity: .5;
  }

  .upload-panel {
    position: relative;
    height: 100%;
  }

  .upload-files {
    padding-bottom: 16px;
  }

  .instruction {
    i {
      display: block;
      font-size: 6em;
      margin-bottom: 1.5rem;
      opacity: .8;
    }

    p {
      font-size: 2em;
      font-weight: 200;
    }

    display: flex;
    pointer-events: none;
    place-content: center;
    place-items: center;
    height: 100%;
    text-align: center;
    opacity: .2;
  }

  .instruction {
    user-select: none;
  }
}
</style>
