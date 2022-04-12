const { average } = require('../utils/for_testing')

//para agrupar test se usa describe
describe('average', () => {
  test.skip('of one value is the value itself', () => {
    expect(average([1])).toBe(1)
  })

  test.skip('of many is calculated correctly', () => {
    expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5)
  })

  test.skip('of empty array is zero', () => {
    expect(average([0])).toBe(0)
  })


})