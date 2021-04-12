const baseURL = 'https://api-hmugo-web.itheima.net'
export function request (params, loading = {}) {
  const { title = '加载中...', isShow = true } = loading
  if (isShow) {
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
        'content-type': 'application/json', // 默认值
        'Authorization': uni.getStorageSync('token')
      },
      success(res) {
        const { statusCode } = res
        uni.hideLoading()
        if (200 <= statusCode && statusCode < 300) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail(error) {
        uni.showToast({
          title: '网络连接失败,请稍后重试',
          icon: 'none'
        })
      }
    })
  })
}
const baseURL2 = 'https://www.dingyitech.cn'

export function request2 (params, loading = {}) {
  const { title = '加载中...', isShow = true } = loading
  if (isShow) {
    uni.showLoading({
      title
    })
  }

  return new Promise((resolve, reject) => {
    const { url, data, method = 'GET' } = params
    wx.request({
      url: baseURL2 + url, //仅为示例，并非真实的接口地址
      data,
      method,
      header: {
        'XX-Device-Type': 'wxapp',
        'content-type': 'application/json', // 默认值
        'XX-Token': uni.getStorageSync('token')
      },
      success(res) {
        const { statusCode } = res
        uni.hideLoading()
        if (200 <= statusCode && statusCode < 300) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail(error) {
        uni.showToast({
          title: '网络连接失败,请稍后重试',
          icon: 'none'
        })
      }
    })
  })
}
