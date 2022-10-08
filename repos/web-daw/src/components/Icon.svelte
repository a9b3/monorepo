<script lang="ts">
  enum Icons {
    arrowDownFill = 'arrow-down-s-fill.svg',
    arrowDownLine = 'arrow-down-s-line.svg',
    arrowLeftFill = 'arrow-left-s-fill.svg',
    arrowLeftLine = 'arrow-left-s-line.svg',
    arrowRightFill = 'arrow-right-s-fill.svg',
    arrowRightLine = 'arrow-right-s-line.svg',
    arrowUpFill = 'arrow-up-s-fill.svg',
    arrowUpLine = 'arrow-up-s-line.svg',
    eyeFill1 = 'eye-fill-1.svg',
    eyeFill = 'eye-fill.svg',
    folderFill = 'folder-fill.svg',
    folderLine = 'folder-line.svg',
    heartFill = 'heart-fill.svg',
    heartLine = 'heart-line.svg',
    searchLine1 = 'search-line-1.svg',
    searchLine = 'search-line.svg',
    fileFill = 'file-fill.svg',
    fileLine = 'file-line.svg',
    empty = 'empty.png',
    musicFill = 'music-fill.svg',
    musicLine = 'music-line.svg',
    closeLine = 'close-line.svg',
    dashboardFill = 'dashboard-fill.svg',
    addLine = 'add-line.svg',
    gridFill = 'grid-fill.svg',
    listCheck = 'list-check.svg',
    stop = 'stop.svg',
    play = 'play.svg',
  }
  export let type: keyof typeof Icons

  function convertToPath(str: string) {
    return `/icons/${str}`
  }
</script>

<img
  class={$$restProps.class || ''}
  style={$$restProps.style}
  src={convertToPath(Icons[type])}
  alt={Icons[type]}
/>

<style>
  img {
    width: 1.2em;
    height: 1.2em;
    filter: invert();
  }
</style>
