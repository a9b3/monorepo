# Shortcut Manager

Manages registered shortcuts and their actions.

## Usage

Initalize the `ShortcutManager` and register shortcuts with the `register` method.

```typescript
import { ShortcutManager } from 'shortcutManager'

const manager = new ShortcutManager()

manager.register({
  title: 'Global shortcuts',
  context: 'global',
  description: 'Global shortcuts for the application',
  shortcuts: [
    {
      key: 'Ctrl+Shift+D',
      title: 'Ctrl+Shift+D shortcut',
      description: 'Description for Ctrl+Shift+D shortcut',
      action: () => {
        console.log('Ctrl+Shift+D pressed')
      }
    },
    {
      key: 'Ctrl+Shift+E',
      action: () => {
        console.log('Ctrl+Shift+E pressed')
      }
    }
  ]
})
```

### Contexts

Shortcuts can be registered in different contexts. The context is used to determine which shortcuts are active at any given time.

```typescript
manager.pushActiveContext('global')
manager.popActiveContext('global')
```

## API

### `ShortcutManager`

Shortcut manager class.

#### `constructor(): ShortcutManager`

Create a new `ShortcutManager` instance.

#### `register(options: ShortcutOptions): () => void`

Initalize the `ShortcutManager` and register shortcuts with the `register` method.

#### `pushActiveContext(context: string): void`

Push a new active context onto the stack.

#### `popActiveContext(context: string): void`

Pop the active context from the stack.
