import { type FileRouter } from 'uploadthing/next'
import { generateReactHelpers } from '@uploadthing/react'

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<FileRouter>()
