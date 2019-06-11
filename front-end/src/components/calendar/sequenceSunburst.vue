<template>
  <div class="sun-container">
    <div id="main">
      <div class="sequence" :id="sequenceId"></div>
      <div class="chart" :id="chartId">
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  data() {
    return {
      path: undefined,
      nodes: undefined,
      totalSize: 0,
      b: {
        w: 45, h: 30, s: 3, t: 10
      },
      colors: {},
      chartId: 'chart' + this.$util.randomString(),
      sequenceId: 'sequence' + this.$util.randomString()
    }
  },
  methods: {
    paint(url) {
      var vm = this;
      this.$util.removeAllChildren(document.getElementById(vm.sequenceId))
      this.$util.removeAllChildren(document.getElementById(vm.chartId))
      // Dimensions of sunburst.
      var width = 750;
      var height = 600;
      var radius = Math.min(width, height) / 2;

      // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
      // b

      let _keys = this.$util.cellFill.layout.keys();
      var colors = {};
      for (let key of _keys) {
        colors[key] = this.$util.cellFill.layout.get(key)
      }
      vm.colors = colors;

      // Total size of all segments; we set this later, after loading the data.
      vm.totalSize = 0;

      vm.vis = d3.select("#" + vm.chartId).append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .append("svg:g")
        .attr("id", "container")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      // zpj tip
      // var tips = vis.append("g").append("text").text("");


      var partition = d3.partition()
        .size([2 * Math.PI, radius * radius]);

      var arc = d3.arc()
        .startAngle(function (d) { return d.x0; })
        .endAngle(function (d) { return d.x1; })
        .innerRadius(function (d) { return Math.sqrt(d.y0); })
        .outerRadius(function (d) { return Math.sqrt(d.y1); });

      //   d3.text("./api/visit-sequences.csv")
      d3.text(url)
        .then(function (text) {
          var csv = d3.csvParseRows(text);
          var json = buildHierarchy(csv);
          console.log(json);
          createVisualization(json);
        });

      // Main function to draw and set up the visualization, once we have the data.
      function createVisualization(json) {
        // Basic setup of page elements.
        initializeBreadcrumbTrail();

        // Bounding circle underneath the sunburst, to make it easier to detect
        // when the mouse leaves the parent g.
        vm.vis.append("svg:circle")
          .attr("r", radius)
          .style("opacity", 0);

        // Turn the data into a d3 hierarchy and calculate the sums.
        var root = d3.hierarchy(json)
          .sum(function (d) { return d.size; })
          .sort(function (a, b) { return b.value - a.value; });

        // For efficiency, filter nodes to keep only those large enough to see.
        vm.nodes = partition(root).descendants()
        //   .filter(function (d) {
        //     return (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
        //   });

        vm.path = vm.vis.data([json]).selectAll("path")
          .data(vm.nodes)
          .enter().append("svg:path")
          //   .attr("display", function (d) { return d.depth ? null : "none"; })
          .attr("d", arc)
          .attr("fill-rule", "evenodd")
          .style("fill", function (d) { return vm.colors[d.data.name] || '#fff'; })
          .attr('id', d => vm.colors[d.data.name] ? null : d.data.name)
          .attr("stroke", '#fff')
          .style("opacity", 1)
          .on("mouseover", vm.mouseover);

        // Add the mouseleave handler to the bounding circle.
        d3.select("#container").on("mouseleave", mouseleave);

        // Get total size of the tree = value of root node from partition.
        vm.totalSize = vm.path.datum().value;
        console.log(vm.totalSize)
      }

      // Restore everything to full opacity when moving off the visualization.
      function mouseleave() {
        // Hide the breadcrumb trail
        d3.select("#trail")
          .style("visibility", "hidden");

        // Deactivate all segments during transition.
        d3.selectAll("path").on("mouseover", null);

        // Transition each segment to full opacity and then reactivate it.
        d3.selectAll("path")
          .transition()
          .duration(100)
          .attr("stroke", '#fff')
          .style("opacity", 1)
          .on("end", function () {
            d3.select(this).on("mouseover", vm.mouseover);
          });
      }

      function initializeBreadcrumbTrail() {
        // Add the svg area.
        var trail = d3.select("#" + vm.sequenceId).append("svg:svg")
          .attr("width", width)
          .attr("height", 50)
          .attr("id", "trail");
        // Add the label at the end, for the percentage.
        trail.append("svg:text")
          .attr("id", "endlabel")
          .style("fill", "#000");
      }

      function buildHierarchy(csv) {
        var root = { "name": "root", "children": [] };
        for (var i = 0; i < csv.length; i++) {
          var sequence = csv[i][0];
          var size = +csv[i][1];
          if (isNaN(size)) { // e.g. if this is a header row
            continue;
          }
          var parts = sequence.split("-");
          var currentNode = root;
          for (var j = 0; j < parts.length; j++) {
            var children = currentNode["children"];
            var nodeName = parts[j];
            var childNode;
            if (j + 1 < parts.length) {
              // Not yet at the end of the sequence; move down the tree.
              var foundChild = false;
              for (var k = 0; k < children.length; k++) {
                if (children[k]["name"] == nodeName) {
                  childNode = children[k];
                  foundChild = true;
                  break;
                }
              }
              // If we don't already have a child node for this branch, create it.
              if (!foundChild) {
                childNode = { "name": nodeName, "children": [] };
                children.push(childNode);
              }
              currentNode = childNode;
            } else {
              // Reached the end of the sequence; create a leaf node.
              childNode = { "name": nodeName, "size": 1 };
              children.push(childNode);
            }
          }
        }
        return root;
      }
    },
    // 手动高亮
    highlight(confereeId) {
      var leaf = this.findLeafNode(this.nodes, confereeId)
      console.log(leaf)
      leaf.size = 50
      this.mouseover(leaf);
    },
    // 找到叶子结点
    findLeafNode(arr, id) {
      for (let node of arr) {
        for (let n of node.leaves()) {
          if (n.data.name === id) {
            return n;
          }
        }
      }
    },
    // 鼠标悬浮
    mouseover(d) {
      var vm = this
      var percentage = (100 * d.value / vm.totalSize).toPrecision(3);
      var percentageString = percentage + "%";
      if (percentage <= (100 / vm.totalSize).toPrecision(3)) {
        percentageString = "";
      }

      d3.select("#percentage")
        .text(percentageString);

      var sequenceArray = d.ancestors().reverse();
      sequenceArray.shift(); // remove root node from the array
      vm.updateBreadcrumbs(sequenceArray, percentageString);

      // Fade all the segments.
      d3.selectAll("path")
        .style("opacity", 0.1);

      // Then highlight only those that are an ancestor of the current segment.
      vm.vis.selectAll("path")
        .filter(function (node) {
          return (sequenceArray.indexOf(node) >= 0);
        })
        .attr("stroke", 'red')
        .style("opacity", 1);
    },
    updateBreadcrumbs(nodeArray, percentageString) {
      var vm = this;
      var trail = d3.select("#trail")
        .selectAll("g")
        .data(nodeArray, function (d) { return d.data.name + d.depth; });

      // Remove exiting nodes.
      trail.exit().remove();

      // Add breadcrumb and label for entering nodes.
      var entering = trail.enter().append("svg:g");

      entering.append("svg:polygon")
        .attr("points", vm.breadcrumbPoints)
        .style("fill", function (d) { return vm.colors[d.data.name]; });

      entering.append("svg:text")
        .attr("x", (vm.b.w + vm.b.t) / 2)
        .attr("y", vm.b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(function (d) { return d.data.name; });

      // Merge enter and update selections; set position for all nodes.
      entering.merge(trail).attr("transform", function (d, i) {
        return "translate(" + i * (vm.b.w + vm.b.s) + ", 0)";
      });

      // Now move and update the percentage at the end.
      d3.select("#trail").select("#endlabel")
        .attr("x", (nodeArray.length + 0.5) * (vm.b.w + vm.b.s))
        .attr("y", vm.b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(percentageString);

      // Make the breadcrumb trail visible, if it's hidden.
      d3.select("#trail")
        .style("visibility", "");
    },
    breadcrumbPoints(d, i) {
      var vm = this;
      var points = [];
      points.push("0,0");
      points.push(vm.b.w + ",0");
      points.push(vm.b.w + vm.b.t + "," + (vm.b.h / 2));
      points.push(vm.b.w + "," + vm.b.h);
      points.push("0," + vm.b.h);
      if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
        points.push(vm.b.t + "," + (vm.b.h / 2));
      }
      return points.join(" ");
    }
  },
  mounted() {
    // this.paint();
  }
}
</script>

<style>
.sun-container {
  font-family: "Open Sans", sans-serif;
  font-size: 12px;
  font-weight: 400;
  background-color: #fff;
  width: 100%;
  height: 700px;
  margin-top: 10px;
}

#main {
  float: left;
  width: 750px;
}

#sidebar {
  float: right;
  width: 100px;
}

.sequence {
  width: 600px;
  height: 70px;
}

.sequence text {
  font-weight: 600;
  fill: #fff;
}

.chart {
  position: relative;
}

.chart path {
  /* stroke: #fff; */
}

#percentage {
  font-size: 2.5em;
}
</style>
