<template>
  <view>
    <!-- 筛选 -->
    <view class="filter">
      <text class="active">综合</text>
      <text>销量</text>
      <text>价格</text>
    </view>
    <!-- 商品列表 -->
    <scroll-view class="goods" scroll-y>
      <view 
        class="item"
        v-for="good in list"
        :key="good.goods_id"
       @click="goDetail">
        <!-- 商品图片 -->
        <image class="pic" :src="good.goods_small_logo"></image>
        <!-- 商品信息 -->
        <view class="meta">
          <view class="name">{{ good.goods_name }}</view>
          <view class="price">
            <text>￥</text>{{ good.goods_price }}<text>.00</text>
          </view>
        </view>
      </view>

    </scroll-view>
  </view>
</template>

<script>
import request from '@/utils/request'

export default {

  name: 'List',
  data () {
    return {
      list: [],
      pagenum: 1,
      pagesize: 10,
      total: 0
    }
  },
  methods: {
    goDetail () {
      uni.navigateTo({
        url: '/pages/goods/index'
      })
    }
  },
  methods: {
    async getList () {
      
      try {
        let { pagenum, pagesize, total, list } = this
        const { message } = await request({
          url: '/api/public/v1/goods/search',
          query: this.query,
          pagenum,
          pagesize
        })
        list = message.goods
        total = message.total
      } catch (error) {
        const { message } = error
        uni.showToast({
          title: message || '请求失败, 请重新尝试',
          icon: 'none'
        })

      }
    },
  },
  onLoad (params) {
    const { name } = params
    this.name = name
    this.getList()
  }

}
</script>

<style scoped lang="scss">
.filter {
  display: flex;
  height: 96rpx;
  line-height: 96rpx;
  border-bottom: 1rpx solid #ddd;

  /* #ifdef H5 */
  position: relative;
  z-index: 99;
  /* #endif */

  text {
    flex: 1;
    text-align: center;
    font-size: 30rpx;
    color: #333;

    &.active {
      color: #ea4451;
    }
  }
}

.goods {
  position: absolute;
  width: 100%;
  top: 97rpx;
  bottom: 0;
}

.item {
  display: flex;
  padding: 30rpx 20rpx 30rpx 0;
  margin-left: 20rpx;
  border-bottom: 1rpx solid #eee;

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
}
</style>
