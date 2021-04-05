<script>
let app = getApp()
export default {
  onLaunch: function () {
    console.log('App Launch')
    // 查看是否授权
    this.$scope.globalData = uni.getStorageSync('auth') || false
    let { isAuth } = this.$scope.globalData

    if (!isAuth) {
      console.log('未授权');
    } else {
      console.log('已授权');
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
