/// <reference path="../node_modules/@figma/plugin-typings/index.d.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var selection = []; // 记录当前选中的图层
//@ts-ignore
figma.skipInvisibleInstanceChildren = true;
// 显示 UI
figma.showUI(__html__, { width: 300, height: 300 });
console.log('0420');
// 初始化 UI
onChange();
// 根据选中状态渲染 UI
function onChange() {
    console.log('183code.ts:selectionchange');
    selection = figma.currentPage.selection;
    if (figma.currentPage.selection.length == 1) {
        // UI 中显示选中的图层名称
        figma.ui.postMessage({ 'selectionName': figma.currentPage.selection[0].name, 'erroMsg': '' });
    }
    else if (figma.currentPage.selection.length > 1) {
        figma.ui.postMessage({ 'selectionName': 'Multi-select', 'erroMsg': '' });
    }
    else {
        figma.ui.postMessage({ 'selectionName': '', 'erroMsg': '' });
    }
    // 如果选中的不是 FRAME
}
// 监听选中变化事件
figma.on('selectionchange', onChange);
// { 'family': 'OPPOSans', 'style': 'Regular' }
var pageName = '📄 Table of contents'; //目录页面默认名称
var frameName = 'Table of contents'; //Frame 图层默认名称
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
    main(msg.data);
};
// 设置目录的字体
function setFontName() {
    //查找当前选中图层中的文本图层，获取起字体作为默认字体 ==============================
    let fristText;
    let myFont;
    //如果当前有选中图层
    if (selection.length > 0) {
        for (let i = 0; i < selection.length; i++) {
            //取当前选中图层的首个文字作为默认字体
            fristText = myFindOne(selection[i]);
            // console.log('fristText:');
            // console.log(fristText);
            if (fristText != undefined && fristText != null) {
                myFont = fristText.fontName;
                continue;
            }
        }
    }
    // 容错：如果当前页面没有文本图层
    if (myFont == null) {
        //获取首页的首个字体作为默认字体
        fristText = figma.root.findOne(n => n.type === 'TEXT');
        if (fristText == null) {
            //没有找到文本浮层
            figma.notify('❌ Please try again after adding a text layer to any page');
            figma.closePlugin();
        }
        else {
            myFont = fristText.fontName;
        }
    }
    // console.log('setFontName:');
    // console.log(myFont);
    return myFont;
}
// 设置目录 Frame 的标题、位置
function setFrame(pageName, frameName, font, isMultiSelect) {
    let pages = figma.root.children;
    //创建页面 ==============================
    var contentPage = null;
    var contentFrame = null;
    //判断是否已存在页面，若存在则更新
    for (let j = 0; j < pages.length; j++) {
        if (pages[j].name == pageName) {
            contentPage = pages[j];
            //判断页面下是否存在目录 FRAME
            if (isMultiSelect != true) {
                // 多选图层时，永远新建目录 Frame
                for (let i = 0; i < contentPage.children.length; i++) {
                    if (contentPage.children[i].name == frameName) {
                        contentFrame = contentPage.children[i];
                        break;
                    }
                }
            }
        }
        if (contentFrame != null) {
            break;
        }
    }
    var old_frame_absoluteRenderBounds = null; // 记录老目录图层的位置
    if (contentPage == null) {
        //不存在页面，新建
        contentPage = figma.createPage();
        figma.root.insertChild(0, contentPage);
    }
    if (contentFrame == null) {
        //不存在 Frame，新建
        contentFrame = figma.createFrame();
    }
    else {
        // 已存在 Frame
        // 获取 Frame 的位置，更新后放入原来的位置
        old_frame_absoluteRenderBounds = { 'x': contentFrame.absoluteRenderBounds.x, 'y': contentFrame.absoluteRenderBounds.y };
        contentFrame.remove(); // 删除旧目录
        contentFrame = figma.createFrame(); // 创建新的图层容纳目录
    }
    //设置页面
    contentPage.name = pageName;
    //设置 frame 容器
    contentFrame.name = frameName;
    contentFrame.layoutMode = 'VERTICAL'; //自动布局（垂直方向）
    contentFrame.itemSpacing = 14; //间距
    contentFrame.resize(400, 1000);
    contentFrame.counterAxisSizingMode = 'FIXED';
    contentFrame.primaryAxisSizingMode = 'AUTO';
    contentFrame.paddingLeft = 20;
    contentFrame.paddingTop = 20;
    contentFrame.paddingRight = 20;
    contentFrame.paddingBottom = 20;
    contentFrame.cornerRadius = 8;
    // 设置 frame 容器的位置
    if (old_frame_absoluteRenderBounds != null) {
        // 如果目录 frame 已存在
        contentFrame.x = old_frame_absoluteRenderBounds.x;
        contentFrame.y = old_frame_absoluteRenderBounds.y;
    }
    else {
        // 如果目录 frame 不存在
        var max_x = -100000000; // 记录当前页面下，所有图层中 X 的最大值
        var right_frame = null;
        for (var j = 0; j < contentPage.children.length; j++) {
            if (contentPage.children[j].x > max_x) {
                max_x = contentPage.children[j].x;
                right_frame = contentPage.children[j];
            }
        }
        if (right_frame == null) {
            contentFrame.x = 0;
            contentFrame.y = 0;
        }
        else {
            contentFrame.x = max_x + right_frame.width + 40;
            contentFrame.y = right_frame.y;
        }
    }
    //将 Frame 添加到页面中
    contentPage.appendChild(contentFrame);
    //目录标题
    var contentText = figma.createText();
    contentText.fontName = font;
    contentText.characters = frameName;
    contentText.fontSize = 24;
    contentText.layoutAlign = 'STRETCH'; //宽度 Fill container
    contentText.setRangeLineHeight(0, frameName.length, { value: 40, unit: 'PIXELS' });
    // contentText.locked = true
    //将目标标题添加到 Frame 中
    contentFrame.appendChild(contentText);
    return contentFrame;
}
// 渲染目录内容
function setContent(contentFrame, targetLayers, font, index) {
    //渲染修订信息 ==============================
    var tableChildren = figma.createText();
    tableChildren.fontName = font;
    tableChildren.characters = '';
    // 如果目标图层下无文本图层
    var targetLayersChildren;
    targetLayersChildren = targetLayers['children'];
    // 在图层下查找文本图层
    var textChildren = myFindOne(targetLayers);
    // 如果有找到文本图层
    if (textChildren != undefined) {
        tableChildren.characters = index.toString() + ') ' + textChildren.characters.substring(0, 28) + '...↗';
    }
    else {
        // 如果没有找到文本图层，设置新图层的字符信息 = 目标图层的名称
        tableChildren.characters = index.toString() + ') ' + targetLayers.name + ' ↗';
    }
    // 文字颜色
    tableChildren.setRangeFills(0, tableChildren.characters.length, [{ blendMode: "NORMAL", color: { r: 0, g: 0, b: 0 }, opacity: 0.8, type: "SOLID", visible: true }]);
    // 宽度 Fill container
    tableChildren.layoutAlign = 'STRETCH';
    // 字号
    tableChildren.fontSize = 12;
    // 链接
    tableChildren.hyperlink = { "type": "NODE", "value": targetLayers.id };
    contentFrame.appendChild(tableChildren);
}
// 设置所在页面标题
function setPageTitle(pageName, font) {
    let pageTitle = figma.createText();
    pageTitle.fontName = font;
    pageTitle.characters = pageName; //文本值为页面名称
    pageTitle.fontSize = 12;
    pageTitle.layoutAlign = 'STRETCH'; //宽度 Fill container
    pageTitle.setRangeFills(0, pageTitle.characters.length, [{ blendMode: "NORMAL", color: { r: 0, g: 0, b: 0 }, opacity: 0.3, type: "SOLID", visible: true }]);
    pageTitle.locked = true;
    return pageTitle;
}
//主逻辑
function main(selectionLayerName) {
    return __awaiter(this, void 0, void 0, function* () {
        selectionLayerName = selection[0]['name'];
        pageName = '📄 ' + 'Table of contents';
        frameName = '📄 ' + selectionLayerName;
        if (selection.length > 1) {
            console.log('选中多个图层1');
            frameName = pageName;
            // 设置目录的字体 ==============================
            console.log('setFontName');
            let myFont = setFontName();
            console.log('myLoadFontAsync');
            //加载字体 ==============================
            yield myLoadFontAsync(myFont).then(() => {
                console.log('myLoadFontAsync done');
            });
            console.log('thisPageName:');
            let thisPageName = figma.currentPage.name;
            console.log('thisPageName:' + thisPageName);
            // 设置目录 Frame 的标题、位置 ==============================
            let contentFrame = setFrame(pageName, frameName, myFont, true);
            //渲染所在页面标题 ==============================
            let pageTitle = setPageTitle(thisPageName, myFont);
            contentFrame.appendChild(pageTitle);
            // 记录目录的数量
            let count = 0;
            //渲染目录内容 ==============================
            for (let i = 0; i < selection.length; i++) {
                // 遍历目标图层（图层名称等于当前选中图层的名称）
                // 如果图层类型不是 FRAME 则忽略，同时忽略组件下的图层
                if (selection[i].type != 'FRAME' || selection[i].id.indexOf('I') >= 0) {
                    continue;
                }
                // 渲染目录内容
                setContent(contentFrame, selection[i], myFont, count += 1);
            }
            console.log('done');
            figma.notify('✅ Has been updated to page ' + pageName);
            figma.closePlugin();
        }
        else {
            console.log('只选中 1 个图层 ========== ');
            // 只选中 1 个图层
            //如果选中是目录本身，则支持更新目录 ==============================
            if (selectionLayerName.indexOf('📄 ') >= 0) {
                selectionLayerName = selectionLayerName.replace('📄 ', '');
                frameName = '📄 ' + selectionLayerName;
            }
            // 设置目录的字体 ==============================
            let myFont = setFontName();
            //加载字体 ==============================
            yield myLoadFontAsync(myFont);
            // 设置目录 Frame 的标题、位置 ==============================
            let contentFrame = setFrame(pageName, frameName, myFont, false);
            //渲染目录内容 ==============================
            var tableOfContensIndex = 0; // 记录目录数量
            var p = new Promise((resolve) => {
                let pages = figma.root.children;
                for (var i = 0; i < pages.length; i++) {
                    // 遍历所有页面
                    let page = pages[i];
                    // 跳过目录所在页
                    if (page.name == pageName) {
                    }
                    else {
                        var frameNode = null;
                        var targetLayers;
                        // 查找名称与选中图层相同的 FRAME 图层
                        targetLayers = page.findAll(n => n.name === selectionLayerName && n.type === 'FRAME');
                        // 如果名称与选中图层相同的 FRAME 图层数量 > 0
                        if (targetLayers.length > 0) {
                            //渲染所在页面标题 ==============================
                            let pageTitle = setPageTitle(page.name, myFont);
                            contentFrame.appendChild(pageTitle);
                            // 遍历目标图层（图层名称等于当前选中图层的名称）
                            for (var j = 0; j < targetLayers.length; j++) {
                                // 如果图层类型不是 FRAME 则忽略，同时忽略组件下的图层
                                if (targetLayers[j].type != 'FRAME' || targetLayers[j].id.indexOf('I') >= 0) {
                                    continue;
                                }
                                tableOfContensIndex += 1;
                                // 渲染目录内容
                                setContent(contentFrame, targetLayers[j], myFont, tableOfContensIndex);
                            }
                        }
                    }
                }
                console.log('p for end');
                resolve('Success!');
            }).then(() => {
                console.log('done');
                figma.notify('✅ Has been updated to page ' + pageName);
                figma.closePlugin();
            });
        }
    });
}
function myLoadFontAsync(myFont) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('myLoadFontAsync ======');
        console.log(myFont);
        yield figma.loadFontAsync(myFont).then(() => {
            console.log('loadFontAsync done');
        });
        console.log('myLoadFontAsync end ======');
    });
}
// 查找图层下的文本图层，输入 figma 图层对象，返回找到的 1 个文本图层
function myFindOne(node) {
    var tagetNode;
    // console.log('myFindOne');
    var thisChildren = node.children;
    //  如果当前节点下存在子节点
    if (thisChildren == undefined) {
        return null;
    }
    for (var i = 0; i < thisChildren.length; i++) {
        // console.log('thisChildren:')
        // console.log(thisChildren);
        // 如果节点的类型为 TEXT
        if (thisChildren[i].type == 'TEXT') {
            // console.log('return thisChildren[i]:');
            // console.log(thisChildren[i]);
            return thisChildren[i];
        }
        //如果包含子图层
        if (thisChildren[i].children != null) {
            if (thisChildren[i].children.length > 0) {
                // console.log('递归');
                tagetNode = myFindOne(thisChildren[i]);
            }
        }
    }
    return tagetNode;
}
