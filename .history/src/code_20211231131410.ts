/// <reference path="../node_modules/@figma/plugin-typings/index.d.ts" />

// 显示 UI
figma.showUI(__html__, { width: 300, height: 300 });

// 初始化 UI
onChange()
// if (figma.currentPage.selection.length > 0) {
//   // UI 中显示选中的图层名称
//   figma.ui.postMessage({ 'selectionName': figma.currentPage.selection[0].name, 'erroMsg': '' })
// } else {
//   figma.ui.postMessage({ 'selectionName': '', 'erroMsg': '' })
// }

// 根据选中状态渲染 UI
function onChange() {
  console.log('183code.ts:selectionchange');

  if (figma.currentPage.selection.length > 0) {
    // UI 中显示选中的图层名称
    figma.ui.postMessage({ 'selectionName': figma.currentPage.selection[0].name, 'erroMsg': '' })
  } else {
    figma.ui.postMessage({ 'selectionName': '', 'erroMsg': '' })
  }

  // 如果选中的不是 FRAME
}

// 监听选中变化事件
figma.on('selectionchange', onChange)


var myFont = null //字体
// { 'family': 'OPPOSans', 'style': 'Regular' }
var pageName = '📄 Table of contents' //目录页面默认名称
var frameName = 'Table of contents' //Frame 图层默认名称


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
  console.log('11code.ts-figma.ui.onmessage:');
  // console.log(msg);
  

  // console.log(msg);
  // console.log(msg.data);

  main(msg.data)


  // figma.closePlugin();
};


