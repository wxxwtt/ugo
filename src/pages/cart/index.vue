<template>
  <view class="wrapper">
    <!-- 收货信息 -->
    <view class="shipment">
      <view class="dt">收货人: </view>
      <view class="dd meta">
        <text class="name">刘德华</text>
        <text class="phone">13535337057</text>
      </view>
      <view class="dt">收货地址:</view>
      <view class="dd">广东省广州市天河区一珠吉</view>
    </view>
    <!-- 购物车 -->
    <view class="carts" v-if="cart.length">
      <view class="item">
        <!-- 店铺名称 -->
        <view class="shopname">自营商品</view>
        <view class="goods" v-for="(good, index) in cart" :key="good.goods_id">
          <!-- 商品图片 -->
          <image class="pic" :src="good.goods_small_logo"></image>
          <!-- 商品信息 -->
          <view class="meta">
            <view class="name">{{ good.goods_name }}</view>
            <view class="price">
              <text>￥</text>{{ good.goods_price }}<text>.00</text>
            </view>
            <!-- 加减 -->
            <view class="amount">
              <text class="reduce" @click="minusHandle(good)">-</text>
              <input
                type="number"
                :value="good.number"
                class="number"
                @input="onInput($event, good)"
              />
              <text class="plus" @click="increaseHandle(good)">+</text>
            </view>
          </view>
          <!-- 选框 -->
          <view class="checkbox">
            <icon
              type="success"
              size="20"
              :color="good.checked ? '#ea4451' : '#ddd'"
              @click="toggleChecked(good.goods_id)"
            ></icon>
          </view>
        </view>
      </view>
    </view>
    <view v-else style="text-align: center; color: #ddd; padding-top: 50rpx"
      >空空如也o(╥﹏╥)o, 快去选购吧</view
    >
    <!-- 其它 -->
    <view class="extra">
      <label class="checkall" @click="toggleAll">
        <icon
          type="success"
          :color="checkedAllStatus ? '#ea4451' : '#ddd'"
          size="20"
        ></icon>
        全选
      </label>
      <view class="total">
        合计: <text>￥</text><label>{{ totalPrice }}</label
        ><text>.00</text>
      </view>
      <view class="pay" @click="getUserProfile"
        >结算({{ checkedGoods.length }})</view
      >
      <!-- <button class="pay" @click="getUserProfile">结算({{ checkedGoods.length }})</button> -->
    </view>
  </view>
</template>

<script>
import { request, request2 } from '@/utils/request'
export default {
  name: 'Cart',
  data () {
    return {
      cart: uni.getStorageSync('cart') || [], //购物车数据
      checkedAllStatus: false, //全部选中的状态
      totalPrice: 0,
      userInfo: null,
      consignee_addr: '知春路'
    }
  },
  computed: {
    checkedGoods () {
      return this.cart.filter(item => item.checked)
    }
  },
  watch: {
    checkedGoods: {
      handler (goods) {
        this.checkedAllStatus = goods.length === this.cart.length && this.cart.length !== 0
        this.totalPrice = goods.reduce((pre, next) => {
          return pre + next.goods_price * next.number
        }, 0)
      },
      deep: true
    }
  },
  methods: {
    // 单个商品的选中状态
    toggleChecked (goods_id) {
      const good = this.cart.find(good => good.goods_id === goods_id)
      good.checked = !good.checked
    },
    toggleAll () {
      // 全选和非全选
      this.cart.forEach(item => {
        item.checked = !item.checked
      })
    },
    // 获取用户信息
    getUserProfile (e) {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗

      if(!this.checkedGoods.length) {
        return uni.showToast({
          title: '请先选择一个商品',
          icon: 'none'
        })
      }
      if (!uni.getStorageSync('token')) {
        wx.getUserProfile({
          desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: async (res) => {
            getApp().globalData.isAuth = true
            uni.setStorageSync('auth', true)
            const { encryptedData, rawData, iv, signature } = res
            this.userInfo = res.userInfo

            const [err, _data] = await uni.login()
            if (err) return uni.showToast({ title: '微信授权登陆失败', icon: 'none' })
            try {
              const { code, data: { token }, msg } = await request2({
                url: '/api/wxapp/user/weixinLogin',
                method: 'POST',
                data: {
                  encryptedData,
                  rawData,
                  iv,
                  signature,
                  code: _data.code
                }
              })
              if (code === 1) {
                uni.setStorageSync('token', token)
                this.createOrder()
              } else {
               return uni.showToast({ title: msg, icon: 'none' })

              }
              

            } catch (error) {

              // token无效时使用下面的
              // const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
              // uni.setStorageSync('token', token)
              // this.createOrder()
            }

          },
          fail: error => {
            getApp().globalData.isAuth = false
            uni.setStorageSync('auth', false)
            uni.showToast({ title: '拒绝授权, 告辞', icon: 'none' })

          }
        })
      } else {
        this.createOrder()
      }

    },
    minusHandle (good) {
      if(good.number === 1) return;
      good.number -- 
    },
    increaseHandle (good) {
      good.number ++
    },
    onInput (e, good) {
      const { value } = e.detail
      if(parseInt(value) === 0) {
        good.number = 1
      }
    },
    async createOrder () {
      // const { cart: goods, totalPrice, consignee_addr } = this
      // const { message } = await request({
      //   url: '/api/public/v1/my/orders/create',
      //   method: 'POST',
      //   data: {
      //     order_price: totalPrice,
      //     consignee_addr,
      //     order_detail: '',
      //     goods: goods.map(item => ({goods_price: item.goods_price, goods_number: item.number, goods_id: item.goods_id}))
      //   }
      // })
      // if(message.pay_status === '0') {
      //   this.payHandle(message.order_number)

      // }

      // const { cart: goods, totalPrice, consignee_addr } = this
      const macaddr = '120191225E24', price = 0.01, second_duration = 1
      const { code, msg, data } = await request2({
        url: '/api/wxapp/orders/createOrder',
        method: 'POST',
        data: {
         macaddr: macaddr,
          price: price,
          second_duration: second_duration
        }
      })
      if(code === 1) {
        this.payHandle(data)
      } else {
        return uni.showToast({ title: msg, icon: 'none' })

      } 
    },
    async payHandle (pay_info) {
      const { cart } = this
      const { order_info, out_trade_no } = pay_info
      const { code } = await request2({
        url: '/api/wxapp/orders/orderPayStatus',
        method: 'POST',
        data: {
          out_trade_no
        }
      })
      if(code === 0) {
        wx.requestPayment({
          ...order_info,
          success (data) {
            uni.setStorageSync('cart', cart.filter(goods => !goods.checked)) 
          },
          fail(error) {
            console.log(error);
          }
        })
      }
        
    }
  },
  onLoad () {
    // this.cart = uni.getStorageSync('cart') || [] //购物车数据
  },
  onShow () {
    this.cart = uni.getStorageSync('cart') || [] //购物车数据

  }
}
</script>

