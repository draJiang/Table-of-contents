import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './ui.css'
// import { selectMenu, disclosure } from 'figma-plugin-ds';


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
      {/* {checkbox} */}
    </div>

  );
};

//底部按钮
class BottomBtn extends React.Component
  <
    {
      ln?: string
      value?: string
      disable?: Boolean
      layerName?: string
      bottomBtnHandleClick?: Function
      handleSetting?: Function
      selectionLength?: number
      seting_set_frame_name?:boolean
    },
    {
      ln?: string
      value?: string
      disable?: Boolean
      layerName?: string
      bottomBtnHandleClick?: Function
    }
  >
{
  constructor(props) {
    super(props);
    this.state = {
      // ln: this.props.ln,
      // value: this.props.value,
      // layerName: this.props.layerName,
      // disable: this.props.disable
    };
  }

  handleClick(this) {
    // 执行 BottomBtn 组件的 handleBtnClick 方法
    console.log('BottomBtn handleClick');
    // console.log(this);
    // console.log(this.props);

    this.props.bottomBtnHandleClick()

  }

  // 设置按钮点击事件
  handleSetting = (e) => {
    console.log('BottomBtn handleSetting');
    console.log(e);
    console.log(e.target);
    console.log(e.target.checked);
    this.props.handleSetting(e.target.checked)

  }

  render(this) {
    // 如果传来的属性 disable == true（置灰）
    console.log('this.state.disable:');

    if (this.props.disable == true) {
      // 置灰状态
      return (
        <div className='bottom_box'>
          <DisableBtn value={this.props.value} />
        </div>

      )

    }

    console.log('bottomBtn:');
    console.log(this.props);    
    
    // 复选框
    let checkbox

    if (this.props.selectionLength > 1) {

      checkbox = <div className="checkbox">
        
        <label>
        <input id="seting_set_frame_name" type="checkbox" defaultChecked={this.props.seting_set_frame_name} className="checkbox__box" onClick={this.handleSetting.bind(Event)} /> <span>Use the layer name as the directory name</span>
        </label>
      </div>

    } else {
      checkbox = ''
    }

    return (
      // 可点击状态
      <div className='bottom_box'>

        {checkbox}
        <Btn BtnHandleClick={this.handleClick.bind(this)} value={this.props.value} ln={this.props.layerName} />

      </div>

    )
  }


}

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
      BtnHandleClick?: Function
    },
    {
      ln?: string
      value?: string
      BtnHandleClick?: Function
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
    console.log('Btn handleClick');
    // console.log(this);
    // console.log(this.props);

    // 执行 Btn 组件的 handleClick 方法
    this.props.BtnHandleClick()

    // console.log(a);
    //给 code.ts 发消息
    // parent.postMessage('hello,my name is UI.tsx')
    // parent.postMessage({ pluginMessage: { type: 'Run', data: this.props.ln } }, '*')

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
    // console.log(this.state.msg);
    // console.log(this.props.msg);

    if (this.props.msg == '' || this.props.msg == undefined) {



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
      loading?: boolean
      selectionLength?: number
      seting_set_frame_name?: boolean
      // handleBtnClick?:Function
    }>
{

  constructor(props) {
    super(props);
    this.state = { layerName: '', erroMsg: '', loading: false, selectionLength: 0, seting_set_frame_name: false };
    this.handleSetting = this.handleSetting.bind(this);

  }

  //组件创建时
  componentDidMount() {

    // code.ts 发来消息
    onmessage = (event) => {
      // console.log(event.data.pluginMessage);
      console.log('onmessage');

      if (event.data.pluginMessage.type === 'getClientStorage') {
        // 读取历史记录
        
        console.log(event.data.pluginMessage);

        if (event.data.pluginMessage.data.seting.seting_set_frame_name !== this.state.seting_set_frame_name) {
          this.setState({
            seting_set_frame_name: event.data.pluginMessage.data.seting.seting_set_frame_name
          })
        }
        
      } else {

        // 

        var selectionName = event.data.pluginMessage.selectionName
        var msg = event.data.pluginMessage.erroMsg
        var selectionLength = event.data.pluginMessage.selectionLength
        console.log('selectionLength:');
        console.log(event.data.pluginMessage);

        console.log(selectionLength);


        if (selectionName != '') {

          // selection = event.data.pluginMessage[0].name
        } else {

          // selection = '空'
        }

        // console.log('selectionName:');
        // console.log(selectionName);

        this.setState({
          layerName: selectionName,
          erroMsg: msg,
          selectionLength: selectionLength
        })

        console.log('ShowUI-this.state.layerName:');
        // console.log(this.state.layerName);
      }




    }
  }

  handleBtnClick(this) {
    // 点击运行时
    console.log('ShowUI handleBtnClick')
    // console.log(this);
    this.setState({
      loading: true,
    }, () => {
      setTimeout(() => {
        parent.postMessage({ pluginMessage: { type: 'Run', data: 'undefined', seting_set_frame_name: this.state.seting_set_frame_name } }, '*')
      }, 15)

    })


  }

  handleSetting(checked) {
    console.log('ShowUI handleSetting');
    console.log(checked);
    console.log(this.state);

    if (checked !== this.state.seting_set_frame_name) {
      this.setState({
        seting_set_frame_name: checked
      })
    }

  }

  render() {

    // console.log('this.state.layerName:');
    // console.log(this.state.layerName);

    //渲染加载中界面
    if (this.state.loading) {
      console.log('this.state.loading');

      return (

        <div className='main_box'>
          <ShowErroMsg msg={this.state.erroMsg} />
          <HaveData msg='Run will generate directory' layerName={this.state.layerName} />
          <BottomBtn disable={true} value='Running' />
        </div>
      )
    }

    //渲染空数据界面
    if (this.state.layerName == '') {
      console.log('this.state.layerName =="" ');

      return (

        <div className='main_box'>
          <ShowErroMsg msg={this.state.erroMsg} />
          <EmptyData msg='Please select a layer' />
          <BottomBtn disable={true} value='Run' />
        </div>
      )
    }

    // 如果选中多个图层，则允许设置使用图层名称作为目录名称

    return (
      //渲染有数据界面
      <div className='main_box'>
        <ShowErroMsg msg={this.state.erroMsg} />
        <HaveData msg='Run will generate directory' layerName={this.state.layerName} />
        <BottomBtn handleSetting={this.handleSetting} bottomBtnHandleClick={this.handleBtnClick.bind(this)} selectionLength={this.state.selectionLength} seting_set_frame_name = {this.state.seting_set_frame_name} disable={false} value='Run' layerName={this.state.layerName} />
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