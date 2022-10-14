<template>
  <div class="m_rewards">
    <el-button @click="receive">测试按钮</el-button>
    <el-row>
      <el-col class="m_log">
        <el-image :src="url_logo"></el-image>
        <el-button @click="ongetWallet">Link Wallet</el-button>
      </el-col>
      <el-col class="m_txt_1">
        <h4>Receive ordinary white list rewards</h4>
      </el-col>

      <el-col class="m_list">
        <el-card>
          <el-row>
            <el-col><h3>Lord of Power Surprise Mystery Box</h3><h6>(Exclusive Mystery Box for White List)</h6></el-col>
            <el-col class="m_list_box">
              <el-image :src="url_box"/>
              <span class="box_num">x1</span>
            </el-col>
            <el-col class="m_list_sub">
              <el-button @click="reward('one')">Receive rewards</el-button>
            </el-col>
            <el-col :span="20">
              Randomly select 50 Genesis mystery boxes (59.9USDT/box) The lucky users on the white list are randomly
              assigned<br><br>
              All users who buy the Chuangshi Mystery Box will air drop one Surprise Mystery Box <br>
              (Exclusive Mystery Box for White List) <br>
              (Only one address is allowed)<br><br>
            </el-col>
            <el-col class="m_list_address">
              Address of bound wallet: <span>{{ user_id }}</span>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col class="m_txt_1">
        <h4>Super white list reward receiving</h4>
      </el-col>
      <el-col class="m_list">
        <el-card>
          <el-row>
            <el-col><h3>Lord of Power Surprise Mystery Box</h3><h6>(Exclusive Mystery Box for White List)</h6></el-col>
            <el-col class="m_list_box">
              <el-image :src="url_box"/>
              <span class="box_num">x10</span>
            </el-col>
            <el-col :span="20">
              10% of the daily copy income as an additional reward<br><br>
              Air drop 200 GDE governance coins<br>
              (directly air drop tokens to Currency address)<br><br>
              Air drop 10000 SVE sub coins (directly air drop the tokens after they go onlineCurrency address)<br><br>
              One piece of first-class legendary equipment is dropped by air (random equipment)
            </el-col>
            <el-col class="m_list_sub">
              <el-button @click="reward('two')">Receive rewards</el-button>
            </el-col>
            <el-col class="m_list_address">
              Address of bound wallet: <span>{{ user_id }}</span>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col class="m_list_tip">
        If you have any questions about thewhite list award ,<br>
        please contact the official email:<span> operator@lordofpower.co </span>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import axios from "axios";
import asd from '@/assets/js/web3.min.js'

