<script>
let app = getApp()
export default {
  onLaunch: function () {
    console.log('App Launch')
    // 查看是否授权
    console.log(this.$scope);
    if (!this.$scope.globalData.isAuth) {
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          getApp().globalData.isAuth = true

          console.log(res);
          // this.setData({
          //   userInfo: res.userInfo,
          //   hasUserInfo: true
          // })
        },
        fail: error => {
          console.log(error);
        }
      })
    } else {

    }

  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
@import "./fonts";

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

input {
  display: block;
  height: 100%;
  padding: 0;
  box-sizing: border-box;
  outline: none;
}

.tips {
  text-align: center;
  margin-top: 200rpx;
  font-size: 36rpx;
  color: #666;
}
</style>
