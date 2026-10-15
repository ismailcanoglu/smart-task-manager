
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import TaskForm from './TaskForm.vue'

describe('TaskForm Component', () => {
  it('input ve ekleme butonunu gösterir', () => {
    const wrapper = mount(TaskForm)

    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').text()).toContain('Görev Ekle')
  })

  it('boş başlıkta buton pasiftir', () => {
    const wrapper = mount(TaskForm)

    expect(
      wrapper.find('button').element.disabled
    ).toBe(true)
  })

  it('3 karakterden kısa başlıkta hata gösterir', async () => {
    const wrapper = mount(TaskForm)

    await wrapper.find('input').setValue('ab')

    expect(wrapper.find('.validation-error').text())
      .toContain('En az 3 karakter')

    expect(wrapper.find('button').element.disabled)
      .toBe(true)
  })

  it('geçerli başlıkta add-task olayı gönderir', async () => {
    const wrapper = mount(TaskForm)

    await wrapper.find('input').setValue('Vue testi yaz')
    await wrapper.find('form').trigger('submit')

    const events = wrapper.emitted('add-task')

    expect(events).toHaveLength(1)
    expect(events[0][0]).toBe('Vue testi yaz')
    expect(typeof events[0][1]).toBe('function')
  })

  it('başlığın başındaki ve sonundaki boşlukları temizler', async () => {
    const wrapper = mount(TaskForm)

    await wrapper.find('input').setValue('  Yeni görev  ')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('add-task')[0][0])
      .toBe('Yeni görev')
  })

  it('başarılı kayıt sonrası input temizlenir', async () => {
    const wrapper = mount(TaskForm)

    await wrapper.find('input').setValue('Yeni görev')
    await wrapper.find('form').trigger('submit')

    const resolve = wrapper.emitted('add-task')[0][1]
    resolve(true)

    await nextTick()
    await Promise.resolve()
    await nextTick()

    expect(wrapper.find('input').element.value).toBe('')
  })

  it('başarısız kayıt sonrası input korunur', async () => {
    const wrapper = mount(TaskForm)

    await wrapper.find('input').setValue('Yeni görev')
    await wrapper.find('form').trigger('submit')

    const resolve = wrapper.emitted('add-task')[0][1]
    resolve(false)

    await nextTick()
    await Promise.resolve()
    await nextTick()

    expect(wrapper.find('input').element.value)
      .toBe('Yeni görev')
  })

  it('saving true olduğunda form pasiftir', () => {
    const wrapper = mount(TaskForm, {
      props: {
        saving: true
      }
    })

    expect(wrapper.find('input').element.disabled).toBe(true)
    expect(wrapper.find('button').element.disabled).toBe(true)
    expect(wrapper.find('button').text()).toBe('Kaydediliyor...')
  })

  it('input en fazla 200 karakter kabul edecek şekilde ayarlanmıştır', () => {
    const wrapper = mount(TaskForm)

    expect(wrapper.find('input').attributes('maxlength'))
      .toBe('200')
  })
  
it('geçersiz form submit edilse bile add-task göndermez', async () => {
  const wrapper = mount(TaskForm)

  await wrapper.find('input').setValue('ab')

  await wrapper.find('form').trigger('submit')

  expect(wrapper.emitted('add-task')).toBeUndefined()
})

})
