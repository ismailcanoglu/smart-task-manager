
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import TaskList from './TaskList.vue'

const sampleTasks = [
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

describe('TaskList Component', () => {

  it('boş görev listesinde bilgilendirme mesajı gösterir', () => {
    const wrapper = mount(TaskList, {
      props: { tasks: [] }
    })

    expect(wrapper.find('.empty').text())
      .toContain('Bu kriterlere uygun görev bulunamadı.')

    expect(wrapper.findAll('li')).toHaveLength(0)
  })

  it('bütün görevleri listeler', () => {
    const wrapper = mount(TaskList, {
      props: { tasks: sampleTasks }
    })

    const items = wrapper.findAll('li')

    expect(items).toHaveLength(2)
    expect(items[0].text()).toContain('Python testlerini yaz')
    expect(items[1].text()).toContain('Vue testlerini tamamla')
  })

  it('tamamlanan görevin checkbox değerini işaretli gösterir', () => {
    const wrapper = mount(TaskList, {
      props: { tasks: sampleTasks }
    })

    const checkboxes = wrapper.findAll('input[type="checkbox"]')

    expect(checkboxes[0].element.checked).toBe(false)
    expect(checkboxes[1].element.checked).toBe(true)
  })

  it('tamamlanan göreve completed sınıfı uygular', () => {
    const wrapper = mount(TaskList, {
      props: { tasks: sampleTasks }
    })

    const items = wrapper.findAll('li')

    expect(items[0].find('span').classes())
      .not.toContain('completed')

    expect(items[1].find('span').classes())
      .toContain('completed')
  })

  it('checkbox değiştiğinde toggle-task olayı gönderir', async () => {
    const wrapper = mount(TaskList, {
      props: { tasks: sampleTasks }
    })

    await wrapper.findAll('input[type="checkbox"]')[0]
      .trigger('change')

    expect(wrapper.emitted('toggle-task')).toEqual([
      [1]
    ])
  })

  it('sil butonuna basıldığında delete-task olayı gönderir', async () => {
    const wrapper = mount(TaskList, {
      props: { tasks: sampleTasks }
    })

    await wrapper.findAll('button')[1].trigger('click')

    expect(wrapper.emitted('delete-task')).toEqual([
      [2]
    ])
  })

  it('bekleyen görevin checkbox ve sil butonunu pasifleştirir', () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: sampleTasks,
        pendingIds: [1]
      }
    })

    const checkbox = wrapper.findAll('input')[0]
    const button = wrapper.findAll('button')[0]

    expect(checkbox.element.disabled).toBe(true)
    expect(button.element.disabled).toBe(true)
  })

  it('bekleyen görev için İşleniyor mesajı gösterir', () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: sampleTasks,
        pendingIds: [1]
      }
    })

    expect(wrapper.find('[role="status"]').text())
      .toBe('İşleniyor...')
  })

  it('yalnızca bekleyen görevi pasifleştirir', () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: sampleTasks,
        pendingIds: [1]
      }
    })

    const checkboxes = wrapper.findAll('input')
    const buttons = wrapper.findAll('button')

    expect(checkboxes[0].element.disabled).toBe(true)
    expect(buttons[0].element.disabled).toBe(true)

    expect(checkboxes[1].element.disabled).toBe(false)
    expect(buttons[1].element.disabled).toBe(false)
  })

})
