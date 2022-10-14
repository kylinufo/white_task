<template>
  <div class="m_task">
    <el-row>
      <el-col class="m_log">
        <el-image :src="url_logo"></el-image>
        <el-button @click="ongetWallet">Link Wallet</el-button>
      </el-col>
      <el-col class="m_txt_1">
        <h4>{{ title[1] }}</h4>
      </el-col>
      <el-col class="m_txt_2">
        <h3>{{ title[2] }}</h3>
      </el-col>
      <el-col class="m_list">
        <el-card>
          <el-row>
            <el-col v-for="(val,key) in lists" :key="key" class=" m_list_l">
              <el-row>
                <el-col :span="1" class="m_list_txt">
                  {{ key }}.
                </el-col>
                <el-col :span="15" class="m_list_txt">
                  {{ val }}
                </el-col>
                <el-col :span="8" class="m_list_img">
                  <el-upload v-if=" !img_up_show[key] "
                             ref="upload"
                             :action="upload_url"
                             :before-upload="beforeUpload"
                             :data="{
                               userid:user_id,
                               bid:key,
                               ips:user_ips.ips,
                               ipaddress:user_ips.ipaddress,
                               country:user_ips.country,
                             }"
                             :file-list="fileList[key]?[fileList[key]]:[]"
                             :limit="1"
                             :name="`voucher`"
                             :on-error="onError"
                             :on-exceed="onExceed"
                             :on-preview="handlePictureCardPreview"
                             :on-remove="onRemove"
                             :on-success="onSuccess"
                             class="upload-images"
                             list-type="picture"
                  >
                    <el-button size="small" type="primary"><i class="el-icon-plus"></i></el-button>
                  </el-upload>
                  <el-button v-else
                             :icon=" m_status[fileList[key].status_d].icon"
                             :type=" m_status[fileList[key].status_d].type"
                             size="small">
                    {{ m_status[fileList[key].status_d].txt }}
                  </el-button>
<!--                  <span class="success"><i class="el-icon-check"/>{{ m_status[fileList[key].status_d].txt }}</span>-->
                </el-col>

              </el-row>

            </el-col>
            <el-col :span="16" class="m_list_sub">
              <el-button v-if="all_sub" class="all_success" @click="receiveAward">{{ m_txt[8] }}</el-button>
              <el-button v-else @click="submitUpload">{{ m_txt[7] }}</el-button>
              <div class="el-upload__tip">
                <a type="text" @click="dialogVisible_txt = true">{{ m_txt[5] }}</a>
              </div>
            </el-col>
            <el-col v-if="all_sub" :span="8" class="el-upload__tip m_list_tip "><b style="color: #9f0000"> Tips:</b>
              {{ m_txt[9] }} <br><b style="color: #9f0000"> Wallet address:</b> {{  user_id }}
            </el-col>
            <el-col v-else :span="8" class="el-upload__tip m_list_tip"><b style="color: #9f0000"> Tips:</b>
              {{ m_txt[6] }} <br><b style="color: #9f0000"> Wallet address:</b> {{  user_id }}
            </el-col>
            <el-col :span="24" class="quick_address">
              <el-row>
                <el-col :span="24" class="text-left">Quickly share address:</el-col>

                <el-col :span="4" :xs="6" v-for="(val,key) in url_lists" :key="key" :title="val.url" class="link_task">
                  <div  @click="clickCopy(key)">
                    <el-image :src="val.img"/><br>
                    <span >{{val.name}}</span>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-dialog :visible.sync="dialogVisible_img">
            <img :src="dialogImageUrl" alt="" width="100%">
          </el-dialog>
          <el-dialog :visible.sync="dialogVisible_txt" class="dialogVisible_txt">
            <el-card>
              <el-row>
                <el-col class="title">
                  <h4>{{ title[3] }}</h4>
                </el-col>
                <el-col v-for=" (val ,key) in m_txt[1]" :key="key">
                  <el-row>
                    <el-col :span="1">
                      {{ key }}.
                    </el-col>
                    <el-col :span="23">
                      {{ val }}<br><br>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col class="title">
                  <h4>{{ title[4] }}</h4>
                </el-col>
                <el-col>
                  {{ m_txt[4] }}<br><br>
                </el-col>
                <el-col v-for=" (val ,key) in m_txt[2]" :key="key">
                  <el-row>
                    <el-col :span="1">
                      {{ key }}.
                    </el-col>
                    <el-col :span="23">
                      {{ val }}
                    </el-col>
                  </el-row>
                </el-col>
                <el-col v-for=" (val ,key) in m_txt[3]" :key="key">
                  <el-row>
                    <el-col :span="2" style="text-align: right">
                      ({{ key }}).
                    </el-col>
                    <el-col :span="22">
                      {{ val }}
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-card>
          </el-dialog>
        </el-card>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import axios from "axios";


