/// <reference path="../node_modules/@figma/plugin-typings/index.d.ts" />

figma.showUI(__html__, { width: 300, height: 300 });
console.log('2021-11-251111')
console.log(figma.currentPage.selection);

if (figma.currentPage.selection.length > 0) {
  figma.ui.postMessage({ 'selectionName': figma.currentPage.selection[0].name, 'erroMsg': '' })
} else {
  figma.ui.postMessage({ 'selectionName': '', 'erroMsg': '' })
}

let fn = () => {
  console.log('code.ts:selectionchange');

  if (figma.currentPage.selection.length > 0) {
    figma.ui.postMessage({ 'selectionName': figma.currentPage.selection[0].name, 'erroMsg': '' })
  } else {
    figma.ui.postMessage({ 'selectionName': '', 'erroMsg': '' })
  }
}

figma.on('selectionchange', fn)


var myFont //字体
// { 'family': 'OPPOSans', 'style': 'Regular' }
var pageName = '📄 Table of contents' //目录页面名称
var frameName = 'Table of contents' //Frame 图层名称


// 判断是否存在页面，其名称 = 当前选中的图层名称
// 存在：判断页面内是否存在 Frame，其名称 = 当前选中的图层名称
// 不存在：创建页面，并在页面下创建 Frame
// 遍历所有页面，查找图层名称 = 当前选中图层名称
// 在 Frame 中创建文本图层
// 文本值 = 页面名称
// 链接：无
// 样式 = 页面信息样式
// 在 Frame 中创建文本图层
// 文本值：当前图层下，首个文本图层的前 x 个文本值
// 链接：链接到当前遍历到的图层
// 样式：文字链样式

// UI 发来消息
figma.ui.onmessage = (msg) => {
  console.log('code.ts-figma.ui.onmessage:');

  console.log(msg);
  console.log(msg.data);

  main(msg.data)


  // figma.closePlugin();
};


