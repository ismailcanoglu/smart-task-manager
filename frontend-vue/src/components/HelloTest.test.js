
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import HelloTest from './HelloTest.vue'

describe('HelloTest Component', () => {
  it('verilen mesajı ekranda gösterir', () => {
    const wrapper = mount(HelloTest, {
      props: {
        message: 'TaskFlow Test Başarılı',
      },
    })

    expect(wrapper.text()).toContain(
      'TaskFlow Test Başarılı'
    )
  })
})
