export function toClass(args: (string | undefined)[]) {
  return args.filter(a => a !== undefined).join(' ')
}