let _self;
export default {
  name: 'Upload',
  data() {
    let title = {
      1: "Lord Of Power Whitelist Event",
      2: "Welcome to share with your friends to get rewards",
      3: "White list reward mechanism",
      4: "Super white list mechanism",
    };
    let m_txt = {
      1: {
        1: "After completing the white list task,users who will obtain the white list qualification can directly obtain a Lord of Power surprise blind box(exclusive white list blind box)which is limited to 5000.",
        2: "Randomly select 50 Chuangshi blind boxes(59.9USDT/box)from the white list users according to their activities, activenessetc.and give them to the lucky users on the white list."
      },
      2: {
        1: "The number of super whitelists(20) will expire when they are issued",
        2: "Super white list award",
      },
      3: {
        1: "You can get 10% of the daily copy income as an additional reward",
        2: "Air drop 200 GDE governance coins(directly air drop to the coin holding address after the token goes onli",
        3: "Air drop 10000 SVE sub coins(directly air drop to the coin holding address after the token goes online)",
        4: "One piece of first-class legendary equipment is dropped byair(random equipment(5) 10 surprise blind boxes will be airdropped(white list exclusive blind be"
      },
      4: "Obtained by purchasing blind boxes,200 blind boxes can beautomatically qualified",
      5: 'Rewards and conditions',
      6: 'only jpg/png files can be uploaded, and the size is no more than 3M',
      7: 'Submit for review',
      8: 'Receive rewards',
      9: "You have completed all the tasks, please click the button to go to the page of receiving rewards",//您已完成全部任务,请点击按钮前往领取奖励的页面

    };
    let m_tip = {
      1: " Only one picture can be uploaded for this task",//本次任务仅能上传一张图片
      2: " Wrong picture type",// 图片类型有误
      3: " Picture size exceeds 3M",// 图片大小超出3M
      4: " Upload channel error",//上传通道错误
      5: " Uploaded for approval",//已上传等待审核
      6: " The image has been uploaded with duplicate names",//图片已上传,名称有重复
      7: "The image has been uploaded successfully, please wait patiently for approval",//图片已上传成功，请耐心等待审核
      8: "No pictures submitted",//未提交任何图片
      9: "Going to the page of receiving rewards ...",//正在前往领取奖励的页面
    };
    let lists = {
      1: "Follow and tweet official tweets. Submit screenshot ",// “关注并推特官方推特。提交屏幕截图”
      2: "Follow and forward the content of the official fackbook account Submit screenshot ",//“关注并转发官方fackbook帐户的内容提交屏幕截屏”
      3: "Follow and retweet the official instagram account. Submit screenshot ",
      4: "Follow the official Discord account",// "Follow the official youtube account",
      5: "Join the official English Telegram group. Submit screenshot ",
      6: "Join the official Chinese Telegram group. Submit screenshot ",





      // 1:“关注并推特官方推特。提交屏幕截图”，  Twitter:https://twitter.com/LordofpowerNFT
      // 2:“关注并转发官方fackbook帐户的内容提交屏幕截屏”，  Facebook:https://www.facebook.com/LordOfPowerNFT
      // 3:“关注和转发官方instagram帐户。提交屏幕抓图”，  Instagram:https://www.instagram.com/lord.of.power
      // 4:“关注官方Discord帐户”   Discord:https://discord.gg/C5mcrVnsqW
      // 5:“加入官方英语电报组。提交屏幕快照”，       English telegraph group：https://t.me/LordOfPowerWD
      // 6:“加入官方中文电报组，提交截图”，Chinese telegraph group：https://t.me/LordOfPower_CN
    };
    let url_lists ={
      1:  {img:require("../assets/ac/Twitter.png"),name:'Twitter', url:'https://twitter.com/LordofpowerNFT'},
      2:  {img:require("../assets/ac/facebook.png"),name:'Facebook', url:'https://www.facebook.com/LordOfPowerNFT'},
      3:  {img:require("../assets/ac/Instagram.png"),name:'Instagram', url:'https://www.instagram.com/lord.of.power'},
      4:  {img:require("../assets/ac/Discord.png"),name:'Discord', url:'https://discord.gg/C5mcrVnsqW'},
      5:  {img:require("../assets/ac/Telegram.png"),name:'Telegram', url:'https://t.me/LordOfPowerWD'},
      6:  {img:require("../assets/ac/Telegram.png"),name:'Telegram(CN)', url:'https://t.me/LordOfPower_CN'},
    }
    let m_status = {
      0: {txt: "Await", icon: '', type: ''},//等待  Await
      1: {txt: "Adopt", icon: 'el-icon-check', type: 'success'},//已通过 Adopt
      2: {txt: "Failed", icon: '', type: ''},//未通过    Failed
    };
    // let ip_config = "http://192.168.0.163:8002";
    let flie_list = {};
    let img_up_show = {};
    for (let k in lists) {
      img_up_show[k] = false;
    }

    return {
      user_ips: {
        ips: '',
        ipaddress: '',
        country: ''
      },
      user_id: '---',
      dialogImageUrl: [],
      dialogVisible_img: false,
      dialogVisible_txt: false,
      upload_url: 'data_api/api.php/index/adduser',
      url_logo: require("../assets/logo.png"),
      fileList_now: [],
      fileList: {},
      all_sub: false,
      // ip_config: ip_config,
      img_up_show: img_up_show,
      lists,
      url_lists,
      title,
      m_txt,
      m_tip,
      m_status,
    }
  },
  created() {
    _self = this;
  },
  methods: {
    onRemove(file, fileList) {
      this.fileList_now = this.fileList_now.filter(item => item != file.name)
    },

    onExceed(files, fileList) {
      return this.$message.warning(this.m_tip[1]);
    },
    beforeUpload(file) {
      //检验
      if ( this.user_id == '' || this.user_id == '---') {
        this.$message.warning('Wallet not connected');
        return false
      }
      let img_type = ["image/jpeg", "image/png", "image/jpg"];
      //文件类型
      if (!(img_type.indexOf(file.type) > -1)) {
        this.$message.warning(file.name + this.m_tip[2]);
        return false;
      }
      //文件大小
      if (file.size > 1048576*3) { //1048576
        this.$message.warning(file.name + this.m_tip[3]);
        return false;
      }
      // //重复文件
      // if (this.fileList_now.indexOf(file.name) > -1) {
      //   this.$message.warning(file.name + this.m_tip[6]);
      //   return false
      // }
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible_img = true;
    },

    onError(msg, file, fileList) {
      file.status = 'fail';
      fileList.splice(fileList.indexOf(file), 1);
      !msg ? msg = {msg: this.m_tip[4]} : ''
      return this.$message.error(`${msg.msg}`);
    },
    onSuccess(msg, file, fileList) {
      // console.log('addimg',msg)
      if (msg.code == 0) {
        this.fileList_now.push(file.name)
        return this.$message.success(file.name + this.m_tip[5]);
      } else {
        return this.onError(msg, file, fileList);
      }
    },
    submitUpload() {
      console.log(this.fileList_now)
      if (this.fileList_now.length == 0) {
        this.$message.error(this.m_tip[8]);
        return false;
      }
      this.$message.success(this.m_tip[7]);
      window.setTimeout(function () {
        window.location.reload();
      }, 3000)
    },
    receiveAward() {
      this.$message.success(this.m_tip[9]);
      window.setTimeout(function () {
        document.location.href = '#/rewards'
      }, 500)
    },
    ongetWallet(){
      this.$options.mounted.ongetWallet();
    },
    clickCopy(key) {
      this.$copyText(_self.url_lists[key].url).then(
          function(e) {
            _self.$message.success( "The sharing address of " + _self.url_lists[key].name + " has been copied successfully");
            document.location.href = _self.url_lists[key].url
          },
          function(e) {
            _self.$message.error( "Failed to copy the sharing address of " + _self.url_lists[key].name );
            document.location.href = _self.url_lists[key].url
          }
      );
    }



  },
  mounted: function () {
    axios.defaults.withCredentials = false;//Cookie跨域
    // let _self = this; //vue mounted 里面不能this 解决方式
    _self.getip = function () {
      axios.get("//ip.useragentinfo.com/json")
      // axios.get("api_ip/json")
          .then(function (data) {
            let res = data.data
            if (res.hasOwnProperty("code") && res.code == 200 && res.desc == 'success') {
              _self.user_ips = {
                'ips': res.ip,
                'ipaddress': res.province + "-" + res.city + "-" + res.area + "-" + res.isp,
                'country': res.short_name,
              }
            } else {
              console.log(res)
            }
          })
          .catch(err => {
                console.log(err)
              }
          )
    };
    _self.user_imgs =function (){
      if(_self.user_id === "---"){
        //请连接钱包
        return _self.$message.error('Please connect the wallet')
      }
      axios.post(
          'data_api/api.php/index/user_imgs',
          {userid: _self.user_id},
          {headers: {'Content-Type': 'multipart/form-data'}}
      )
          .then(function (res) {
            let msg = res.data;
            if (msg.code == 0) {
              let datas = msg.data,
                  m_status = _self.m_status,
                  sub_success_num = 0,
                  path = "data_api/uploads/images/gameuser/";
              if (datas.length == 0) {
                return false;
              }
              for (let k in datas) {
                _self.img_up_show[k] = true;//唤醒页面更新 还没搞清楚怎么回事？？？
                datas[k].status_d === 1 ? '' : _self.img_up_show[k] = false;
                let name = "( " + m_status[datas[k].status_d].txt + " ) " + datas[k].name;
                datas[k].status_d === 1 ? sub_success_num += 1 : '';
                _self.fileList[k] = {
                  name: name,
                  url: path + datas[k].path,
                  status_d: datas[k].status_d,
                };
                _self.fileList_now.push(name);
              }
              // let task_num =  Object.getOwnPropertyNames(_self.fileList).length;
              let task_num = Object.keys(_self.fileList).length;
              sub_success_num == task_num ? _self.all_sub = true : '';
            } else {
              _self.$message.error(msg.msg);
            }
          })
          .catch(err => {
            return _self.$message.error(err);
          })
    };
    _self.ongetWallet  = async  function () {
      let msg = await _self.$wallet.connect();
      // console.log(msg)
      if (msg['code'] == 0) {
        _self.user_id = msg.msg
        _self.user_imgs()
        return _self.$message.success("Wallet connected successfully")    //钱包连接成功
      } else {
        return msg.msg === "undefined"
            ? _self.$message.error("Wallet connection failed")    //钱包连接失败
            : _self.$message.warning(msg.msg)                     //错误消息返回
      }
    };
    _self.getip();
    _self.ongetWallet();
  }
}
</script>

