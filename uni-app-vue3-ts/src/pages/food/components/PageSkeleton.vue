<template name="skeleton">
    <view class="sk-container">
        <view class="data-v-dccd5ad7 data-v-dccd5ad7" style="height:calc(80px  + 44px)"></view>
        <view is="components/sdSwiper" class="data-v-dccd5ad7 data-v-dccd5ad7">
            <view class="carousel sdSwiper--carousel">
                <swiper :circular="true" :interval="3000" :current="0" :autoplay="false">
                    <swiper-item
                        style="position: absolute; width: 100%; height: 100%; transform: translate(0%, 0px) translateZ(0px);">
                        <navigator class="navigator sdSwiper--navigator" hover-class="none">
                            <image class="image sdSwiper--image sk-image" mode="aspectFill"></image>
                        </navigator>
                    </swiper-item>
                </swiper>
                <view class="indicator sdSwiper--indicator">
                    <text class="dot sdSwiper--dot active sdSwiper--active"></text>
                    <text class="dot sdSwiper--dot"></text>
                    <text class="dot sdSwiper--dot"></text>
                    <text class="dot sdSwiper--dot"></text>
                    <text class="dot sdSwiper--dot"></text>
                </view>
            </view>
        </view>
        <view is="pages/food/components/categoryPanel" class="data-v-dccd5ad7 data-v-dccd5ad7">
            <view class="category categoryPanel--category">
                <navigator class="category-item categoryPanel--category-item" hover-class="none">
                    <image class="icon categoryPanel--icon sk-image"></image>
                    <text class="text categoryPanel--text sk-transparent sk-text-14-2857-639 sk-text"
                        style="background-position-x: 50%;">居家</text>
                </navigator>
                <navigator class="category-item categoryPanel--category-item" hover-class="none">
                    <image class="icon categoryPanel--icon sk-image"></image>
                    <text class="text categoryPanel--text sk-transparent sk-text-14-2857-370 sk-text"
                        style="background-position-x: 50%;">锦鲤</text>
                </navigator>
                <navigator class="category-item categoryPanel--category-item" hover-class="none">
                    <image class="icon categoryPanel--icon sk-image"></image>
                    <text class="text categoryPanel--text sk-transparent sk-text-14-2857-584 sk-text"
                        style="background-position-x: 50%;">服饰</text>
                </navigator>
                <navigator class="category-item categoryPanel--category-item" hover-class="none">
                    <image class="icon categoryPanel--icon sk-image"></image>
                    <text class="text categoryPanel--text sk-transparent sk-text-14-2857-258 sk-text"
                        style="background-position-x: 50%;">母婴</text>
                </navigator>
                <navigator class="category-item categoryPanel--category-item" hover-class="none">
                    <image class="icon categoryPanel--icon sk-image"></image>
                    <text class="text categoryPanel--text sk-transparent sk-text-14-2857-447 sk-text"
                        style="background-position-x: 50%;">个护</text>
                </navigator>
                <navigator class="category-item categoryPanel--category-item" hover-class="none">
                    <image class="icon categoryPanel--icon sk-image"></image>
                    <text class="text categoryPanel--text sk-transparent sk-text-14-2857-92 sk-text"
                        style="background-position-x: 50%;">严选</text>
                </navigator>
                <navigator class="category-item categoryPanel--category-item" hover-class="none">
                    <image class="icon categoryPanel--icon sk-image"></image>
                    <text class="text categoryPanel--text sk-transparent sk-text-14-2857-893 sk-text"
                        style="background-position-x: 50%;">数码</text>
                </navigator>
                <navigator class="category-item categoryPanel--category-item" hover-class="none">
                    <image class="icon categoryPanel--icon sk-image"></image>
                    <text class="text categoryPanel--text sk-transparent sk-text-14-2857-984 sk-text"
                        style="background-position-x: 50%;">运动</text>
                </navigator>
                <navigator class="category-item categoryPanel--category-item" hover-class="none">
                    <image class="icon categoryPanel--icon sk-image"></image>
                    <text class="text categoryPanel--text sk-transparent sk-text-14-2857-858 sk-text"
                        style="background-position-x: 50%;">杂项</text>
                </navigator>
                <navigator class="category-item categoryPanel--category-item" hover-class="none">
                    <image class="icon categoryPanel--icon sk-image"></image>
                    <text class="text categoryPanel--text sk-transparent sk-text-14-2857-990 sk-text"
                        style="background-position-x: 50%;">品牌</text>
                </navigator>
            </view>
        </view>
        <view is="pages/food/components/hotPanel" class="data-v-dccd5ad7 data-v-dccd5ad7">
            <view class="panel hotPanel--panel hot hotPanel--hot">
                <view class="item hotPanel--item">
                    <view class="title hotPanel--title">
                        <text
                            class="title-text hotPanel--title-text sk-transparent sk-text-14-2857-506 sk-text">特惠推荐</text>
                        <text
                            class="title-desc hotPanel--title-desc sk-transparent sk-text-14-2857-863 sk-text">精选全攻略</text>
                    </view>
                    <navigator class="cards hotPanel--cards" hover-class="none">
                        <image class="image hotPanel--image sk-image" mode="aspectFit"></image>
                        <image class="image hotPanel--image sk-image" mode="aspectFit"></image>
                    </navigator>
                </view>
                <view class="item hotPanel--item">
                    <view class="title hotPanel--title">
                        <text
                            class="title-text hotPanel--title-text sk-transparent sk-text-14-2857-135 sk-text">爆款推荐</text>
                        <text
                            class="title-desc hotPanel--title-desc sk-transparent sk-text-14-2857-208 sk-text">最受欢迎</text>
                    </view>
                    <navigator class="cards hotPanel--cards" hover-class="none">
                        <image class="image hotPanel--image sk-image" mode="aspectFit"></image>
                        <image class="image hotPanel--image sk-image" mode="aspectFit"></image>
                    </navigator>
                </view>
                <view class="item hotPanel--item">
                    <view class="title hotPanel--title">
                        <text
                            class="title-text hotPanel--title-text sk-transparent sk-text-14-2857-58 sk-text">一站买全</text>
                        <text
                            class="title-desc hotPanel--title-desc sk-transparent sk-text-14-2857-320 sk-text">精心优选</text>
                    </view>
                    <navigator class="cards hotPanel--cards" hover-class="none">
                        <image class="image hotPanel--image sk-image" mode="aspectFit"></image>
                        <image class="image hotPanel--image sk-image" mode="aspectFit"></image>
                    </navigator>
                </view>
                <view class="item hotPanel--item">
                    <view class="title hotPanel--title">
                        <text
                            class="title-text hotPanel--title-text sk-transparent sk-text-14-2857-941 sk-text">新鲜好物</text>
                        <text
                            class="title-desc hotPanel--title-desc sk-transparent sk-text-14-2857-807 sk-text">生活加分项</text>
                    </view>
                    <navigator class="cards hotPanel--cards" hover-class="none">
                        <image class="image hotPanel--image sk-image" mode="aspectFit"></image>
                        <image class="image hotPanel--image sk-image" mode="aspectFit"></image>
                    </navigator>
                </view>
            </view>
        </view>
    </view>
