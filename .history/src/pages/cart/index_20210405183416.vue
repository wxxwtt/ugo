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
    <view class="carts">
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
              <text class="reduce">-</text>
              <input type="number" value="1" class="number">
              <text class="plus">+</text>
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
    <!-- 其它 -->
    <view class="extra">
      <label class="checkall" @click="toggleAll">
        <icon 
          type="success"
          color="ea4451"
          size="20"
        ></icon>
        全选
      </label>
      <view class="total">
        合计: <text>￥</text><label>14110</label><text>.00</text>
      </view>
      <view class="pay">结算({{ checkedGoods.length }})</view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'Cart',
    data () {
      return {
        cart: uni.getStorageSync('cart') || []
      }
    },
    computed: {
      checkedGoods() {
        return this.cart.filter(item => item.checked)
      }
    },
    methods: {
      // 单个商品的选中状态
      toggleChecked(goods_id) {

        const good =  this.cart.find(good => good.goods_id === goods_id) 
        good.checked = !good.checked
      },
      toggleAll () {
        // 全选和非全选
        this.cart.forEach(item => {
          item.checked = !item.checked
        })
      }
    },
    onLoad () {
     
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

      label, text {
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