<style scoped lang="scss">
.shipment {
  height: 100rpx;
  line-height: 2;
  padding: 30rpx 30rpx 40rpx 30rpx;
  font-size: 27rpx;
  color: #333;
  background-color: #fff;
  background-image: url(http://static.botue.com/ugo/images/cart_border%402x.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom;

  .dt {
    width: 140rpx;
    float: left;
    clear: both;
  }

  .dd {
    padding-left: 160rpx;
  }

  .meta {
    padding-right: 50rpx;
  }

  text.phone {
    float: right;
  }
}

.carts {
  background-color: #f4f4f4;
  padding-bottom: 110rpx;
  overflow: hidden;

  .shopname {
    padding: 30rpx;
    margin-top: 20rpx;
    font-size: 30rpx;
    color: #333;
    background-color: #fff;
    border-top: 1rpx solid #eee;
    border-bottom: 1rpx solid #eee;
  }

  .goods {
    display: flex;
    padding: 30rpx 20rpx 30rpx 0;
    margin-left: 100rpx;
    border-bottom: 1rpx solid #eee;
    background-color: #fff;

    position: relative;

    .checkbox {
      width: 101rpx;
      height: 100%;
      background-color: #fff;

      display: flex;
      justify-content: center;
      align-items: center;

      position: absolute;
      left: -100rpx;
      top: 0;
    }

    &:last-child {
      border-bottom: none;
    }

    .pic {
      width: 200rpx;
      height: 200rpx;
      margin-right: 30rpx;
    }

    .meta {
      flex: 1;
      font-size: 27rpx;
      color: #333;
      position: relative;
    }

    .name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .price {
      position: absolute;
      bottom: 0;

      color: #ea4451;
      font-size: 33rpx;

      text {
        font-size: 22rpx;
      }
    }

    .amount {
      position: absolute;
      bottom: 0;
      right: 20rpx;

      height: 48rpx;
      text-align: center;
      border: 1rpx solid #ddd;
      border-radius: 8rpx;

      display: flex;
      align-items: center;

      text {
        display: block;
        width: 60rpx;
        line-height: 48rpx;
        font-size: 36rpx;
        color: #ddd;
        text-align: center;
      }

      input {
        width: 60rpx;
        height: 48rpx;
        min-height: 48rpx;
        font-size: 27rpx;
        border-left: 1rpx solid #ddd;
        border-right: 1rpx solid #ddd;
      }
    }
  }
}

.extra {
  position: fixed;
  bottom: 0;
  /* #ifdef H5 */
  bottom: 50px;
  /* #endif */
  left: 0;
  z-index: 9;

  width: 750rpx;
  height: 96rpx;
  text-align: center;
  line-height: 96rpx;
  font-size: 36rpx;
  border-top: 1rpx solid #eee;
  background-color: #fff;
  color: #333;
  display: flex;

  .checkall {
    width: 140rpx;
    line-height: 1;
    margin-left: 25rpx;
    display: flex;
    align-items: center;

    icon {
      margin-right: 20rpx;
    }
  }

  .total {
    display: flex;
    justify-content: center;
    flex: 1;

    label,
    text {
      color: #ea4451;
      vertical-align: bottom;
      position: relative;
      bottom: -2rpx;
    }

    text {
      position: relative;
      bottom: -3rpx;
      font-size: 24rpx;

      &:first-child {
        margin-left: 10rpx;
      }
    }
  }

  .pay {
    width: 200rpx;
    background-color: #ea4451;
    color: #fff;
  }
}
</style>

