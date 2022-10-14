import * as tp from 'tp-js-sdk'
import * as abi from 'ethjs-abi';
import MerkleTree  from "merkletreejs";



const keccak256 = require('keccak256');
const buyABI ={
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "buy",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    };


export default class wallet {
    static sleep(ms) { //sleep延迟方法2
        var unixtime_ms = new Date().getTime();
        while (new Date().getTime() < unixtime_ms + ms) {
        }
    }
    static  cc = {};
    //钱包连接
    static async connect() {
        let msg = {code: 400, msg: 'undefined'}
        if (tp.isConnected()) {
            var data = await tp.getCurrentWallet();
            if (data.result) {
                if (wallet.cc.chain != "bsc" || data.data.blockchain == 'bsc') {
                    msg = {code: 0, msg: data.data.address}
                } else {
                    data = await tp.getWallet({
                        walletTypes: ['bsc'],
                        switch: true
                    });
                    console.log('bscdata',data)
                    if (data.result) {
                        msg = {code: 0, msg: data.data.address}
                    }
                }
            }
        } else {
            // console.log('ethereum',ethereum)
            if (typeof ethereum === 'undefined') {
                let msg = {code: 400, msg: 'MetaMask is not uninstalled,Please install MetaMask!'}
            } else {
                await ethereum.request({
                    method: 'eth_requestAccounts' //eth_accounts
                })
                    .then((res) => {
                        // console.log("res",res)
                        msg = {code: 0, msg: res[0]}
                    })
                    .catch((err) => {
                        if (err.code === 4001) {
                            msg.msg = "Please connect to MetaMask.";
                        } else {
                            // console.log("err",err)
                            msg.msg = err;
                        }
                    });
            }
        }
        return msg;
    }

    static async proof_(){
        //叶子节点
        let address ='0xeE3c1640215072bd21DdaCC59D316Dc05c1e16f8';
        let whitelistAddresses = [
            '0xeE3c1640215072bd21DdaCC59D316Dc05c1e16f8',
            '0x6a8bB090384077d45815626E47131bCcEb607FB3',
            '0xB022fD04B86D2887380067C960637100DBfb82AC',
            '0xc41d05cee27275E7c243C72188ce71AD9431c5Aa',
            '0xEd0Ee6396507A9cc0897bf7812D321d78a51c8B1',
            '0xdA13E7ffEbb240Ba556dA353eaAA88F9Ac30869E',
            '0xA7F36063BdD78D8Ef94fC1e6C04c25404b1B4572',
            '0x12D220FbDA92a9c8f281eA02871aFA70DfDe81e9',
            '0x2B4d1525cFeb20075d9120eCC6Ba438c449986d6',
        ]
        let leafNodes = whitelistAddresses.map(x => keccak256(x));
        let tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
        //打印树结构 根（root）:最顶部的一条数据
        console.log("Tree:\r\n", tree.toString());
        let leaf = keccak256(address);
        let proof = tree.getHexProof(leaf);
        //打印验证路径
        console.log('Proof of '+ address +': ', proof);
        let msg = [];

        let data = abi.encodeEvent(buyABI, [0]);
        console.log("data",data)
        let _params ={
            from: address,
            to: '0x43087b77fe8a5289eeff3ebfdd62b9030e6e5f1a',
            data: data,
            value:0,
        };
        await ethereum.request({
            method: 'eth_sendTransaction',//eth_sendTransaction  shh_post
            params: [_params],
            from:address
        })
            .then((res) => {
                console.log("res",res)
            })
            .catch((err) => {
                console.log("err",err)
            });
    }

}