//主逻辑
async function main(selectionLayerName) {


  //如果选中是目录本身，则支持更新目录
  if (selectionLayerName.indexOf('📄 ') >= 0) {
    selectionLayerName = selectionLayerName.replace('📄 ', '')
  }
  
  // console.log("selectionLayerName:");
  // console.log(selectionLayerName);


  pageName = '📄 ' + 'Table of contents'
  frameName = '📄 ' + selectionLayerName


  //查找当前选中图层中的文本图层，获取起字体作为默认字体
  var fristText


  //如果当前有选中图层
  if (figma.currentPage.selection.length > 0) {

    //取当前选中图层的首个文字作为默认字体
    fristText = myFindOne(figma.currentPage.selection[0])
    // figma.currentPage.findOne(n => n.type === "TEXT")

    // console.log('fristText = figma.currentPage.selection[0].findOne(n => n.type === "TEXT")');
    // console.log(fristText);

    if (fristText != null) {
      myFont = fristText.fontName
    }
  }

  // 容错：如果当前页面没有文本图层
  if (myFont == null) {
    //获取首页的首个字体作为默认字体
    fristText = figma.root.findOne(n => n.type === 'TEXT')

    if (fristText == null) {
      //没有找到文本浮层
      figma.notify('❌ Please try again after adding a text layer to any page')
      figma.closePlugin()
    } else {
      //存在文本浮层
      // console.log(fristText);
      // console.log(fristText.name);

      myFont = fristText.fontName
      // { 'family': 'OPPOSans', 'style': 'Regular' }

    }
  }


  //加载字体
  await myLoadFontAsync(myFont)

  var pages = figma.root.children


  // var targetFrame = figma.root.findAll(n => n.name === selectionLayerName && n.type === 'FRAME')
  // 找到文档中所有与选中图层同名的图层
  // var targetLyaer = figma.root.findAll(n => n.name === selectionLayerName)
  // console.log('2021-11-25 targetFrame==============');
  // console.log(targetLyaer);

  //相同名称的图层数>0 才执行
  // if (targetLyaer.length > 0) {

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
  contentText.characters = frameName
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

    // console.log('pages[i]:');
    // console.log(pages[i].name);

    var frameNode = null
    var leftTop = 3.14159265359

    
    // var targetLayers = pages[i].findAll(n => n.name === selectionLayerName && n.type === 'FRAME')

    // 查找名称与选中图层相同的 FRAME 图层
    var targetLayers = pages[i].findAll(n => n.name === selectionLayerName && n.type === 'FRAME')
    var targetLayersChildren

    // console.log('targetLayers:');
    // console.log(targetLayers);

    // 如果名称与选中图层相同的 FRAME 图层数量 > 0
    if (targetLayers.length > 0) {

      // console.log('targetLayers.length：=========');
      // console.log(targetLayers.length);

      //渲染目录标题
      var pageTitle = figma.createText()
      pageTitle.fontName = myFont
      pageTitle.characters = frameName //文本值为页面名称
      pageTitle.fontSize = 12
      pageTitle.layoutAlign = 'STRETCH' //宽度 Fill container
      pageTitle.setRangeFills(0, pageTitle.characters.length, [{ blendMode: "NORMAL", color: { r: 0, g: 0, b: 0 }, opacity: 0.3, type: "SOLID", visible: true }])
      // pageTitle.setRangeLineHeight(0, pageTitle.characters, { value: 120, unit: 'PIXELS' })
      pageTitle.locked = true
      contentFrame.appendChild(pageTitle)

      // 遍历目标图层（图层名称等于当前选中图层的名称）
      
      for (var j = 0; j < targetLayers.length; j++) {


        // 如果图层类型不是 FRAME 则忽略
        if (targetLayers[j].type != 'FRAME') {
          continue
        }

        tableOfContensIndex += 1

        //渲染修订信息
        var tableChildren = figma.createText()
        tableChildren.fontName = myFont
        tableChildren.characters = ''
        // 如果目标图层下无文本图层

        targetLayersChildren = targetLayers[j]['children']

        // 在图层下查找文本图层
        var textChildren = myFindOne(targetLayers[j])
        
        // console.log('textChildren:');
        // console.log(textChildren);

        // 如果有找到文本图层
        if (textChildren != undefined) {
          tableChildren.characters = '【' + tableOfContensIndex.toString() + '】 ' + textChildren.characters.substring(0, 28) + '...↗'
        } else {
          // 如果没有找到文本图层，设置新图层的字符信息 = 目标图层的名称
          tableChildren.characters = '【' + tableOfContensIndex.toString() + '】 ' + targetLayers[j].name + ' ↗'
        }

        // console.log('figma.currentPage.findChildren(n => n.type === "FRAME"):')
        // console.log(figma.currentPage.findChildren(n => n.type === "FRAME")[0])
        // console.log(targetLayers[j]['children'])
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

        // 文字颜色
        tableChildren.setRangeFills(0, tableChildren.characters.length, [{ blendMode: "NORMAL", color: { r: 0, g: 0, b: 0 }, opacity: 0.8, type: "SOLID", visible: true }])

        // console.log('targetLayers[j]:');
        // console.log(targetLayers[j].type);
        // console.log('targetLayers[j].findAll(n => n.type === "TEXT"):');
        // console.log(targetLayers[j].findOne(n => n.type === "TEXT").characters);

        // 宽度 Fill container
        tableChildren.layoutAlign = 'STRETCH' 
        // 字号
        tableChildren.fontSize = 12
        // 链接
        tableChildren.hyperlink = { "type": "NODE", "value": targetLayers[j].id }

        contentFrame.appendChild(tableChildren)
      }
    }

  }
  
  // console.log(contentFrame.children);

  // contentFrame.locked=true
  // contentPage.selection = [contentFrame]
  figma.notify('✅ Has been updated to page ' + pageName)
  figma.closePlugin();
  // }
  // else {
  //   //提示没有找到相同的图层
  //   // figma.notify('⚠️ ' + pageName+'Not Found')
  //   var layerName = figma.currentPage.selection[0].name.length > 9 ? figma.currentPage.selection[0].name.substring(0, 8) + '...' : figma.currentPage.selection[0].name
  //   figma.ui.postMessage({ 'selectionName': figma.currentPage.selection[0].name, 'erroMsg': '⚠️ ' + layerName + 'FRAME Not Found' })
  // }

}


async function myLoadFontAsync(myFont) {
  await figma.loadFontAsync(myFont)
}

// 查找图层下的文本图层，输入 figma 图层对象，返回找到的 1 个文本图层
function myFindOne(node) {

  var tagetNode
  
  // console.log('myFindOne');

  var thisChildren = node.children
  //  如果当前节点下存在子节点

  for (var i = 0; i < thisChildren.length; i++) {
    
    // console.log('thisChildren:')
    // console.log(thisChildren);

    // 如果节点的类型为 TEXT
    if (thisChildren[i].type == 'TEXT') {

      // console.log('return thisChildren[i]:');
      // console.log(thisChildren[i]);

      return thisChildren[i]
    }

    //如果包含子图层
    if (thisChildren[i].children != null) {

      if (thisChildren[i].children.length > 0) {
        
        // console.log('递归');
        
        tagetNode = myFindOne(thisChildren[i])
      }
    }


  }

  return tagetNode
}