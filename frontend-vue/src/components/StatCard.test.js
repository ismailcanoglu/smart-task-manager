
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import StatCard from './StatCard.vue'

describe('StatCard Component', () => {

  it('stat-card bileşenini oluşturur', () => {
    const wrapper = mount(StatCard, {
      props: {
        title: 'Toplam Görev',
        value: 10
      }
    })

    expect(wrapper.find('article.stat-card').exists())
      .toBe(true)
  })

  it('başlığı doğru gösterir', () => {
    const wrapper = mount(StatCard, {
      props: {
        title: 'Tamamlanan',
        value: 5
      }
    })

    expect(wrapper.find('h3').text())
      .toBe('Tamamlanan')
  })

  it('sayısal değeri doğru gösterir', () => {
    const wrapper = mount(StatCard, {
      props: {
        title: 'Bekleyen',
        value: 7
      }
    })

    expect(wrapper.find('strong').text())
      .toBe('7')
  })

  it('sıfır değerini doğru gösterir', () => {
    const wrapper = mount(StatCard, {
      props: {
        title: 'Tamamlanan',
        value: 0
      }
    })

    expect(wrapper.find('strong').text())
      .toBe('0')
  })

  it('props güncellendiğinde arayüzü günceller', async () => {
    const wrapper = mount(StatCard, {
      props: {
        title: 'Toplam Görev',
        value: 10
      }
    })

    await wrapper.setProps({
      title: 'Tamamlanan Görev',
      value: 8
    })

    expect(wrapper.find('h3').text())
      .toBe('Tamamlanan Görev')

    expect(wrapper.find('strong').text())
      .toBe('8')
  })

  it('büyük sayıları eksiksiz gösterir', () => {
    const wrapper = mount(StatCard, {
      props: {
        title: 'Toplam Görev',
        value: 1000000
      }
    })

    expect(wrapper.find('strong').text())
      .toBe('1000000')
  })

})
