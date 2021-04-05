<script>
import { __vlsRenderHelper } from 'vue-editor-bridge'
	export default {
		onLaunch: function() {
			console.log('App Launch')
          // 查看是否授权
        wx.getSetting({
          success (res){
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function(res) {
                  console.log(res.userInfo)
                }
              })
            }else {
              console.log(res);
            }
          },
          fail (error) {
            console.log(error);
          }
        })
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
  @import './fonts';

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
