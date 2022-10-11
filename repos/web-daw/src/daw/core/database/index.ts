function readonly(target, name, descriptor) {
  console.log(descriptor)
  return descriptor
}

class Foo {
  @readonly
  name = 'sam'
}

const foo = new Foo()

console.log(foo.name)
