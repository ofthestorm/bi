<template>
  <el-container>
    <el-header id="header">
      <el-row :gutter="20">
        <el-col :span="6"></el-col>
      </el-row>
    </el-header>
    <el-main id="graph"><svg/></el-main>
    <el-footer id="footer">
      {{footer}}
    </el-footer>
  </el-container>
</template>

<script>
// TODO:
// 画面拖动及缩放  √
// 节点聚焦动画及底部显示  √
// 连线聚焦动画及底部显示  √
// 节点点击动画  √
// 删除节点 √ 有bug
// 拓展节点
// 节点拖动之后固定 √
// 解锁节点 √
// 一个节点与另一个节点相连
// 多步关系有bug
// 多个关系首尾相同
  import d3 from 'd3'
  // import axios from 'axios'
  import {TweenMax, TimelineMax} from 'gsap/TweenMax'

  export default {
    name: 'myGraph',
    props: ['msg'],
    data: function () {
      return {
        data: null,
        footer: '',
        mouseX: 0,
        mouseY: 0,
        timesMax: 0
      }
    },
    mounted () {
      this.data = this.msg
      this.loadGraph()
    },
    watch: {
      msg: function (newVal, oldVal) {
        console.log(newVal)
        this.data = newVal
        this.loadGraph()
      }
    },
    methods: {
      // 加载节点和连线数据
      loadData () {
        var nodes = []
        var edges = []
        var objects = []
        var Times = []
        this.data.forEach(item => {
          var object1 = item[0][0]
          var relation = item[1][0]
          var object2 = item[2][0]
          if (objects.indexOf(object1) === -1) {
            objects.push(object1)
            Times.push(item[0][1])
          }
          if (objects.indexOf(object2) === -1) {
            objects.push(object2)
            Times.push(item[2][1])
          }
          edges.push({source: objects.indexOf(object1),
            target: objects.indexOf(object2),
            rela: relation})
        })
        objects.forEach((item, index) => {
          nodes.push({name: item, times: Times[index]})
        })
        this.timesMax = Math.max.apply(Math, Times)
        return [nodes, edges]
      },
      copy (obj1, target) {
        // 对象深拷贝
        // 存在 BUG : 当遇到两个互相引用的对象，会出现死循环的情况。
        // 无法区分传入的是[]还是{}
        var obj2 = target || [] // 最初的时候给它一个初始值=它自己或者是一个json
        for (var name in obj1) {
          if (typeof obj1[name] === 'object') { // 先判断一下obj[name]是不是一个对象
          // 我们让要复制的对象的name项 = 数组或者是json
            obj2[name] = (obj1[name].constructor === Array) ? [] : {}
            this.copy(obj1[name], obj2[name]) // 递归copy
          } else {
            obj2[name] = obj1[name]  // 如果不是对象，直接等于即可，不会发生引用
          }
        }
        return obj2 // 然后在把复制好的对象给return出去
      },
      loadGraph () {
        var self = this // 声明一个 this(在该环境内为VueComponent) 的别名，应对在内部函数中this改变的问题
        var width = document.getElementById('graph').offsetWidth // 画布的宽度
        var height = document.getElementById('graph').offsetHeight // 画布的高度

        // document.getElementsByTagName('body').setAttribute('onmousemove')

        // 定义拖拽函数
        var drag = d3.behavior.drag()
          .on('drag', function () {
            // d3.selectAll('g')
            //   .attr({
            //     'transform': 'translate(' + d3.event.dx + ',' + d3.event.dy + ')'
            //   })
            d3.select(this)
              .attr({
                'viewBox': (this.viewBox.baseVal.x - d3.event.dx).toString() + ' ' +
                (this.viewBox.baseVal.y - d3.event.dy).toString() + ' ' +
                this.viewBox.baseVal.width + ' ' +
                this.viewBox.baseVal.height
              })
          })

        // 定义缩放函数
        var zoom = d3.behavior.zoom()
          .scaleExtent([0.5, 2]) // 用于设置最小和最大的缩放比例
          .on('zoom', function () {
            d3.select(this)
              .attr({
                'viewBox': this.viewBox.baseVal.x + ' ' +
                this.viewBox.baseVal.y + ' ' +
                (width / d3.event.scale).toString() + ' ' +
                (height / d3.event.scale).toString()
              })
          })

        var svg = d3.select('svg')     // 选择文档中的svg元素
          .attr({
            'width': width, // 设定宽度
            'height': height, // 设定高度
            'viewBox': '0 0 ' + width + ' ' + height
          })
          .call(drag)
          .call(zoom)
          .on('dblclick.zoom', null) // 取消双击放大事件

        svg.append('rect')
           .attr({
             'x': -2500,
             'y': -2500,
             'width': 5000,
             'height': 5000,
           })
           .style({
             'fill': '#f9fbfd'
           })

        window.onresize = () => {
          width = document.getElementById('graph').offsetWidth
          height = document.getElementById('graph').offsetHeight
          svg.attr('width', width)
             .attr('height', height)
        }

        // 加载数据
        var [nodes, edges] = this.loadData()
        this.footer = 'Displaying ' + nodes.length + ' nodes, ' + edges.length + ' relationships.'

        var force = d3.layout.force()
          .nodes(nodes) // 指定节点数组
          .links(edges) // 指定连线数组
          .size([width, height]) // 指定作用域范围重力的重心位置为(width/2 , height/2)
          // 所有节点的初始位置限定为[0, width]和[0, height]之间(但并非之后也是如此）
          .linkDistance(150) // 指定连线长度
          .charge([-1500]) // 相互之间的作用力

        force.start()

        // // 在开始时保存一份数据的深拷贝
        // var nodesOrigin = self.copy(nodes)
        // var edgesOrigin = self.copy(edges)

        // 箭头
        svg.append('marker')
            // .attr('id', function(d) { return d })
            .attr('id', 'resolved')
            // .attr('markerUnits','strokeWidth') // 设置为strokeWidth箭头会随着线的粗细发生变化
            .attr('markerUnits', 'userSpaceOnUse')
            .attr('viewBox', '0 -3 8 6') // 视窗区域
            .attr('refX', '8px')
            .attr('refY', '0px')
            .attr('markerWidth', '10px') // 标识的大小
            .attr('markerHeight', '10px')
            .attr('orient', 'auto') // 绘制方向，可设定为：auto（自动确认方向）和 角度值
            .attr('stroke-width', '1px') // 箭头宽度
            .append('path')
            .attr('d', 'M 0 -3 L 8 0 L 0 3') // 箭头形状
            .attr('fill', '#01ed8a') // 箭头颜色

        // 添加连线
        var svgEdges = svg.append('g').attr('class', 'relationships')
            .selectAll('path')
            .data(edges)
            .enter()
            .append('g')
            .attr('class', 'relationship')

        // 连线聚焦边框
        var pathOverlay = svgEdges.append('path')
            .attr({
              'class': 'overlay',
              'id': function (d, i) {
                return 'overlay' + i
              },
              'd': ' '
            })
            .style({
              'fill': '#c5ebfe',
              'fill-opacity': '0'
            })
            .on('mouseover', function (d, i) {
              // 显示聚焦边框
              d3.select(this).style({
                'fill-opacity': '0.8'
              })
              // 在footer中显示关系名字
              if (d.rela === 'seeAlso') {
                self.footer = 'Relation: ' + d.rela + ' ( SeeAlso in ' + d.target.name + ' )'
              } else {
                self.footer = 'Relation: ' + d.rela + ' ( ' + d.target.name +
                ' is the ' + d.rela + ' of ' + d.source.name + ' )'
              }
            })
            .on('mouseout', function (d, i) {
              // 隐藏聚焦边框
              d3.select(this).style({
                'fill-opacity': '0'
              })
              // 在footer中显示查询信息
              self.footer = 'Displaying ' + nodes.length + ' nodes, ' + edges.length + ' relationships.'
            })

        // 连线本体
        var path = svgEdges.append('path')
            .attr({
              'class': 'outline',
              'fill': '#a4aab7',
              'stroke': 'none',
            })

        // 添加描述边的文字
        var edgeTexts = svgEdges.append('text')
            .attr('pointer-events', 'none')
            .style({
              'text-anchor': 'middle',
              'font-size': '10px',
              'fill': 'black',
            })
            // .append('textPath')
            // .attr('xlink:href', function (d, i) { return '#edgepath' + i })
            .text(function (d) { return d.rela })

        // 添加节点组
        var svgNodes = svg.append('g')
            .attr('class', 'nodes')
            .style('cursor', 'pointer')
            .selectAll('circle')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .call(force.drag)  // 使得节点能够拖动

        // 节点聚焦边框
        svgNodes.append('circle')
            .attr({
              'class': 'ring',
              // 'r': '34px'
              'r': function (d) {
                // 将搜索次数映射到[34, 54]的范围上
                return (34 + (d.times * 20 / self.timesMax)).toString() + 'px'
              }
            })
            .style({
              'fill': 'none',
              'stroke': '#c5ebfe',
              'stroke-width': '0',
              'stroke-opacity': '0.8'
            })

        // 节点本体
        var nodesOutline = svgNodes.append('circle')
            .attr({
              'class': 'outline',
              'r': function (d) {
                // 将搜索次数映射到[30, 54]的范围上
                return (30 + (d.times * 20 / self.timesMax)).toString() + 'px'
              }
            })
            .style({
              'fill': function (node) {
                var color
                if (node.name === 'Tencent') {
                  color = '#4dbcfa'
                } else {
                  color = '#ef89f9'
                }
                return color
              },
              'stroke': function (node) {
                var color
                if (node.name === 'Tencent') {
                  color = '#44a7de'
                } else {
                  color = '#ce75d6'
                }
                return color
              },
              'stroke-width': '2px'
            })

        // 节点名字
        svgNodes.append('text')
            .style({
              'fill': 'white',
              'cursor': 'wait'
            })
            // .attr({'dx': 20, 'dy': 8})
            .attr({
              'pointer-events': 'none', // 让 text 不会遮挡鼠标与节点的交互
              'text-anchor': 'middle',
              'dy': '5',
              'font-size': '12px'
            })
            .text(function (node) {
              if (node.name.length > 7) {
                return node.name.substring(0, 7) + '...'
              } else {
                return node.name
              }
            })

        // 是否有节点被选中
        var select = false
        // 不再为元素绑定click事件,只使用mousedown,mousemove,mouseup事件来区分拖拽和点击并模拟点击事件
        var hasMove = false
        // 节点组事件
        nodesOutline.on('mouseover', function (d, i) {
              // 当鼠标位于节点上方时
              // 取消svg的拖拽函数
          svg.on('mousedown.drag', null)
          // 显示聚焦边框
          d3.select(this.parentNode.getElementsByClassName('ring')[0]).style('stroke-width', '10px')
          // 在footer中显示节点完整名字
          self.footer = 'Objects: ' + d.name
        })
        .on('mouseout', function (d, i) {
          // 当鼠标离开节点时
          // 重新绑定svg的拖拽函数
          svg.call(drag)
          // 隐藏聚焦边框
          d3.select(this.parentNode.getElementsByClassName('ring')[0]).style('stroke-width', '0px')
          // 在footer中显示查询信息
          self.footer = 'Displaying ' + nodes.length + ' nodes, ' + edges.length + ' relationships.'
        })
        .on('mousedown', function () {
          hasMove = false
        })
        .on('mousemove', function () {
          hasMove = true // 表示有发生移动
        })
        .on('mouseup', function (d, i) {
          // 没有发生鼠标移动情况下的松开事件,模拟click
          if (!hasMove) {
            if (select === false) {
              select = true
              // 功能模块
              var funcGroup = d3.select(this.parentNode).append('g')
                  .attr({
                    'class': 'funcGroup'
                  })

              var linear = d.times * 20 / self.timesMax
              // 功能模块图标的额外位移
              var linearIcon = linear * Math.sqrt(2) / 2
              var inner = (38 + linear).toString()
              var outer = (68 + linear).toString()
              var path = 'M' + inner + ' -1' +
                      'L' + outer + ' -1' +
                      'A' + outer + ' ' + outer + ' 0 0 0 1 -' + outer +
                      'L1 -' + inner +
                      'A' + inner + ' ' + inner + ' 0 0 1 ' + inner + ' -1 Z'
              funcGroup.append('path')
                  .attr({
                    'class': 'remove',
                    'd': path
                  })
                  .style({
                    'fill': '#d2d5db',
                    'fill-opacity': '0'
                  })
                  .on('mouseover', function (d, i) {
                    d3.select(this)
                      .style({
                        'fill': '#b9b9b9'
                      })
                    self.footer = 'Remove node from the visualization'
                  })
                  .on('mouseout', function (d, i) {
                    d3.select(this)
                      .style({
                        'fill': '#d2d5db'
                      })
                    self.footer = 'Displaying ' + nodes.length + ' nodes, ' + edges.length + ' relationships.'
                  })
                  .on('click', function (d, i) {
                    console.log(d)
                    nodes.splice(d.index, 1)
                    var nodesName = []
                    nodes.forEach(item => {
                      nodesName.push(item.name)
                    })
                    for (i = 0; i < edges.length; i++) {
                      if (edges[i].source.name === d.name || edges[i].target.name === d.name) {
                        edges.splice(i, 1)
                        i--  // 在遍历数组的过程中中删除数组元素一定要小心！！！！！！
                      }
                    }
                    // nodes删除元素之后index发生改变，需要更新edges的source和target
                    edges.forEach((item, index) => {
                      item.source = nodesName.indexOf(item.source.name)
                      item.target = nodesName.indexOf(item.target.name)
                    })
                    svgNodes.data(force.nodes()).exit().remove()
                    svgEdges.data(force.links()).exit().remove()
                    d3.selectAll('.funcGroup').remove()
                    select = false
                    force.start()
                  })
              funcGroup.append('path')
                  .attr({
                    'class': 'expand',
                    'd': path,
                    'transform': 'rotate(90)'
                  })
                  .style({
                    'fill': '#d2d5db',
                    'fill-opacity': '0'
                  })
                  .on('mouseover', function (d, i) {
                    d3.select(this)
                      .style({
                        'fill': '#b9b9b9'
                      })
                    self.footer = 'Expand child relationships'
                  })
                  .on('mouseout', function (d, i) {
                    d3.select(this)
                      .style({
                        'fill': '#d2d5db'
                      })
                    self.footer = 'Displaying ' + nodes.length + ' nodes, ' + edges.length + ' relationships.'
                  })
                  .on('click', function (d, i) {
                    console.log(d)
                    d3.selectAll('.funcGroup').remove()
                    select = false
                    // var newData
                    // axios.get('http://localhost:8081/' + d.name).then(response => {
                    //   newData = response.data.result
                    //   var nodesName = []
                    //   nodes.forEach(item => {
                    //     nodesName.push(item.name)
                    //   })
                      // console.log(nodes)
                      // console.log(newData)
                      // console.log(nodesName)
                      // console.log(edges)
                      // newData.forEach(item => {
                      //   if (nodesName.indexOf(item[0][0]) === -1) {
                      //     nodes.push({name: item[0][0], times: item[0][1]})
                      //     nodesName.push(item[0][0])
                      //   }
                      //   if (nodesName.indexOf(item[2][0]) === -1) {
                      //     nodes.push({name: item[2][0], times: item[2][1]})
                      //     nodesName.push(item[2][0])
                      //   }
                      //   edges.push({source: nodesName.indexOf(item[0][0]),
                      //     target: nodesName.indexOf(item[2][0]),
                      //     rela: item[1][0]})
                      // })
                    //   svgNodes.append('circle')
                    //       .attr({
                    //         'class': 'ring',
                    //         'r': '34px'
                    //       })
                    //       .style({
                    //         'fill': 'none',
                    //         'stroke': '#c5ebfe',
                    //         'stroke-width': '0',
                    //         'stroke-opacity': '0.8'
                    //       })
                    //   svgNodes.append('circle')
                    //       .attr({
                    //         'class': 'outline',
                    //         'r': '30px',
                    //         'display': 'block'
                    //       })
                    //       .style({
                    //         'fill': function (node) {
                    //           var color
                    //           if (node.name === 'Tencent') {
                    //             color = '#4dbcfa'
                    //           } else {
                    //             color = '#ef89f9'
                    //           }
                    //           return color
                    //         },
                    //         'stroke': function (node) {
                    //           var color
                    //           if (node.name === 'Tencent') {
                    //             color = '#44a7de'
                    //           } else {
                    //             color = '#ce75d6'
                    //           }
                    //           return color
                    //         },
                    //         'stroke-width': '2px'
                    //       })
                    //   svgNodes.append('text')
                    //       .style({
                    //         'fill': 'white',
                    //         'cursor': 'wait'
                    //       })
                    //       // .attr({'dx': 20, 'dy': 8})
                    //       .attr({
                    //         'pointer-events': 'none', // 让 text 不会遮挡鼠标与节点的交互
                    //         'text-anchor': 'middle',
                    //         'dy': '5',
                    //         'font-size': '12px'
                    //       })
                    //       .text(function (node) {
                    //         if (node.name.length > 7) {
                    //           return node.name.substring(0, 7) + '...'
                    //         } else {
                    //           return node.name
                    //         }
                    //       })

                    //   // svgEdges = svgEdges.data(edges)
                    //   svgEdges.append('path')
                    //       .attr({
                    //         'class': 'overlay',
                    //         'id': function (d, i) {
                    //           return 'overlay' + i
                    //         },
                    //         'd': ' '
                    //       })
                    //       .style({
                    //         'fill': '#c5ebfe',
                    //         'fill-opacity': '0'
                    //       })
                    //   svgEdges.append('path')
                    //       .attr({
                    //         'class': 'outline',
                    //         'fill': '#a4aab7',
                    //         'stroke': 'none',
                    //       })
                    //   svgEdges.append('text')
                    //       .attr('pointer-events', 'none')
                    //       .style({
                    //         'text-anchor': 'middle',
                    //         'font-size': '10px',
                    //         'fill': 'black',
                    //       })
                    //       .text(function (d) { return d.rela })

                    //   force.start()
                    // }, response => {
                    //   self.$message({
                    //     duration: 1000,
                    //     message: 'Sorry, this node has no more information'
                    //   })
                    // })
                  })
              funcGroup.append('path')
                  .attr({
                    'class': 'link',
                    'd': path,
                    'transform': 'rotate(180)'
                  })
                  .style({
                    'fill': '#d2d5db',
                    'fill-opacity': '0'
                  })
                  .on('mouseover', function (d, i) {
                    d3.select(this)
                      .style({
                        'fill': '#b9b9b9'
                      })
                    self.footer = 'Show the relationships to another node'
                  })
                  .on('mouseout', function (d, i) {
                    d3.select(this)
                      .style({
                        'fill': '#d2d5db'
                      })
                    self.footer = 'Displaying ' + nodes.length + ' nodes, ' + edges.length + ' relationships.'
                  })
                  .on('click', function (d, i) {
                    var data = this.parentNode.parentNode.getElementsByClassName('outline')[0].__data__
                    // 获取svg的实时位置
                    var pos = document.getElementsByTagName('svg')[0].getBoundingClientRect()
                    svg.append('path')
                       .attr({
                         'd': 'M' + data.x + ' ' + data.y +
                         'L' + (d3.event.x - pos.left).toString() + ' ' + (d3.event.y - pos.top).toString(),
                         'marker-end': 'url(#resolved)',
                         'pointer-events': 'none',
                         'id': 'linkPath'
                       })
                       .style({
                         'stroke': '#01ed8a',
                         'stroke-dasharray': '5, 5, 2, 5',
                         'stroke-linecap': 'round',
                         'stroke-width': '2px'
                       })
                    svg.on('mousemove', function () {
                      d3.select('#linkPath')
                        .attr({
                          'd': 'M' + data.x + ' ' + data.y +
                          'L' + (d3.event.x - pos.left).toString() + ' ' + (d3.event.y - pos.top).toString()
                        })
                    })
                    d3.selectAll('.funcGroup').remove()
                  })
              funcGroup.append('path')
                  .attr({
                    'class': 'unlock',
                    'd': path,
                    'transform': 'rotate(-90)'
                  })
                  .style({
                    'fill': '#d2d5db',
                    'fill-opacity': '0'
                  })
                  .on('mouseover', function (d, i) {
                    d3.select(this)
                      .style({
                        'fill': '#b9b9b9'
                      })
                    self.footer = 'Unlock the node to re-layout the node'
                  })
                  .on('mouseout', function (d, i) {
                    d3.select(this)
                      .style({
                        'fill': '#d2d5db'
                      })
                    self.footer = 'Displaying ' + nodes.length + ' nodes, ' + edges.length + ' relationships.'
                  })
                  .on('click', function (d, i) {
                    d.fixed = 0
                    d3.selectAll('.funcGroup').remove()
                    force.start()
                  })

              funcGroup.append('path')
                  .attr({
                    'd': 'M786.7392 333.42464 608.17408 512 786.7392 690.57536c26.56256 26.56256 26.56256 69.61152 0 96.17408-13.27104 13.27104-30.6688 19.9168-48.06656 19.9168-17.408 0-34.80576-6.63552-48.0768-19.9168L512 608.16384l-178.5856 178.5856c-13.27104 13.27104-30.6688 19.9168-48.0768 19.9168-17.39776 0-34.78528-6.63552-48.06656-19.9168-26.56256-26.55232-26.56256-69.60128 0-96.17408L415.82592 512 237.2608 333.42464c-26.56256-26.56256-26.56256-69.61152 0-96.17408 26.55232-26.54208 69.5808-26.54208 96.14336 0L512 415.83616l178.5856-178.5856c26.56256-26.54208 69.59104-26.54208 96.14336 0C813.30176 263.81312 813.30176 306.86208 786.7392 333.42464z',
                    'transform': 'translate(' + (29 + linearIcon).toString() + ', ' + (-(44 + linearIcon)).toString() + ') scale(0.02)',
                    'pointer-events': 'none',
                    'class': 'remove'
                  })
                  .style({
                    'fill': 'white',
                    'fill-opacity': '0',
                    'stroke': 'none',
                  })
              funcGroup.append('path')
                  .attr({
                    'd': 'M804.571429 0C680.228571 0 585.142857 95.085714 585.142857 219.428571c0 73.142857 36.571429 138.971429 95.085714 182.857143L555.885714 665.6C541.257143 658.285714 526.628571 658.285714 512 658.285714 468.114286 658.285714 431.542857 672.914286 402.285714 694.857143L277.942857 577.828571C285.257143 555.885714 292.571429 533.942857 292.571429 512c0-80.457143-65.828571-146.285714-146.285714-146.285714S0 431.542857 0 512c0 80.457143 65.828571 146.285714 146.285714 146.285714 29.257143 0 58.514286-7.314286 80.457143-21.942857l124.342857 117.028571c-14.628571 29.257143-29.257143 58.514286-29.257143 95.085714C329.142857 943.542857 409.6 1024 512 1024s182.857143-80.457143 182.857143-182.857143c0-58.514286-29.257143-109.714286-73.142857-146.285714l124.342857-263.314286C768 431.542857 782.628571 438.857143 804.571429 438.857143c124.342857 0 219.428571-95.085714 219.428571-219.428571S928.914286 0 804.571429 0z',
                    'transform': 'translate(' + (29 + linearIcon).toString() + ', ' + (29 + linearIcon).toString() + ') scale(0.016)',
                    'pointer-events': 'none',
                    'class': 'expand'
                  })
                  .style({
                    'fill': 'white',
                    'fill-opacity': '0',
                    'stroke': 'none'
                  })
              funcGroup.append('path')
                  .attr({
                    'd': 'M767.607467 639.0784c2.850133 33.9968-9.9328 67.9936-35.498667 93.508267A122.538667 122.538667 0 0 1 645.546667 768c-35.498667 0-70.980267-15.581867-96.529067-41.079467l-103.6288-103.424c-26.965333-26.9312-41.1648-62.344533-41.1648-96.3584 0-32.580267 11.3664-62.327467 35.498667-86.408533a33.450667 33.450667 0 0 1 46.830933 0 33.314133 33.314133 0 0 1 0 46.7456c-22.698667 22.664533-19.8656 62.344533 5.6832 87.842133l103.6288 103.424c14.199467 12.7488 32.648533 21.248 49.681067 21.248 11.349333 0 26.965333-2.833067 39.748266-15.581866 14.199467-14.165333 15.616-31.163733 15.616-42.496 0-17.015467-8.533333-34.013867-21.2992-46.762667l-41.1648-41.079467a33.314133 33.314133 0 0 1 0-46.762666 33.450667 33.450667 0 0 1 46.848 0l41.1648 41.096533c25.5488 25.4976 39.748267 56.661333 41.1648 90.6752z m-379.392-169.130667c12.8 12.731733 11.383467 33.9968-2.833067 46.7456a33.501867 33.501867 0 0 1-46.882133 0l-26.9824-28.330666-14.216534-14.165334c-25.565867-25.514667-39.765333-56.6784-41.198933-90.692266-1.416533-33.9968 11.3664-67.9936 35.515733-92.091734A122.709333 122.709333 0 0 1 378.282667 256c35.498667 0 71.031467 15.581867 96.597333 41.079467l103.714133 103.424c26.9824 26.9312 41.198933 62.344533 41.198934 96.3584 0 32.580267-11.3664 62.327467-35.515734 86.408533a33.501867 33.501867 0 0 1-46.882133 0 33.28 33.28 0 0 1 0-46.7456c22.7328-22.664533 19.882667-62.344533-5.6832-87.842133l-103.714133-103.424c-14.199467-14.165333-32.6656-21.248-49.7152-21.248-11.3664 0-26.999467 2.833067-39.765334 15.581866-14.216533 14.165333-15.633067 31.163733-15.633066 42.496 1.416533 17.015467 9.9328 32.597333 22.715733 45.346134l14.216533 14.165333 28.416 28.330667c-1.4336 0-1.4336 0 0 0z',
                    'transform': 'translate(' + (-(55 + linearIcon)).toString() + ', ' + (20 + linearIcon).toString() + ') scale(0.035)',
                    'pointer-events': 'none',
                    'class': 'link'
                  })
                  .style({
                    'fill': 'white',
                    'fill-opacity': '0',
                    'stroke': 'none',
                  })
              funcGroup.append('path')
                  .attr({
                    'd': 'M982.848 329.152v146.272q0 14.848-10.848 25.728t-25.728 10.848h-36.576q-14.848 0-25.728-10.848t-10.848-25.728v-146.272q0-60.576-42.848-103.424t-103.424-42.848-103.424 42.848-42.848 103.424v109.728h54.848q22.848 0 38.848 16t16 38.848v329.152q0 22.848-16 38.848t-38.848 16H86.848q-22.848 0-38.848-16T32 822.88V493.728q0-22.848 16-38.848t38.848-16h384v-109.728q0-105.728 75.136-180.864t180.864-75.136 180.864 75.136 75.136 180.864z',
                    'transform': 'translate(' + (-(48 + linearIcon)).toString() + ', ' + (-(43 + linearIcon)).toString() + ') scale(0.018)',
                    'pointer-events': 'none',
                    'class': 'unlock'
                  })
                  .style({
                    'fill': 'white',
                    'fill-opacity': '0',
                    'stroke': 'none',
                  })

              var tl = new TimelineMax()
              tl.to('.remove', 0.05, {fillOpacity: 1})
                .to('.expand', 0.05, {fillOpacity: 1})
                .to('.link', 0.05, {fillOpacity: 1})
                .to('.unlock', 0.05, {fillOpacity: 1})
            } else {
              // 当前有node被选中
              var linkPath = d3.select(document.getElementById('linkPath'))
              if (linkPath[0][0] != null) {
                linkPath.remove()
              }
              TweenMax.to('.funcGroup', 0.3, {
                opacity: 0,
                onComplete: function () {
                  d3.selectAll('.funcGroup').remove()
                }
              })
              select = false
            }
          } else {
            // 发生了鼠标移动情况下的松开事件，固定该节点
            d.fixed = 1
          }
        })

        force.on('tick', function () { // 对于每一个时间间隔
          // 更新连线坐标系
          svgEdges.attr({
            'transform': function (d) {
              var dx = d.target.x - d.source.x
              var dy = d.target.y - d.source.y
              var dz = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
              var angle = Math.acos(dx / dz) / Math.PI * 180
              if (dy < 0) { angle = -angle }
              return 'translate(' + d.source.x + ',' + d.source.y + ')' +
              ' rotate(' + angle + ')'
            }
          })
          // 更新连线
          path.attr({
            'd': function (d) {
              var len = Math.sqrt((Math.pow((d.source.x - d.target.x), 2) + Math.pow((d.source.y - d.target.y), 2))) - 31 * 2 - d.rela.length * 5
              // 画线+箭头形状
              return 'M 31 0.5' +
              ' h ' + (len / 2).toString() +
              ' v ' + (-1).toString() +
              ' h ' + (-(len / 2)).toString() + ' Z ' +
              ' M ' + (31 + len / 2 + d.rela.length * 5).toString() + ' ' + 0.5 +
              ' h ' + (len / 2 - 7).toString() +
              ' v ' + 3 +
              ' l ' + 7 + ' ' + (-3.5).toString() +
              ' l ' + (-7).toString() + ' ' + (-3.5).toString() +
              ' v ' + 3 +
              ' h ' + (-(len / 2 - 7)).toString() + ' Z'
            }
          })
          // 更新连线文字位置
          edgeTexts.attr({
            'x': function (d) {
              return (Math.sqrt((Math.pow((d.source.x - d.target.x), 2) + Math.pow((d.source.y - d.target.y), 2)))) / 2
            },
            'y': '3px'
          })
          // 更新连线遮罩坐标
          pathOverlay.attr({
            'd': function (d) {
              var len = Math.sqrt((Math.pow((d.source.x - d.target.x), 2) + Math.pow((d.source.y - d.target.y), 2)))
              return 'M 0 8' + ' H ' + len + ' V ' + -8 + ' H ' + 0 + ' Z'
            }
          })

          // 更新节点坐标
          svgNodes.attr({
            'transform': function (d) { return 'translate(' + d.x + ',' + d.y + ')' }
          })
        })
      }
    }
  }
</script>

<style lang="scss">
  #graph {
    height: 400px;
    padding: 0;
  }
  #footer {
    height: 50px !important;
  }
  #header {
    height: 50px !important;
    line-height: 50px;
  }
</style>
