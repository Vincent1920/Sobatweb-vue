import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const [{ createPinia, setActivePinia }, { useSectionStore }, { sectionService }] = await Promise.all([
    server.ssrLoadModule('pinia'),
    server.ssrLoadModule('/src/stores/section.store.ts'),
    server.ssrLoadModule('/src/services/section.service.ts'),
  ])
  setActivePinia(createPinia())
  const store = useSectionStore()
  const section = { id: 'section-1', pageId: 'page-1', type: 'about', title: 'Awal', subtitle: null, content: {}, settings: { bgStyle: 'white', paddingY: 'md', alignment: 'left' }, hidden: false, sortOrder: 1 }
  store.items.push(section)
  store.sectionStatuses[section.id] = 'idle'

  const success = async (_id, payload) => ({ data: { success: true, message: 'ok', data: { section: { ...section, ...payload, updatedAt: new Date().toISOString() } } } })
  sectionService.update = success
  store.updateSectionLocal(section.id, { title: 'Tersimpan nyata' })
  if (store.saveStatus !== 'dirty') throw new Error('Edit harus mengubah status menjadi dirty')
  await store.flushPendingSaves()
  if (store.saveStatus !== 'saved') throw new Error('Respons API sukses harus menghasilkan saved')

  sectionService.update = async () => { throw new Error('Backend mati') }
  store.updateSectionLocal(section.id, { title: 'Draft saat offline' })
  try { await store.flushPendingSaves() } catch { /* expected */ }
  if (store.saveStatus !== 'error') throw new Error('Request gagal harus menghasilkan error')
  if (store.items[0]?.title !== 'Draft saat offline') throw new Error('Draft lokal tidak boleh di-rollback')

  sectionService.update = success
  await store.retryFailed()
  if (store.saveStatus !== 'saved') throw new Error('Retry sukses harus menghasilkan saved')
  console.log('PASS: success → saved, failure → error, local draft retained, retry → saved')
} finally {
  await server.close()
}