//主逻辑
async function main(selectionLayerName) {


  //如果选中是目录本身，则支持更新目录
  if (selectionLayerName.indexOf('📄 ') >= 0) {
    selectionLayerName = selectionLayerName.replace('📄 ', '')
  }
  console.log("selectionLayerName:");
  console.log(selectionLayerName);


  pageName = '📄 ' + selectionLayerName
  frameName = pageName


  //查找当前选中图层中的文本图层，获取起字体作为默认字体
  var fristText


  //如果当前有选中图层
  if (figma.currentPage.selection.length > 0) {

    //取当前页面下的首个文字作为默认字体
    var fristLayer = figma.currentPage
    fristText = fristLayer.findOne(n => n.type === "TEXT")

    console.log('fristText = figma.currentPage.selection[0].findOne(n => n.type === "TEXT")');
    console.log(fristText);
    if (fristText != null) {
      myFont = fristText.fontName
    }
  }

  //如果当前选中图层下没有文本图层
  if (myFont == '') {
    //获取首页的首个字体作为默认字体
    fristText = figma.root.findOne(n => n.type === 'TEXT')

    if (fristText == null) {
      //没有找到文本浮层
      figma.notify('❌ Please try again after adding a text layer to any page')
      figma.closePlugin()
    } else {
      //存在文本浮层
      console.log(fristText);
      console.log(fristText.name);
      myFont = fristText.fontName
      // { 'family': 'OPPOSans', 'style': 'Regular' }


    }
  }


  //加载字体
  await myLoadFontAsync(myFont)

  var pages = figma.root.children


  // var targetFrame = figma.root.findAll(n => n.name === selectionLayerName && n.type === 'FRAME')
  // 找到文档中所有与选中图层同名的图层
  var targetLyaer = figma.root.findAll(n => n.name === selectionLayerName)
  console.log('2021-11-25 targetFrame==============');
  console.log(targetLyaer);

  //相同名称的图层数>0 才执行
  if (targetLyaer.length > 0) {

    //创建页面
    var contentPage = null
    var contentFrame = null
    //判断是否已存在页面，若存在则更新
    for (var j = 0; j < pages.length; j++) {
      if (pages[j].name == pageName) {
        contentPage = pages[j]
        //判断页面下是否存在目录 FRAME
        for (var i = 0; i < contentPage.children.length; i++) {
          if (contentPage.children[i].name == frameName) {
            contentFrame = contentPage.children[i]
            break
          }
        }
      }
      if (contentFrame != null) {
        break
      }
    }


    if (contentPage == null) {
      //不存在页面，新建
      contentPage = figma.createPage()
      figma.root.insertChild(0, contentPage)
    }
    if (contentFrame == null) {
      //不存在 Frame，新建
      contentFrame = figma.createFrame()
    } else {
      contentFrame.remove()
      contentFrame = figma.createFrame()
    }

    //设置页面
    contentPage.name = pageName


    //设置 frame 容器
    contentFrame.name = frameName


    contentFrame.layoutMode = 'VERTICAL' //自动布局（垂直方向）
    contentFrame.itemSpacing = 14 //间距
    contentFrame.resize(400, 1000)
    contentFrame.counterAxisSizingMode = 'FIXED'
    contentFrame.primaryAxisSizingMode = 'AUTO'
    contentFrame.paddingLeft = 20
    contentFrame.paddingTop = 20
    contentFrame.paddingRight = 20
    contentFrame.paddingBottom = 20
    contentFrame.cornerRadius = 8


    //将 Frame 添加到页面中
    contentPage.appendChild(contentFrame)

    //目录标题
    var contentText = figma.createText()
    contentText.fontName = myFont
    contentText.characters = pageName
    contentText.fontSize = 24
    contentText.layoutAlign = 'STRETCH' //宽度 Fill container
    contentText.setRangeLineHeight(0, pageName.length, { value: 40, unit: 'PIXELS' })
    contentText.locked = true
    //将目标标题添加到 Frame 中
    contentFrame.appendChild(contentText)



    //初始化 Frame
    // for(var i = 0;i<contentFrame.children.length;i++){
    //   contentFrame.children[i].remove()
    // }




    //渲染目录内容
    var tableOfContensIndex = 0 // 记录目录数量
    for (var i = 0; i < pages.length; i++) {
      // 遍历所有页面
      if (pages[i].name == pageName) {
        continue
      }

      console.log('pages[i]:');
      console.log(pages[i].name);

      var frameNode = null
      var leftTop = 3.14159265359

      //设置 text 图层 链接
      var targetLayers = pages[i].findAll(n => n.name === selectionLayerName && n.type === 'FRAME')
      var targetLayersChildren
      console.log('targetLayers:');
      console.log(targetLayers);

      if (targetLayers.length > 0) {

        console.log('targetLayers.length：=========');
        console.log(targetLayers.length);

        //渲染当前页面标题
        var pageTitle = figma.createText()
        pageTitle.fontName = myFont
        pageTitle.characters = pages[i].name //文本值为页面名称
        pageTitle.fontSize = 12
        pageTitle.layoutAlign = 'STRETCH' //宽度 Fill container
        pageTitle.setRangeFills(0, pageTitle.characters.length, [{ blendMode: "NORMAL", color: { r: 0, g: 0, b: 0 }, opacity: 0.3, type: "SOLID", visible: true }])
        // pageTitle.setRangeLineHeight(0, pageTitle.characters, { value: 120, unit: 'PIXELS' })
        pageTitle.locked = true
        contentFrame.appendChild(pageTitle)

        // 遍历目标图层（图层名称等于当前选中图层的名称）
        console.log('targetLayers[j]:')
        for (var j = 0; j < targetLayers.length; j++) {
          
          tableOfContensIndex+=1 
          console.log(targetLayers[j].type)

          // 如果图层类型不是 FRAME 则忽略
          if (targetLayers[j].type != 'FRAME') {
            continue
          }

          //渲染修订信息
          var tableChildren = figma.createText()
          tableChildren.fontName = myFont
          tableChildren.characters = ''
          // 如果目标图层下无文本图层

          targetLayersChildren = targetLayers[j]['children']


          if (targetLayersChildren != null) {
            // 如果目标图层存在子图层
            for (var c = 0; c < targetLayersChildren.length; c++) {

              // 判断子图层是否为文本图层
              if (targetLayersChildren[c].type == 'TEXT') {
                // 若是则获取文本图层的字符信息赋值给新图层
                console.log("11targetLayersChildren[c].type == 'TEXT'")
                tableChildren.characters = '【'+tableOfContensIndex.toString() + '】 ' + targetLayersChildren[c].characters.substring(0, 28) + '...↗'
                console.log(tableChildren.characters)
                break
              } else {
                // 不是文本图层
                continue
                // targetLayersChildren = targetLayersChildren[c]['children']
              }

            }
          } else {
            // 如果目标图层不存在子图层，设置新图层的字符信息 = 目标图层的名称
            tableChildren.characters = '【'+tableOfContensIndex.toString() + '】 ' + targetLayers[j].name + ' ↗'
            break
          }

          // 如果子图层中不存在字符
          if (tableChildren.characters == '') {
            tableChildren.characters = '【'+tableOfContensIndex.toString() + '】 ' + targetLayers[j].name + ' ↗'
          }


          console.log('figma.currentPage.findChildren(n => n.type === "FRAME"):')
          console.log(figma.currentPage.findChildren(n => n.type === "FRAME")[0])
          console.log(targetLayers[j]['children'])
          // tableChildren.characters = targetLayers[j].name

          // // 设置目录节点的文字信息
          // if (targetLayers[j].findChildren(n => n.type === "TEXT") == null) {
          //   tableChildren.characters = targetLayers[j].name
          // } else {
          //   //文本值
          //   tableChildren.characters = targetLayers[j].findOne(n => n.type === "TEXT").characters.length > 60 ? targetLayers[j].findOne(n => n.type === "TEXT").characters.substring(0, 60) + '...↗' : targetLayers[j].findOne(n => n.type === "TEXT").characters + '↗'
          // }

          // console.log("figma.currentPage.selection[0].hasOwnProperty('children'):")
          // console.log(figma.currentPage.selection[0])
          // console.log(figma.currentPage.selection[0].hasOwnProperty('children'))
          // console.log(targetLayers[j].toString())
          // console.log(targetLayers[j].type)
          // console.log(targetLayers[j].hasOwnProperty('children'))

          tableChildren.setRangeFills(0, tableChildren.characters.length, [{ blendMode: "NORMAL", color: { r: 0, g: 0, b: 0 }, opacity: 0.8, type: "SOLID", visible: true }])

          // console.log('targetLayers[j]:');
          // console.log(targetLayers[j].type);
          // console.log('targetLayers[j].findAll(n => n.type === "TEXT"):');
          // console.log(targetLayers[j].findOne(n => n.type === "TEXT").characters);

          tableChildren.layoutAlign = 'STRETCH' //宽度 Fill container
          tableChildren.fontSize = 12
          // tableChildren.setRangeLineHeight(0, tableChildren.characters.length, { value: 24, unit: 'PIXELS' })

          // tableChildren.textDecoration = 'UNDERLINE'

          tableChildren.hyperlink = { "type": "NODE", "value": targetLayers[j].id }
          contentFrame.appendChild(tableChildren)
        }
      }


      //如果未选中任何图层
      // for (var k = 0; k < pages[i].children.length; k++) {

      //   if (pages[i].children[k].type == 'FRAME') {
      //     console.log("pages[i].children[k].type == 'FRAME'");
      //     console.log('pages[i].children[k]:');
      //     console.log(pages[i].children[k].name);


      //     //获取左上角的 Frame 作为锚点
      //     if (leftTop == 3.14159265359) {
      //       leftTop = pages[i].children[k].x + pages[i].children[k].y
      //       frameNode = pages[i].children[k].id
      //     } else {
      //       if (pages[i].children[k].x + pages[i].children[k].y < leftTop) {
      //         leftTop = pages[i].children[k].x + pages[i].children[k].y
      //         frameNode = pages[i].children[k].id
      //         console.log('设置 framNODE');

      //       }
      //     }
      //     console.log('leftTop:');
      //     console.log(leftTop);


      //   }

      // }

      // if (frameNode == null) {
      //   // frameNode = ''
      // } else {
      //   contentText.textDecoration = 'UNDERLINE'
      //   contentText.hyperlink = { "type": "NODE", "value": frameNode }
      // }
    }
    console.log(contentFrame.children);
    // contentFrame.locked=true
    // contentPage.selection = [contentFrame]
    figma.notify('✅ 11 Has been updated to page ' + pageName)
    figma.closePlugin();
  } else {
    //提示没有找到相同的图层
    // figma.notify('⚠️ ' + pageName+'Not Found')
    var layerName = figma.currentPage.selection[0].name.length > 9 ? figma.currentPage.selection[0].name.substring(0, 8) + '...' : figma.currentPage.selection[0].name
    figma.ui.postMessage({ 'selectionName': figma.currentPage.selection[0].name, 'erroMsg': '⚠️ ' + layerName + 'FRAME Not Found' })
  }

}


async function myLoadFontAsync(myFont) {
  await figma.loadFontAsync(myFont)
}

function myFindOne(node) {

  //  如果当前节点下存在子节点
  if (node.children.length > 0) {
    for (var i = 0; i < node.children.length; i++) {
      // 如果节点的类型为 TEXT
      if (node.children[i].type == 'TEXT') {
        return node.children[i]
      }
    }

    return null
  }
}