</template>


<style>
.sk-transparent {
    color: transparent !important;
}

.sk-text-3-5714-593 {
    background-image: linear-gradient(transparent 3.5714%, #EEEEEE 0%, #EEEEEE 96.4286%, transparent 0%) !important;
    background-size: 100% 28.0000rpx;
    position: relative !important;
}

.sk-text {
    background-origin: content-box !important;
    background-clip: content-box !important;
    background-color: transparent !important;
    color: transparent !important;
    background-repeat: repeat-y !important;
}

.sk-text-14-2857-642 {
    background-image: linear-gradient(transparent 14.2857%, #EEEEEE 0%, #EEEEEE 85.7143%, transparent 0%) !important;
    background-size: 100% 39.2000rpx;
    position: relative !important;
}

.sk-text-14-2857-639 {
    background-image: linear-gradient(transparent 14.2857%, #EEEEEE 0%, #EEEEEE 85.7143%, transparent 0%) !important;
    background-size: 100% 36.4000rpx;
    position: relative !important;
}

.sk-text-14-2857-370 {
    background-image: linear-gradient(transparent 14.2857%, #EEEEEE 0%, #EEEEEE 85.7143%, transparent 0%) !important;
    background-size: 100% 36.4000rpx;
    position: relative !important;
}

.sk-text-14-2857-584 {
    background-image: linear-gradient(transparent 14.2857%, #EEEEEE 0%, #EEEEEE 85.7143%, transparent 0%) !important;
    background-size: 100% 36.4000rpx;
    position: relative !important;
}

.sk-text-14-2857-258 {
    background-image: linear-gradient(transparent 14.2857%, #EEEEEE 0%, #EEEEEE 85.7143%, transparent 0%) !important;
    background-size: 100% 36.4000rpx;
    position: relative !important;
}

.sk-text-14-2857-447 {
    background-image: linear-gradient(transparent 14.2857%, #EEEEEE 0%, #EEEEEE 85.7143%, transparent 0%) !important;
    background-size: 100% 36.4000rpx;
    position: relative !important;
}

.sk-text-14-2857-92 {
    background-image: linear-gradient(transparent 14.2857%, #EEEEEE 0%, #EEEEEE 85.7143%, transparent 0%) !important;
    background-size: 100% 36.4000rpx;
    position: relative !important;
}

.sk-text-14-2857-893 {
    background-image: linear-gradient(transparent 14.2857%, #EEEEEE 0%, #EEEEEE 85.7143%, transparent 0%) !important;
    background-size: 100% 36.4000rpx;
    position: relative !important;
}

.sk-text-14-2857-984 {
    background-image: linear-gradient(transparent 14.2857%, #EEEEEE 0%, #EEEEEE 85.7143%, transparent 0%) !important;
    background-size: 100% 36.4000rpx;
    position: relative !important;
}

.sk-text-14-2857-858 {
    background-image: linear-gradient(transparent 14.2857%, #EEEEEE 0%, #EEEEEE 85.7143%, transparent 0%) !important;
    background-size: 100% 36.4000rpx;
    position: relative !important;
}

.sk-text-14-2857-990 {
    background-image: linear-gradient(transparent 14.2857%, #EEEEEE 0%, #EEEEEE 85.7143%, transparent 0%) !important;
    background-size: 100% 36.4000rpx;
    position: relative !important;
}

.sk-text-14-2857-506 {
    background-image: linear-gradient(transparent 14.2857%, #EEEEEE 0%, #EEEEEE 85.7143%, transparent 0%) !important;
    background-size: 100% 44.8000rpx;
    position: relative !important;
}

.sk-text-14-2857-863 {
    background-image: linear-gradient(transparent 14.2857%, #EEEEEE 0%, #EEEEEE 85.7143%, transparent 0%) !important;
    background-size: 100% 33.6000rpx;
    position: relative !important;
}

.sk-text-14-2857-135 {
    background-image: linear-gradient(transparent 14.2857%, #EEEEEE 0%, #EEEEEE 85.7143%, transparent 0%) !important;
    background-size: 100% 44.8000rpx;
    position: relative !important;
}

.sk-text-14-2857-208 {
    background-image: linear-gradient(transparent 14.2857%, #EEEEEE 0%, #EEEEEE 85.7143%, transparent 0%) !important;
    background-size: 100% 33.6000rpx;
    position: relative !important;
}

.sk-text-14-2857-58 {
    background-image: linear-gradient(transparent 14.2857%, #EEEEEE 0%, #EEEEEE 85.7143%, transparent 0%) !important;
    background-size: 100% 44.8000rpx;
    position: relative !important;
}

.sk-text-14-2857-320 {
    background-image: linear-gradient(transparent 14.2857%, #EEEEEE 0%, #EEEEEE 85.7143%, transparent 0%) !important;
    background-size: 100% 33.6000rpx;
    position: relative !important;
}

.sk-text-14-2857-941 {
    background-image: linear-gradient(transparent 14.2857%, #EEEEEE 0%, #EEEEEE 85.7143%, transparent 0%) !important;
    background-size: 100% 44.8000rpx;
    position: relative !important;
}

.sk-text-14-2857-807 {
    background-image: linear-gradient(transparent 14.2857%, #EEEEEE 0%, #EEEEEE 85.7143%, transparent 0%) !important;
    background-size: 100% 33.6000rpx;
    position: relative !important;
}

.sk-text-14-2857-321 {
    background-image: linear-gradient(transparent 14.2857%, #EEEEEE 0%, #EEEEEE 85.7143%, transparent 0%) !important;
    background-size: 100% 44.8000rpx;
    position: relative !important;
}

.sk-text-14-2857-41 {
    background-image: linear-gradient(transparent 14.2857%, #EEEEEE 0%, #EEEEEE 85.7143%, transparent 0%) !important;
    background-size: 100% 44.8000rpx;
    position: relative !important;
}

.sk-button {
    color: #EFEFEF !important;
    background: #EFEFEF !important;
    border: none !important;
    box-shadow: none !important;
}

.sk-image {
    background: #EFEFEF !important;
}

.sk-pseudo::before,
.sk-pseudo::after {
    background: #EFEFEF !important;
    background-image: none !important;
    color: transparent !important;
    border-color: transparent !important;
}

.sk-pseudo-rect::before,
.sk-pseudo-rect::after {
    border-radius: 0 !important;
}

.sk-pseudo-circle::before,
.sk-pseudo-circle::after {
    border-radius: 50% !important;
}

.sk-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: transparent;
}
</style>