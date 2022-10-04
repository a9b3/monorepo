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
  import eight from 'src/assets/players/8.gif'
  import nine from 'src/assets/players/9.gif'
  import ten from 'src/assets/players/4.gif'
  import eleven from 'src/assets/players/5.gif'
  import thirteen from 'src/assets/players/7.gif'
  import foo from 'src/assets/players/10.gif'
  import bar from 'src/assets/players/11.gif'
  import zed from 'src/assets/players/13.gif'
  import fed from 'src/assets/players/14.gif'

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
    eight,
    nine,
    ten,
    eleven,
    thirteen,
    foo,
    bar,
    zed,
    fed,
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
    max-height: 70px;
    max-width: 70px;
    margin-right: 20px;
  }
</style>
