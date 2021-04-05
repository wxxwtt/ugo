<template>
  <view>
    <!-- 筛选 -->
    <view class="filter">
      <text class="active">综合</text>
      <text>销量</text>
      <text>价格</text>
    </view>
    <!-- 商品列表 -->
    
      <view v-if="showNoData" class="no-data">暂未找到该商品！</view>
      <scroll-view v-else class="goods" scroll-y @scrolltolower="reachBottomHandle">
        <view class="item" v-for="good in list" :key="good.goods_id" @click="goDetail()">
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
        <view v-if="noMore" class="no-more">- 我是有底线的 -</view>
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
      total: 0,
      search: '',
      loading: false,
      noMore: false
    }
  },
  computed: {
    showNoData () {
      const { list, pagenum, loading } = this
      return !list.length && pagenum === 1 && !loading
    }
  },
  methods: {
    goDetail () {
      console.log(11111);
      // uni.navigateTo({
      //   url: '/pages/goods/index'
      // })
    }
  },
  methods: {
    async getList () {

      try {
        let { pagenum, pagesize, list, search } = this
        this.loading = true
        const { message } = await request({
          url: '/api/public/v1/goods/search',
          data: {
            query: search,
            pagenum,
            pagesize
          }
        })
        this.loading = false
        list.push(...message.goods)
        this.total = message.total
        if (this.total > pagenum * pagesize) {
          this.pagenum++
        }else {
          this.noMore = true
        }
        
      } catch (error) {
        const { message } = error
        uni.showToast({
          title: message || '请求失败, 请重新尝试',
          icon: 'none'
        })

      }
    },
    reachBottomHandle () {
      if(!this.noMore) {
        this.getList()
        
      }
    }
  },
  onLoad (params) {
    const { name } = params
    this.search = name
    this.getList()
  },


}
</script>

<style scoped lang="scss">
.no-data {
  text-align: center;
  line-height: 60vh;
  color: #999;
}
.no-more {
  text-align: center;
  line-height: 60rpx;
  color: #999;
}
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
