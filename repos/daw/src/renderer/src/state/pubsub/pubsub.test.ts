import PubSub from './pubsub'

describe('PubSub', () => {
  let pubsub: PubSub
  let proxyObj: {
    user: {
      name: string
      age: number
      address?: {
        city: string
      }
    }
    items: string[]
  }

  beforeEach(() => {
    pubsub = new PubSub()
    proxyObj = pubsub.createProxy({
      user: {
        name: 'John',
        age: 30
      },
      items: ['apple', 'banana']
    })
  })

  test('should notify subscribers when a property changes', () => {
    const callback = jest.fn()
    pubsub.subscribe<string>('user.name', callback)

    proxyObj.user.name = 'Jane'

    expect(callback).toHaveBeenCalledWith('Jane')
  })

  test('should notify wildcard subscribers when any property changes', () => {
    const callback = jest.fn()
    pubsub.subscribe('*', callback)

    proxyObj.user.name = 'Jane'
    proxyObj.user.age = 31

    expect(callback).toHaveBeenCalledTimes(2)
    expect(callback).toHaveBeenCalledWith({ path: 'user.name', value: 'Jane' })
    expect(callback).toHaveBeenCalledWith({ path: 'user.age', value: 31 })
  })

  test('should handle nested objects', () => {
    const callback = jest.fn()
    pubsub.subscribe<string>('user.address', callback)

    // Create the address object first
    proxyObj.user.address = { city: 'New York' }

    expect(callback).toHaveBeenCalledWith({ city: 'New York' })
  })

  test('should handle undefined nested objects', () => {
    const callback = jest.fn()
    pubsub.subscribe<string | undefined>('user.address.city', callback)

    // Accessing undefined nested object
    const city = proxyObj.user.address?.city

    expect(city).toBeUndefined()
    expect(callback).not.toHaveBeenCalled()
  })

  test('should handle arrays', () => {
    const callback = jest.fn()
    pubsub.subscribe<string>('items.1', callback)

    proxyObj.items[1] = 'orange'

    expect(callback).toHaveBeenCalledWith('orange')
  })

  test('should unsubscribe correctly', () => {
    const callback = jest.fn()
    pubsub.subscribe<string>('user.name', callback)

    proxyObj.user.name = 'Jane'
    expect(callback).toHaveBeenCalledTimes(1)

    pubsub.unsubscribe('user.name', callback)
    proxyObj.user.name = 'Bob'
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('should unsubscribe wildcard subscriber correctly', () => {
    const callback = jest.fn()
    pubsub.subscribe('*', callback)

    proxyObj.user.name = 'Jane'
    expect(callback).toHaveBeenCalledTimes(1)

    pubsub.unsubscribe('*', callback)
    proxyObj.user.age = 31
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