let _self;
export default {
  name: "Rewards",
  created() {
    _self = this;
  },
  data() {
    return {
      user_id: '---',
      url_logo: require("../assets/logo.png"),
      url_box: require("../assets/box/box_1.png"),

      RECEIVE: "0x93008c25ecabfa4d5da3cb074eda1e3e26f3a1a5",
      USDT: "0x43087b77fe8a5289eeff3ebfdd62b9030e6e5f1a",//测试用U地址
      binance_url:'https://data-seed-prebsc-1-s1.binance.org:8545/',

      loading_options: {},
      loading_in: '',
    }
  },
  methods: {
    _loaging: function (txt = 'loading...') {
      let loading_options = {
        lock: true,
        text: txt,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      }
      _self.loading_in = _self.$loading(loading_options)
    },
    _loaging_close: function () {
      _self.loading_in.close()
    },
    ongetWallet() {
      _self.$options.mounted.ongetWallet();
    },
    reward(type) {
      axios.post(
          'data_api/api.php/index/user_adopt',
          {userid: _self.user_id, type: type},
          {headers: {'Content-Type': 'multipart/form-data'}}
      )
          .then(
              function (res) {
                let msg = res.data
                console.log(msg)
                if (msg.code !== 0) {
                  return _self.$message.error(msg.msg);
                } else {
                  console.log('success');
                }
              }
          )
          .catch(
              function (err) {
                console.log(err)
              }
          )
    },



    receive() {
      _self._loaging('前往领取中...')
      let num = 0;
      let web3 = new Web3(new Web3.providers.HttpProvider(_self.binance_url));
      let funcname = "Claim4White(proof,address,uint256)";
      // let funcname = "OpenBox(address,uint256)";
      let fnameSha3 = _self.sha3(funcname);
      let unit = _self.toHex(Number((num).toFixed(2)) * 1e18)
      let data = fnameSha3 + _self.padLeft(_self.RECEIVE.substring(2)) + _self.padLeft(unit.substring(2));
      let call_value = _self.eth_sendTransaction(_self.USDT, _self.user_id, data)
          .then(result => {
            //正在领取中
            _self._loaging_close()
            _self._loaging('正在领取中...')
            _self.hash_receive(result)
          })
          .catch((err) => {
            //领取失败
            _self._loaging_close()
            _self.$message.error('领取失败' + err.message)
          });

    },
    //解析购买连接哈希值
    hash_receive(res) {
      let web3 = new Web3(new Web3.providers.HttpProvider(_self.binance_url));
      let hash_tx = res;
      web3.eth.getTransactionReceipt(hash_tx, function (error, result) {
        if(error != null){
          //领取失败
          _self._loaging_close()
          _self.$message.error('领取失败:' + error.message)
          return false;
        }
        if (result == null) {
          _self.hash_receive(hash_tx)
        } else if (result.status == "0x1" && result.logs.length != 0) {
          //领取完成
          _self._loaging_close()
          _self._loaging('领取完成...')
        }
      })
    },
    //________________________________________________________________________
    //连接方法
    eth_sendTransaction(contract_address, address_from, data) {
      const eth_sendTransaction = window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            "from": address_from,
            "to": contract_address,
            "data": data,
          }, "latest"]

      });
      console.log(eth_sendTransaction)
      return eth_sendTransaction;
    },
    padLeft(oldvalue) {
      let web3 = new Web3(new Web3.providers.HttpProvider(_self.binance_url));
      return web3.padLeft(oldvalue, 64);
    },
    hexToUtf8(decimal) {
      let web3 = new Web3(new Web3.providers.HttpProvider(_self.binance_url));
      return web3.hexToUtf8(decimal);
    },
    toHex(decimal) {
      let web3 = new Web3(new Web3.providers.HttpProvider(_self.binance_url));
      return web3.toHex(decimal);
    },
    sha3(funcname) {
      let web3 = new Web3(new Web3.providers.HttpProvider(_self.binance_url));
      return web3.sha3(funcname).substring(0, 10);
    }

  },
  mounted() {
    _self.ongetWallet = async function () {
      let msg = await _self.$wallet.connect();
      console.log(msg)
      // await _self.$wallet.proof_(_self.user_id); //测试的
      if (msg['code'] == 0) {
        _self.user_id = msg.msg
        return _self.$message.success("Wallet connected successfully")    //钱包连接成功
      } else {
        return msg.msg === "undefined"
            ? _self.$message.error("Wallet connection failed")    //钱包连接失败
            : _self.$message.warning(msg.msg)                     //错误消息返回
      }
    };
    _self.ongetWallet();


  }
}
</script>

<style lang="scss">
.m_rewards {
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

  .m_list_box {
    img {
      margin-top: 10px;
      width: 65%;
      min-width: 135px;
      border-radius: 10px;
      border: 1px solid #2b2928;
    }

    .box_num {
      position: relative;
      left: -62px;
      top: -9px;
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

  .m_list {
    margin: 10px 5%;

    .el-card {
      background-color: rgba(175, 175, 175, 0.51);
      color: #001430;
      border: 1px solid #1c1914;
      border-radius: 10px;
      font-size: 15px;
      padding-bottom: 25px;
      margin: 0 auto;
      text-align: center;

      .el-row {
        justify-content: center;

        .el-col {
          line-height: 18px;
        }
      }

      .m_list_sub {
        .el-button {
          margin: 25px 0 20px;
          background-color: #311804;
          color: #fff;
          padding: 12px 40px;
          border: 1px solid #00013c;
        }

        .all_success {
          background-color: #c23a60;
        }
      }

      .m_list_address {
        font-size: 14px;

        span {
          font-size: 12px;
        }
      }

    }


  }

  .m_list_tip {
    color: #d5d5d5;
    font-size: 16px;

    span {
      background-color: #565656;
    }
  }
}
</style>