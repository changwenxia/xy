
### xy-click-outside 

<blockquote class="green-tip">
  <p>clickoutside是一个自定义指令，该指令用来处理目标节点之外的点击事件，常用来处理下拉菜单等展开内容的关闭。</p>
</blockquote>

#### 代码实现：
```vue
<template>
  <div>
    <div class="main" v-click-outside="handleClose">
      <button @click="show=!show">点击显示下拉菜单</button>
      <div class="dropdown" v-show="show">
        <p>下拉框的内容，点击外面区域可以关闭</p>
      </div>
    </div>
  </div>    
</template>
    
<script>
import {clickOutside} from "@xiyun/utils";

export default {
    name: 'XyClickoutside',
    directives: {
        'click-outside': clickOutside,
    },
    data() {
        return {
            show:false,
        }
    },
    methods: {
        handleClose() {
            this.show = false;
        }
    }
}
</script>
```
