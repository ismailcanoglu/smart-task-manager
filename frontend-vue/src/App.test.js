
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

import App from './App.vue'
import { taskApi } from './services/taskApi'

vi.mock('./services/taskApi', () => ({
  taskApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    toggle: vi.fn(),
    remove: vi.fn()
  }
}))

const initialTasks = [
  {
    id: 1,
    title: 'Python testlerini yaz',
    completed: false
  },
  {
    id: 2,
    title: 'Vue testlerini tamamla',
    completed: true
  }
]

async function mountApp() {
  const wrapper = mount(App)
  await flushPromises()
  return wrapper
}

function stats(wrapper) {
  return wrapper.findAll('.stat-card strong')
    .map(item => item.text())
}

describe('App.vue Integration Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    taskApi.getAll.mockResolvedValue(
      initialTasks.map(task => ({ ...task }))
    )
  })

  it('Dashboard açıldığında görevleri yükler', async () => {
    const wrapper = await mountApp()

    expect(taskApi.getAll).toHaveBeenCalledOnce()
    expect(wrapper.findAll('.task-list li')).toHaveLength(2)
    expect(wrapper.text()).toContain('Python testlerini yaz')
    expect(wrapper.text()).toContain('Vue testlerini tamamla')
  })

  it('başlangıç istatistiklerini doğru hesaplar', async () => {
    const wrapper = await mountApp()

    // Toplam, tamamlanan, bekleyen, başarı oranı
    expect(stats(wrapper)).toEqual(['2', '1', '1', '50'])
  })

  it('yeni görev ekleyince listeyi ve istatistikleri günceller', async () => {
    taskApi.create.mockResolvedValue({
      id: 3,
      title: 'Yeni görev oluştur',
      completed: false
    })

    const wrapper = await mountApp()

    await wrapper.find('.task-form input')
      .setValue('Yeni görev oluştur')

      await wrapper.find('form.task-form').trigger('submit')
      await flushPromises()

    expect(taskApi.create)
      .toHaveBeenCalledWith('Yeni görev oluştur')

    expect(wrapper.findAll('.task-list li')).toHaveLength(3)
    expect(stats(wrapper)).toEqual(['3', '1', '2', '33'])
    expect(wrapper.find('.task-form input').element.value).toBe('')
  })

  it('görev tamamlanınca istatistikleri günceller', async () => {
    taskApi.toggle.mockResolvedValue({
      id: 1,
      title: 'Python testlerini yaz',
      completed: true
    })

    const wrapper = await mountApp()

    await wrapper.findAll('.task-list input[type="checkbox"]')[0]
      .trigger('change')

    await flushPromises()

    expect(taskApi.toggle).toHaveBeenCalledWith(1)
    expect(stats(wrapper)).toEqual(['2', '2', '0', '100'])
  })

  it('görev silinince listeyi ve istatistikleri günceller', async () => {
    taskApi.remove.mockResolvedValue(null)

    const wrapper = await mountApp()

    await wrapper.findAll('.task-list button')[0]
      .trigger('click')

    await flushPromises()

    expect(taskApi.remove).toHaveBeenCalledWith(1)
    expect(wrapper.findAll('.task-list li')).toHaveLength(1)
    expect(stats(wrapper)).toEqual(['1', '1', '0', '100'])
  })

  it('arama yapıldığında yalnızca eşleşen görevleri gösterir', async () => {
    const wrapper = await mountApp()

    await wrapper.find('.filters input')
      .setValue('Python')

    expect(wrapper.findAll('.task-list li')).toHaveLength(1)
    expect(wrapper.find('.task-list').text())
      .toContain('Python testlerini yaz')
  })

  it('tamamlanan görev filtresini uygular', async () => {
    const wrapper = await mountApp()

    await wrapper.findAll('.filter-buttons button')[2]
      .trigger('click')

    expect(wrapper.findAll('.task-list li')).toHaveLength(1)
    expect(wrapper.find('.task-list').text())
      .toContain('Vue testlerini tamamla')
  })

  it('görevler yüklenemezse hata mesajı gösterir', async () => {
    taskApi.getAll.mockRejectedValue(
      new Error('Sunucuya ulaşılamıyor')
    )

    const wrapper = await mountApp()

    expect(wrapper.find('[role="alert"]').text())
      .toContain('Görevler yüklenemedi')

    expect(wrapper.find('.error button').exists()).toBe(true)
  })

  
it('görev ekleme hatasında mesaj gösterir ve başlığı korur', async () => {
  taskApi.create.mockRejectedValue(
    new Error('Bağlantı hatası')
  )

  const wrapper = await mountApp()

  await wrapper.find('.task-form input')
    .setValue('Yeni görev oluştur')

  await wrapper.find('form.task-form')
    .trigger('submit')

  await flushPromises()

  expect(wrapper.find('[role="alert"]').text())
    .toContain('Görev eklenemedi: Bağlantı hatası')

  expect(wrapper.find('.task-form input').element.value)
    .toBe('Yeni görev oluştur')

  expect(wrapper.findAll('.task-list li')).toHaveLength(2)
})

it('görev silme hatasında görevi listede tutar', async () => {
  taskApi.remove.mockRejectedValue(
    new Error('Silme başarısız')
  )

  const wrapper = await mountApp()

  await wrapper.findAll('.task-list button')[0]
    .trigger('click')

  await flushPromises()

  expect(wrapper.find('[role="alert"]').text())
    .toContain('Görev silinemedi: Silme başarısız')

  expect(wrapper.findAll('.task-list li')).toHaveLength(2)
})

it('görev güncelleme hatasında eski durumu korur', async () => {
  taskApi.toggle.mockRejectedValue(
    new Error('Güncelleme başarısız')
  )

  const wrapper = await mountApp()

  await wrapper.findAll('.task-list input[type="checkbox"]')[0]
    .trigger('change')

  await flushPromises()

  expect(wrapper.find('[role="alert"]').text())
    .toContain('Görev güncellenemedi: Güncelleme başarısız')

  expect(stats(wrapper)).toEqual(['2', '1', '1', '50'])
})


it('yükleme hatasından sonra tekrar deneyince görevleri getirir', async () => {
  taskApi.getAll
    .mockRejectedValueOnce(new Error('Bağlantı kesildi'))
    .mockResolvedValueOnce(
      initialTasks.map(task => ({ ...task }))
    )

  const wrapper = await mountApp()

  expect(wrapper.find('[role="alert"]').text())
    .toContain('Görevler yüklenemedi')

  await wrapper.find('.error button').trigger('click')
  await flushPromises()

  expect(taskApi.getAll).toHaveBeenCalledTimes(2)
  expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  expect(wrapper.findAll('.task-list li')).toHaveLength(2)
})

})
