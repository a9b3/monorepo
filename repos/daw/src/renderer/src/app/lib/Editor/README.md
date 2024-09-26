# Editor

Block editor for the app.

## Lifecycle

```
Editor -> (Read) -> View -> (Mutate) -> Editor ...
```

1. Instantiate Editor, view reads from editor to render.
   Editor will emit events upon data mutation you can listen to all events (e.g.
   '\*') and update the view from the editor instance properties.

2. Bind editor mutate actions to view.

3. For each child block

- Bind block mutate actions to view.
