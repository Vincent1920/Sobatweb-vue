import { defineStore } from 'pinia'
import { mockSchool, mockWebsite } from '@/data/mock/school.mock'

export const useWebsiteStore = defineStore('website', () => {
  return { school: mockSchool, website: mockWebsite }
})
