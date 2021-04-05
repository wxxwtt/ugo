const baseURL = 'https://www.uinav.com'
const request = (params, loading = {}) => {
  const { title = '加载中...', isShow = true } = loading
  if(isShow) {
    uni.showLoading({
      title
    })
  }


  return new Promise((resolve, reject) => {
    const { url, data, method = 'GET' } = params
    wx.request({
      url: baseURL + url, //仅为示例，并非真实的接口地址
      data,
      method,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        uni.showToast({
          title: '1111111'
        })
        const status = res.data.meta.status
        if (200 <= status && status < 300 ) {
          resolve(res.data)
        }else {
          reject(res.data)
        }
      },
      fail (error) {
        console.log(error);
      }
    })
  })
}
export default request