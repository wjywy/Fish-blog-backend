---
title: 字节一面（第一次面试）
date: 2022-11-26 13:26:01
categories:
    - [杂谈,面试]
---

## 第一次面试记录

公司： 字节跳动-懂车帝

一面时间：2022-11-25 下午4:30-5:30

时长：1hour左右

HR印象：hr提前了3分钟进入会议室，年龄不大，语气很温和，有耐心，给了很多中肯的评价和指导

#### 面试内容

- 1，介绍最近做的项目

  - 回答：CLF平台···

- 2，你认为最有挑战的是什么，项目中遇到的

  - 回答：阿里终端训练营做的小项目···
  - hr评价：项目做的挺丰富，这点不错（这里有点开心，感觉回答上来了）

- 3，（看了下简历，可能他感觉有点多）你觉得你最擅长哪个技术栈？

  - 回答：vue，css，喜欢css动画（这里给自己挖坑）

- 4，先来个简单的css简答题？

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <style>
          .box{
              width: 10px;
              height: 10px;
              padding: 2px;
              margin: 2px;
              border: 1px solid red;
              background-color: blue;
          }
  
          .box1 {
              box-sizing: border-box;
          }
  
          .box2 {
              box-sizing: content-box;
          }
      </style>
  </head>
  <body>
      <div class="box1 box"></div>
      <div class="box2 box"></div>
  </body>
  </html>
  ```

  问：蓝色部分的面积分别是多少？

  回答：box1 = 10 * 10 ，box2 = 12 * 12

  这个答错了qaq（正确是8 * 8, 14 * 14），考的知识点是盒模型和怪异盒模型

- 5，说一说transition和animation的区别，什么情况使用？

  回答：transition一般是小的模块，单个dom或者只对dom内容少时使用，比如在图片放大缩小这种，而animation用的比较多，比如做一个长连续动画或者涉及多个dom变化的

  hr给我感觉：好像是答对了，也好像木有答对，就是总结了我混乱不清的言语

- 6，设置一个动画，从右向左逐渐拉伸边长，类似风车打开，说说想法

  回答：有点忘了怎么回答的（大致是从内置动画，或者结合js考虑显示或隐藏来调用动画）

- 7，考一下vue的知识，设计一个组件，有传入数据内置内容功能，也可以调控整个页面的蒙版，就是可以操控全局也可以设置组件内容的功能，说一说想法？（大致是这个意思，说实话，没怎么听懂）

  回答：也忘了怎么回答的

- 8，js算法

  ```javascript 1
  sum(1,2,3).sumOf() // 6
  sum(1,2,3)(4).sumOf() //10
  sum(1,2)(3)(4).sumOf() //···
  
  //后面还有，忘了
  ```

  问：设计js代码，输入结果等于后面的注释

​		这个题没写出来，知识点就是函数柯里化和闭包的封装

- 9，js算法

  ```javascript 数组转递归树
  const list = [
      { name: 'A', key: 1, parent: 0 },
      { name: 'B', key: 2, parent: 0 },
      { name: 'C', key: 3, parent: 1 },
      { name: 'D', key: 4, parent: 1 },
      { name: 'E', key: 5, parent: 3 },
      { name: 'F', key: 6, parent: 5 },
      { name: 'G', key: 7, parent: 2 },
  ]
  
  function reverseTree(list) {
  
  }
  
  const tree = reverseTree(list)
  
  console.log(tree);
  ```

  问：写出reverseTree()，使结果为递归树

  回答：

  ```javascript 数组转递归树
  function reverseTree(list) {
      var map = {}, node, tree= [], i;
      // 将数组所有节点用对象装取成树状
      for (i = 0; i < list.length; i++) {
          map[list[i].key] = list[i]; 
          list[i].children = []; 
      }
      for (i = 0; i < list.length; i++) {
          node = list[i];
          if (node.parent !== 0) {
              map[node.parent].children.push(node);
          } else {
              tree.push(node);
          }
      }
      return tree;
  }
  ```



面试官补充：你有什么想问的吗？

反问：你对我的评价是怎么样的？

hr：语言表达可以，项目也有特色，很多知识都有涉及，但是有点庞杂，显得不太精，需要多专一个知识，找一个方向特别精通的地步

hr：可以看看网络的知识，缓存，懒加载等等，比如三次握手和四次挥手，以及跨域····（我心想，这些你也没问也），vue更加深层的应用，毕竟不能只是应用技术，还要做拓展和深入研究，

我：这些我都学习了解了的

hr：没事，面试不是第一次，每次期待下一次（凉了！~）



### 总结

问的其实都不难，就是问的比较深入，喜欢搞一些大项目中的高阶用法，和很多多层封装考得多，个人认为确实要把一些技术搞的牢固一些，然后可以做自己的开源项目，用自己的熟悉技术不断迭代，高阶知识自然用上了。

第一次面试虽凉了，但是收获还是不错的，说紧张，也只是面试官没进入会议可能紧张，其他时候也就是写不出代码紧张了，在想什么呢（今晚吃啥呢，好吧，我在封寝~~~）



