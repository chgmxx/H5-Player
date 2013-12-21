H5-Player
=========

基于HTML5的视频播放器

##功能概述
- 显示视频当前播放时长、总时长
- 显示视频当前播放进度、缓冲进度
- 开始、暂停

##代码示例
---
```
<body>
  <div id="container" style="width:640px; height:480px;">
  </div>
  <script>
    var player = new H5.Player("container");  
    player.setSize(640, 480);  
    player.load("demo.mp4");
  </script>
</body>
