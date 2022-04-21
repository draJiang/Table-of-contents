import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './ui.css';
// window.onmessage = selection => {
//   let message = selection.data.pluginMessage;
//   console.log('window.onmessage:');
//   console.log(message);
// }
//空数据组件
function EmptyData(props) {
    return (React.createElement("div", { className: 'emptyData' },
        React.createElement("img", { src: require('./empty.png') }),
        React.createElement("p", { className: 'info' }, props.msg)));
}
;
//有数据组件
function HaveData(props) {
    return (React.createElement("div", { className: 'haveData' },
        React.createElement("div", { className: 'haveDataBox' }, props.layerName),
        React.createElement("p", { className: 'info' }, props.msg)));
}
;
//底部按钮
class BottomBtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        // ln: this.props.ln,
        // value: this.props.value,
        // layerName: this.props.layerName,
        // disable: this.props.disable
        };
    }
    handleClick() {
        // 执行 BottomBtn 组件的 handleBtnClick 方法
        console.log('BottomBtn handleClick');
        // console.log(this);
        // console.log(this.props);
        this.props.bottomBtnHandleClick();
    }
    render() {
        // 如果传来的属性 disable == true（置灰）
        console.log('this.state.disable:');
        // console.log(this.state.disable);
        // console.log(this.state);
        // console.log(this.props);
        if (this.props.disable == true) {
            return (React.createElement(DisableBtn, { value: this.props.value }));
        }
        return (
        // 可点击状态
        React.createElement(Btn, { BtnHandleClick: this.handleClick.bind(this), value: this.props.value, ln: this.props.layerName }));
    }
}
//加载状态的按钮？
//置灰按钮
function DisableBtn(props) {
    return (React.createElement("div", { className: 'bottomBtnDiv' },
        React.createElement("input", { className: 'DisableBtn', type: 'button', value: props.value })));
}
;
//普通按钮
class Btn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ln: props.ln,
            value: props.value
        };
    }
    handleClick() {
        console.log('Btn handleClick');
        // console.log(this);
        // console.log(this.props);
        // 执行 Btn 组件的 handleClick 方法
        this.props.BtnHandleClick();
        // console.log(a);
        //给 code.ts 发消息
        // parent.postMessage('hello,my name is UI.tsx')
        // parent.postMessage({ pluginMessage: { type: 'Run', data: this.props.ln } }, '*')
    }
    render() {
        return (React.createElement("div", { className: 'bottomBtnDiv' },
            React.createElement("input", { onClick: this.handleClick.bind(this), className: 'Btn', type: 'button', value: this.state.value })));
    }
}
//错误提示组件
class ShowErroMsg extends React.Component {
    constructor(props) {
        super(props);
        this.state = { msg: this.props.msg };
    }
    render() {
        console.log('this.state.msg:======');
        // console.log(this.state.msg);
        // console.log(this.props.msg);
        if (this.props.msg == '') {
            return (React.createElement("div", { className: 'erroMsgHidden' }));
        }
        else {
            return (React.createElement("div", { className: 'erroMsg' }, this.props.msg));
        }
    }
}
//调度组件，用于条件渲染
class ShowUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = { layerName: '', erroMsg: '', loading: false };
    }
    //组件创建时
    componentDidMount() {
        // code.ts 发来消息
        onmessage = (event) => {
            // console.log(event.data.pluginMessage);
            console.log('onmessage');
            var selectionName = event.data.pluginMessage.selectionName;
            var msg = event.data.pluginMessage.erroMsg;
            if (selectionName != '') {
                // selection = event.data.pluginMessage[0].name
            }
            else {
                // selection = '空'
            }
            // console.log('selectionName:');
            // console.log(selectionName);
            this.setState({
                layerName: selectionName,
                erroMsg: msg
            });
            console.log('ShowUI-this.state.layerName:');
            // console.log(this.state.layerName);
        };
    }
    handleBtnClick() {
        // 点击运行时
        console.log('ShowUI handleBtnClick');
        // console.log(this);
        this.setState({
            loading: true,
        }, () => {
            setTimeout(() => {
                parent.postMessage({ pluginMessage: { type: 'Run', data: 'undefined' } }, '*');
            }, 15);
        });
    }
    render() {
        // console.log('this.state.layerName:');
        // console.log(this.state.layerName);
        if (this.state.loading) {
            console.log('this.state.loading');
            return (
            //渲染加载中界面
            React.createElement("div", null,
                React.createElement(ShowErroMsg, { msg: this.state.erroMsg }),
                React.createElement(HaveData, { msg: 'Run will generate directory', layerName: this.state.layerName }),
                React.createElement(BottomBtn, { disable: true, value: 'Running' })));
        }
        if (this.state.layerName == '') {
            console.log('this.state.layerName =="" ');
            return (
            //渲染空数据界面
            React.createElement("div", null,
                React.createElement(ShowErroMsg, { msg: this.state.erroMsg }),
                React.createElement(EmptyData, { msg: 'Please select a layer' }),
                React.createElement(BottomBtn, { disable: true, value: 'Run' })));
        }
        return (
        //渲染有数据界面
        React.createElement("div", null,
            React.createElement(ShowErroMsg, { msg: this.state.erroMsg }),
            React.createElement(HaveData, { msg: 'Run will generate directory', layerName: this.state.layerName }),
            React.createElement(BottomBtn, { bottomBtnHandleClick: this.handleBtnClick.bind(this), disable: false, value: 'Run', layerName: this.state.layerName })));
    }
}
;
// console.log('selectionName:');
// console.log(selectionName);
const element = React.createElement(ShowUI, null);
ReactDOM.render(element, document.getElementById('react-page'));
