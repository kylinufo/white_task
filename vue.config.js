/*
 * @Description: 配置文件
 */
module.exports = {
    publicPath: './',
    // 输出文件目录(默认dist)
    outputDir: 'dist_'+ Date.now(),
    //api代理
    devServer: {
        open: true,
        proxy: {
            // '/api_ip': {
            //     // target: 'http://pv.sohu.com', //http://pv.sohu.com/cityjson?ie=utf-8
            //     target: 'https://ip.useragentinfo.com', // https://ip.useragentinfo.com/json
            //     changeOrigin: true, //是否跨域
            //     pathRewrite: {
            //         '^/api_ip': ''
            //     }
            // },
            '/data_api': {
                // target: 'https://ser.lordofpower.com', //这里是域名，不是完整的地址//
                // target: 'http://ser_cdnzfly.lordofpower.com:8085', //这里是域名，不是完整的地址//
                target: 'http://127.0.0.1:8002', //这里是域名，不是完整的地址//
                changeOrigin: true, //是否跨域
                pathRewrite: {
                    '^/data_api': ''
                }
            }
        }
    },
}




