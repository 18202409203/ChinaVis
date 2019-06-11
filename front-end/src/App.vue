<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<style lang="less">
.div_title {
  font-weight: bold;
  background: #c9c9c9;

  padding: 5px;
  margin: 5px;
  /* margin: 5px 5px 0 5px; */
  border-radius: 5px;
}

.div_card {
  border: 1px solid #c9c9c9;
  padding: 5px;
  margin: 5px;
  /* margin: 0 5px 5px 5px; */
  border-radius: 5px;
  button {
    margin: 0 5px;
  }
}

.div_title_operation {
  float: right;
  button {
    margin: 0 5px;
  }
}

.center {
  text-align: center;
}

.white {
  color: #fff;
}

.red {
  color: red;
}

.blink {
  animation: blink 1s linear infinite alternate;
}

@keyframes blink {
  0% {
    fill-opacity: 0.6;
  }
  40% {
    fill-opacity: 0.7;
  }
  60% {
    fill-opacity: 0.8;
  }
  80% {
    fill-opacity: 1;
  }
  100% {
    fill-opacity: 1;
  }
}

// d3-tip styles
.d3-tip {
  line-height: 1;
  font-weight: bold;
  padding: 12px;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  border-radius: 2px;
  pointer-events: none;
  z-index: 9999;
}

/* Creates a small triangle extender for the tooltip */
.d3-tip:after {
  box-sizing: border-box;
  display: inline;
  font-size: 10px;
  line-height: 1;
  color: rgba(0, 0, 0, 0.4);
  position: absolute;
  pointer-events: none;
}

/* Northward tooltips */
.d3-tip.n:after {
  content: "\25BC";
  margin: -1px 0 0 0;
  top: 100%;
  left: calc(50% - 5px);
  text-align: center;
}

/* Eastward tooltips */
.d3-tip.e:after {
  content: "\25C0";
  margin: -4px 0 0 0;
  top: 50%;
  left: -8px;
}

/* Southward tooltips */
.d3-tip.s:after {
  content: "\25B2";
  margin: 0 0 1px 0;
  top: -8px;
  left: 0;
  text-align: center;
}

/* Westward tooltips */
.d3-tip.w:after {
  content: "\25B6";
  margin: -4px 0 0 -1px;
  top: 50%;
  left: 100%;
}

.dynamic_path {
  stroke-dasharray: 30000;
  stroke-dashoffset: 30000;
  -webkit-animation: dash 200s linear infinite;
  animation: dash 200s linear infinite;
}
@keyframes dash {
  0% {
    stroke-dashoffset: 30000;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
</style>