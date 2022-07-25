import { normalizeArg, initModule } from '../module'

describe('uts-module', () => {
  test('normalize args', () => {
    expect(normalizeArg(1)).toBe(1)
    expect(normalizeArg('hello')).toBe('hello')
    expect(normalizeArg(true)).toBe(true)
    expect(normalizeArg({ callback: () => {} })).toEqual({
      callback: 1,
    })
    expect(
      normalizeArg({ success: () => {}, fail: () => {}, complete: () => {} })
    ).toEqual({
      success: 2,
      fail: 3,
      complete: 4,
    })
    expect(
      normalizeArg({
        user: {
          name: 'test',
          age: 10,
          callback() {},
        },
        success() {},
      })
    ).toEqual({
      user: {
        name: 'test',
        age: 10,
        callback: 5,
      },
      success: 6,
    })
  })
  test(`invoke`, () => {
    const wifi = initModule('wifi', {
      preparePermission: { async: true },
    })
    /**
     * {"module":"wifi","method":"preparePermission","params":[{"name":"foo","age":10,"success":7,"fail":8},9]}
     */
    wifi.preparePermission(
      {
        name: 'foo',
        age: 10,
        success(res: any) {
          console.log('success', res)
        },
        fail(res: any) {
          console.log('fail', res)
        },
      },
      (res: any) => {
        console.log('callback', res)
      }
    )
  })
})
