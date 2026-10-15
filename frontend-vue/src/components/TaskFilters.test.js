
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import TaskFilters from './TaskFilters.vue'

const defaultProps = {
  search: '',
  filter: 'all'
}

describe('TaskFilters Component', () => {

  it('arama alanını gösterir', () => {
    const wrapper = mount(TaskFilters, {
      props: defaultProps
    })

    const input = wrapper.find('input[type="search"]')

    expect(input.exists()).toBe(true)
    expect(input.attributes('aria-label'))
      .toBe('Görevlerde ara')
  })

  it('üç filtre butonunu gösterir', () => {
    const wrapper = mount(TaskFilters, {
      props: defaultProps
    })

    const buttons = wrapper.findAll('button')

    expect(buttons).toHaveLength(3)
    expect(buttons.map(button => button.text()))
      .toEqual(['Tümü', 'Bekleyen', 'Tamamlanan'])
  })

  it('başlangıç arama değerini gösterir', () => {
    const wrapper = mount(TaskFilters, {
      props: {
        search: 'Python',
        filter: 'all'
      }
    })

    expect(wrapper.find('input').element.value)
      .toBe('Python')
  })

  it('arama yapıldığında update:search olayı gönderir', async () => {
    const wrapper = mount(TaskFilters, {
      props: defaultProps
    })

    await wrapper.find('input').setValue('Vue')

    expect(wrapper.emitted('update:search'))
      .toEqual([['Vue']])
  })

  it('Bekleyen seçildiğinde pending değeri gönderir', async () => {
    const wrapper = mount(TaskFilters, {
      props: defaultProps
    })

    await wrapper.findAll('button')[1].trigger('click')

    expect(wrapper.emitted('update:filter'))
      .toEqual([['pending']])
  })

  it('Tamamlanan seçildiğinde completed değeri gönderir', async () => {
    const wrapper = mount(TaskFilters, {
      props: defaultProps
    })

    await wrapper.findAll('button')[2].trigger('click')

    expect(wrapper.emitted('update:filter'))
      .toEqual([['completed']])
  })

  it('aktif filtreyi görsel ve erişilebilirlik açısından işaretler', () => {
    const wrapper = mount(TaskFilters, {
      props: {
        search: '',
        filter: 'pending'
      }
    })

    const buttons = wrapper.findAll('button')

    expect(buttons[0].classes()).not.toContain('active')
    expect(buttons[1].classes()).toContain('active')
    expect(buttons[2].classes()).not.toContain('active')

    expect(buttons[1].attributes('aria-pressed'))
      .toBe('true')

    expect(buttons[0].attributes('aria-pressed'))
      .toBe('false')
  })

  it('props güncellendiğinde arayüzü günceller', async () => {
    const wrapper = mount(TaskFilters, {
      props: defaultProps
    })

    await wrapper.setProps({
      search: 'Yeni arama',
      filter: 'completed'
    })

    expect(wrapper.find('input').element.value)
      .toBe('Yeni arama')

    expect(wrapper.findAll('button')[2].classes())
      .toContain('active')

    expect(wrapper.findAll('button')[2].attributes('aria-pressed'))
      .toBe('true')
  })

})
