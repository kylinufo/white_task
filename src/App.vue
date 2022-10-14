<template>
  <div id="app" ref="to_top">

    <router-view></router-view>
    <el-backtop target=""></el-backtop>
  </div>

</template>

<script>
export default {
  name: 'app',
  data(){
    return{}
  },
}
</script>

<style lang="less">
::-webkit-scrollbar {
  width: 5px;
  height: 14px;
}
::-webkit-scrollbar-track,
::-webkit-scrollbar-thumb {
  border-radius: 999px;
  border: 5px solid transparent;
}
::-webkit-scrollbar-track {
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2) inset;
}
::-webkit-scrollbar-thumb {
  min-height: 20px;
  background-clip: content-box;
  box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.2) inset;
}
::-webkit-scrollbar-corner {
  background: transparent;
}
body{
  //width: calc(100% - 5px);
  background-color: #1d1916;
  background-image:url("./assets/bj.jpg") ;
  background-repeat: repeat-y;
  background-size: 100%;
  margin:0;
  padding: 0;

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    .el-row{
      display: flex;
      flex-wrap: wrap;
      position: relative;
      box-sizing: border-box;
    }

  }
}

</style>