<style lang="less">
.m_task {
  max-width: 1280px;
  margin: 0 auto;
  padding-bottom: 10%;

  .m_log {
    img {
      width: 50%;
      min-width: 100px;
    }
    .el-button {
      right: 5%;
      position: absolute;
      background-color: transparent;
      border: none;
      background-image: url(../assets/box/btn_1.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      color: #fff;
      height: 40px;
      font-size: 14px;
      font-weight: bolder;
      line-height: 14px;
      padding: 0 7px 5px 5px;
      text-shadow: 1px 3px 2px #000;
      -webkit-text-shadow: 1px 3px 2px #000;
    }
  }

  .m_txt_1 {
    h4 {
      color: #fff9f5;
      font-size: 20px;
      font-weight: 500;
      margin: 20px 0;
    }

  }

  .m_txt_2 {
    color: #c5b133;
    margin: 15px 0 40px 0;

    h3 {
      margin: 0 auto;
      width: 70%;
      font-size: 28px;
    }

  }

  .m_list {
    margin: 10px 5%;

    .el-card {
      background-color: rgba(175, 175, 175, 0.51);
      border: 1px solid #1c1914;
      border-radius: 10px;
      font-size: 15px;
      color: #f7f7f7;
      padding-bottom: 25px;

      .m_list_l {
        border-bottom: 1px solid #b19b92;
        margin-top: 10px;

        .m_list_txt {
          text-align: left;
          line-height: 20px;
        }

        .m_list_img {
          height: 50px;

          .upload-images {
            text-align: left;
            margin: 5px 0 5px 14px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-direction: row;

            .el-upload {
              button {
                color: #fff;
                background-color: #321701;
                border: none;
              }
            }

            .el-upload-list {
              border: 1px solid #d5c4c4;
              border-radius: 5px;
              width: 100%;
              overflow: auto;
              margin-left: 5px;

              li {
                padding: 0;
                height: auto;
                border: 1px solid #e7e7e7;
                background-color: #ddd;
                border-radius: 3px;

                width: 100%;

                img {
                  display: none;
                  width: 0;
                  height: 0;
                }

                a {
                  padding-top: 9px;
                  margin-left: 8px;
                  line-height: normal !important;
                  color: #1515ff;
                  width: fit-content;
                  border-bottom: 1px solid #9191f7;
                  background-color: transparent;

                }
              }

              .el-upload-list__item:first-child {
                margin-top: 0;
              }
            }
          }
          .success{
            background-color: #301e10;
            color: #d3a500;
            padding: 7px 10px;
            display: inline-block;
            i{
              padding-right: 8px;
            }
          }
        }
      }

      .m_list_sub {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        .el-button {
          margin-top: 25px;
          background-color: #311804;
          color: #fff;
        }

        .all_success {
          background-color: #c23a60;
        }
      }

      .el-upload__tip {
        a {
          color: blue;
          border-bottom: 1px solid blue;
          padding: 0;
          font-size: 12px;

        }
      }

      .m_list_tip {
        text-align: left;
        margin-top: 25px;
        word-break: break-all;
        color: #d7d7d7;
      }

      .dialogVisible_txt {
        .el-dialog {
          background-color: rgba(0, 0, 0, 0.85);
          border-radius: 10px;
          width: 80%;
          max-width: 750px;

          .el-col {
            margin: 2px 0;
          }

          .el-dialog__header {
            .el-dialog__headerbtn {
              width: 50px;
              height: 30px;
              border: 1px solid #121212;
              border-radius: 5px;
            }
          }

          .el-dialog__body {
            text-align: left;
            line-height: 20px;

            .title {
              text-align: center;

              h4 {
                padding: 12px;
                border: 1px solid #853f07;
                width: fit-content;
                background-color: #311804;
                border-radius: 5px;
                margin: 12px auto;
                color: #fff;
                font-weight: 500;

              }
            }
          }
        }

      }
      .quick_address{
        .text-left{
          text-align: left;
        }
        .el-row{
          align-items: center;
          justify-content: center;
          .el-col{
            vertical-align: center;
            border-right: 1px solid #af8b8b;
            line-height: 24px;
            margin: 5px 0 ;
          }
          .link_task{
            div{
              display: inline-block;
              color: #d7d7d7;
              //border-bottom: 1px solid #1717cf;
              .el-image{
                img{
                  border-radius:50%;
                  width:50%;
                  min-width:60px;
                  max-width:120px;
                  border: 1px solid #00360e;
                }



              }
            }
          }
          .el-col:first-child,.el-col:last-child{
            border-right: none;
          }

          .el-col:first-child{
            border-top:1px solid #342d2d;
            padding-top: 5px;
            color: #311804;
          }
        }
      }

    }


  }

}
</style>