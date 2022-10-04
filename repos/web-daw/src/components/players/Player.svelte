<script lang="ts">
  import MFDoom from 'src/assets/players/mfdoom.gif'
  import Dunno from 'src/assets/players/dunno.gif'
  import Tyler from 'src/assets/players/tyler.gif'
  import Ye from 'src/assets/players/ye.gif'
  import One from 'src/assets/players/1.gif'
  import Two from 'src/assets/players/2.gif'
  import Three from 'src/assets/players/3.gif'
  import Four from 'src/assets/players/chance.gif'
  import Five from 'src/assets/players/kareem.gif'
  import Six from 'src/assets/players/ye2.gif'
  import Seven from 'src/assets/players/ye3.gif'

  const players = [
    MFDoom,
    Dunno,
    Tyler,
    Ye,
    One,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
  ]

  const random = Math.floor(Math.random() * players.length)
</script>

<div class={($$restProps.class || '') + ' main'} style={$$restProps.style}>
  <img src={players[random]} />
</div>

<style>
  .main {
    width: 30px;
  }
  img {
    width: 50px;
  }
</style>
