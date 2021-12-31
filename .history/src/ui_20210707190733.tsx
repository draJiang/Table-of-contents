import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './ui.css'

declare function require(path: string): any

// window.onmessage = selection => {
//   let message = selection.data.pluginMessage;
//   console.log('window.onmessage:');
//   console.log(message);
// }

//空数据组件
function EmptyData(props) {
  return (
    <div className='emptyData'>
      <img src={require('./empty.png')} />
      {/* <div className='emptyDataBox'></div> */}
      <p className='info'>{props.msg}</p>
    </div>
  );
};

//有数据组件
function HaveData(props) {
  return (
    <div className='haveData'>
      <div className='haveDataBox'>
        {props.layerName}
      </div>
      <p className='info'>{props.msg}</p>
    </div>

  );
};

//底部按钮
function BottomBtn(props) {
  console.log('BottomBtn-props.layerName:');
  console.log(props.layerName);


  if (props.disable == 'true') {
    return (
      <DisableBtn value={props.value} />
    )

  }

  return (
    <Btn value={props.value} ln={props.layerName} />
  )

};

//加载状态的按钮？

//置灰按钮
function DisableBtn(props) {
  return (
    <div className='bottomBtnDiv'>
      <input className='DisableBtn' type='button' value={props.value} />
    </div>
  )
};

//普通按钮
class Btn extends React.Component
  <
  {
    value?: string
    ln?: string
  },
  {
    ln?: string
    value?: string
  }
>
{

  constructor(props) {
    super(props);
    this.state = {
      ln: props.ln,
      value: props.value
    };
  }

  handleClick(this) {
    console.log('handleClick：');
    console.log(this);
    console.log(this.props.ln);
    console.log(this.props.value);
    // console.log(a);
    //给 code.ts 发消息
    // parent.postMessage('hello,my name is UI.tsx')
    parent.postMessage({ pluginMessage: { type: 'Run', data: this.props.ln } }, '*')

  }

  render() {
    return (
      <div className='bottomBtnDiv'>
        <input onClick={this.handleClick.bind(this)} className='Btn' type='button' value={this.state.value} />
      </div>
    )
  }
}

//错误提示组件
class ShowErroMsg extends React.Component
  <{
    msg?: string
  },
  {
    msg?: string
  }
>
{
  constructor(props) {
    super(props);
    this.state = { msg: this.props.msg };
  }

  render() {

    console.log('this.state.msg:======');
    console.log(this.state.msg);
    console.log(this.props.msg);

    if (this.props.msg == '') {



      return (
        <div className='erroMsgHidden'></div>
      )
    } else {
      return (
        <div className='erroMsg'>{this.props.msg}</div>
      )
    }
  }


}

//调度组件，用于条件渲染
class ShowUI extends React.Component
  <{},
  {
    layerName?: string
    erroMsg?: string
  }>
{

  constructor(props) {
    super(props);
    this.state = { layerName: '', erroMsg: '' };
  }

  //组件创建时
  componentDidMount() {

    // code.ts 发来消息
    onmessage = (event) => {
      console.log(event.data.pluginMessage);
      console.log('onmessage');

      var selectionName = event.data.pluginMessage.selectionName
      var msg = event.data.pluginMessage.erroMsg

      if (selectionName != '') {
        console.log('非空');
        console.log(selectionName);

        // selection = event.data.pluginMessage[0].name
      } else {
        console.log('空');

        // selection = '空'
      }

      console.log('selectionName:');
      console.log(selectionName);
      this.setState({
        layerName: selectionName,
        erroMsg: msg
      })

      console.log('ShowUI-this.state.layerName:');
      console.log(this.state.layerName);


    }
  }


  render() {

    if (this.state.layerName == '') {
      return (
        //渲染空数据界面
        <div>
          <ShowErroMsg msg={this.state.erroMsg} />
          <EmptyData msg='Please select a layer' />
          <BottomBtn disable='true' value='Run' />
        </div>
      )
    }

    return (
      //渲染有数据界面
      <div>
        <ShowErroMsg msg={this.state.erroMsg} />
        <HaveData msg='Run will generate directory' layerName={this.state.layerName} />
        <BottomBtn disable='false' value='Run' layerName={this.state.layerName} />
      </div>
    )
  }
};

// console.log('selectionName:');
// console.log(selectionName);
const element = <ShowUI />

ReactDOM.render(
  element,
  document.getElementById('react-page')
)