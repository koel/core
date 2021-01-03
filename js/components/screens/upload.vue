<template>
  <section id="uploadWrapper">
    <screen-header>
      Upload Media <sup>Beta</sup>

      <template v-slot:controls>
        <btn-group uppercased v-if="hasUploadFailures">
          <btn @click="retryAll" green data-testid="upload-retry-all-btn">
            <i class="fa fa-repeat"></i>
            Retry All
          </btn>
          <btn @click="removeFailedEntries" orange data-testid="upload-remove-all-btn">
            <i class="fa fa-times"></i>
            Remove Failed
          </btn>
        </btn-group>
      </template>
    </screen-header>

    <div class="main-scroll-wrap">
      <div
        class="upload-panel"
        @dragenter.prevent="onDragEnter"
        @dragleave.prevent="onDragLeave"
        @drop.stop.prevent="onDrop"
        @dragover.prevent
        :class="{ droppable }"
        v-if="mediaPath"
      >
        <div class="upload-files" v-if="uploadState.files.length">
          <upload-item v-for="file in uploadState.files" :key="file.id" :file="file" data-test="upload-item"/>
        </div>

        <div class="instruction" v-else @change="onFileInputChange">
          <div>
            <i class="fa fa-upload"></i>
            <p>
              {{ instructionText }}<br/>
              <a class="or-click" role="button">
                or click here to select songs
                <input type="file" name="file[]" multiple/>
              </a>
            </p>
          </div>
        </div>
      </div>

      <p class="text-light-gray" v-else>No media path set.</p>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import ismobile from 'ismobilejs'
import md5 from 'blueimp-md5'

import { settingStore, userStore } from '@/stores'
import { getAllFileEntries, eventBus, isDirectoryReadingSupported } from '@/utils'
import { UploadFile, validMediaMimeTypes, events } from '@/config'
import { upload } from '@/services'

import UploadItem from '@/components/ui/upload/upload-item.vue'
import BtnGroup from '@/components/ui/btn-group.vue'
import Btn from '@/components/ui/btn.vue'

export default Vue.extend({
  components: {
    ScreenHeader: () => import('@/components/ui/screen-header.vue'),
    UploadItem,
    BtnGroup,
    Btn
  },

  data: () => ({
    settingsState: settingStore.state,
    droppable: false,
    userState: userStore.state,
    uploadState: upload.state,
    hasUploadFailures: false
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

    onFileInputChange (event: InputEvent): void {
      const selectedFileList = (event.target as HTMLInputElement).files

      if (!selectedFileList) {
        return
      }

      this.handleFiles(Array.from(selectedFileList))
    },

    async onDrop (e: DragEvent): Promise<void> {
      this.droppable = false

      if (!e.dataTransfer) {
        return
      }

      const fileEntries = await getAllFileEntries(e.dataTransfer.items)
      const files = await Promise.all(fileEntries.map(async entry => await this.fileEntryToFile(entry)))
      this.handleFiles(files)
    },

    handleFiles: (files: Array<File>) => {
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
      this.hasUploadFailures = false
    },

    removeFailedEntries (): void {
      upload.removeFailed()
      this.hasUploadFailures = false
    }
  },

  created (): void {
    eventBus.on(events.UPLOAD_QUEUE_FINISHED, (): void => {
      this.hasUploadFailures = upload.getFilesByStatus('Errored').length !== 0
    })
  }
})
</script>

<style lang="scss">
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
    padding-bottom: 1rem;
  }

  .instruction {
    display: flex;
    place-content: center;
    place-items: center;
    height: 100%;
    width: 100%;
    text-align: center;
    color: rgba(255, 255, 255, .2);
    position: relative;

    input[type=file] {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      cursor: pointer;
    }

    i {
      display: block;
      font-size: 6em;
      margin-bottom: 1.5rem;
      opacity: .8;
    }

    p {
      font-size: 2em;
      font-weight: 200;

      a.or-click {
        font-size: 1.5rem;
        display: block;
        margin-top: .75rem;
        position: relative;

        &:hover {
          color: rgba(255, 255, 255, .7);
        }
      }
    }
  }

  .instruction {
    user-select: none;
  }
}
</style>
