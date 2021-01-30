// pages/ComponentS/LiuUpLoadImg/LiuUpLoadImg.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    upLoad:{ // 接收一个图片地址
      type:String,
      value:'./img/Photo.png'
    },
    imgLength:{
      type:Number,
      value:9
    },
    uploadUrl:{
      type:String,
    },
    showImgs:{
      type:Object,
      observer:function(){
        this.setData({group : this.data.showImgs})
      }
    },
    width:{
      type:Number,
      value:160
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    token:'',
    group:{
      showImg:[], // 展示
      saveArr:[]  // 上传
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    upLoad(){
      const that = this
      let temporarilyArr  =[]
      wx.chooseImage({
        count:this.data.imgLength,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res){
       let ArrLength = res.tempFilePaths.length
       let Arr = res.tempFilePaths
       wx.showLoading({
         title: '上传中',
       })
       that.setData({sendMSgSWitch : false })
       for(let i = 0; i < ArrLength ; i++){
        wx.uploadFile({
          filePath: Arr[i],
          name: 'file',
          header:{
            token:that.data.token
          },
          url: that.data.uploadUrl,
          success(r){
            let analysis = JSON.parse(r.data)
            temporarilyArr.push(analysis.data.url)
            that.data.group.saveArr.push(analysis.data.url)
            that.data.group.showImg.push(analysis.data.fullurl)
            if(ArrLength === temporarilyArr.length){
               that.setData({group : that.data.group})
                that.triggerEvent('getImgs',{
                  imgUrl:that.data.group.saveArr,
                  switch:true
                })
                wx.hideLoading()
                wx.showToast({
                  title: '上传完成',
                })
            }
            },
        })
       }
      }
      })
    },
    close(e){
      let index = e.currentTarget.dataset.index //get到下标
      this.data.group.saveArr.splice(index,1)
      this.data.group.showImg.splice(index,1)
      this.setData({ group : this.data.group })
      this.triggerEvent('getImgs',{
        imgUrl:this.data.group.saveArr,
        switch:''
      })
    }
  },
  lifetimes:{
    attached:function(){
      const that = this
      wx.getStorage({
        key: 'token',
        success(res){
          that.setData({token : res.data})
        }
      })

      this.triggerEvent('getImgs',{
        imgUrl:this.data.group.saveArr,
        switch:true
      })
    }
  }
})
