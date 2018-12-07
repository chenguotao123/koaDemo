$(function(){
    // 初始化数据列表
    function initList(){
        $.ajax({
            type : 'get',
            url : '/index',
            dataType : 'json',
            success : function(data){
                // console.log(data)
                if (data.length == 0) {
                  $('#noData').show()
                }else {
                  $('#noData').hide()
                }
                // 渲染数据列表
                var html = template('indexTpl',{list : data});
                $('#dataList').html(html);
                // 必须在渲染完成内容之后才可以操作DOM标签
                $('#dataList').find('tr').each(function(index,element){
                    var td = $(element).find('td:eq(6)');
                    var id = $(element).find('td:eq(0)').text();
                    // 绑定编辑图书的单击事件
                    td.find('a:eq(0)').click(function(){
                        editBook(id);
                    });
                    // 绑定删除图书的单击事件
                    td.find('a:eq(1)').click(function(){
                        deleteBook(id);
                    });
                });
            }
        });
    }
    initList();
    // 删除图书信息
    function deleteBook(id){
        $.ajax({
            type : 'delete',
            url : '/books/book/' + id,
            dataType : 'json',
            success : function(data){
                // 删除图书信息之后重新渲染数据列表
                if(data.flag == '1'){
                    initList();
                }
            }
        });
    }


    // 上传图片到nodejs后台
    var fileImg = {};
    if($('#imgshow').attr('src') == ""){
      $('#imgshow').hide();
    }else{
      $('#imgshow').show();
    }
    //在input file内容改变的时候触发事件
    $('#fileImg').change(function(){
      fileImg = this.files;
      //获取input file的files文件数组;
      //$('#fileImg')获取的是jQuery对象，.get(0)转为原生对象;
      //这边默认只能选一个，但是存放形式仍然是数组，所以取第一个元素使用[0];
      var file = $('#fileImg').get(0).files[0];
      //创建用来读取此文件的对象
      var reader = new FileReader();
      //使用该对象读取file文件
      reader.readAsDataURL(file);
      //读取文件成功后执行的方法函数
      reader.onload=function(e){
        //读取成功后返回的一个参数e，整个的一个进度事件
        // console.log(e);
        //选择所要显示图片的img，要赋值给img的src就是e中target下result里面
        //的base64编码格式的地址
        $('#imgshow').get(0).src = e.target.result;
        if($('#imgshow').attr('src') == ""){
          $('#imgshow').hide();
        }else{
          $('#imgshow').show();
        }
      }
    })
    // 编辑图书信息
    function editBook(id){
        var form = $('#addBookForm');
        // 先根据数据id查询最新的数据
        $.ajax({
            type : 'get',
            url : '/books/book/' + id,
            dataType : 'json',
            success : function(data){
                // 显示弹窗
                $('#addMask').fadeIn(300).find('.tit').text('编辑图片');
                // 填充表单数据
                form.find('input[name=id]').val(data.id);
                form.find('input[name=name]').val(data.name);
                form.find('input[name=author]').val(data.author);
                form.find('input[name=category]').val(data.category);
                form.find('input[name=description]').val(data.description);
                form.find('#imgshow').show().attr('src',data.img);
                // form.find('input[name=img]').val(data.img);
                
                // 对表单提交按钮重新绑定单击事件
                form.find('input[type=button]').unbind('click').click(function(){
                    var filearr = [];
                    var formData = new FormData();  
                    for(var i = 0;i < fileImg.length;i++){
                        filearr.push(fileImg[i]);
                    }              
                    for(var i =0;i<filearr.length;i++){    // 提交时，我们把filearr中的数据遍历一遍
                        formData.append("file", filearr[i]); // 用append添加到formData中，就得用户最终要提交的图片了，多张的话[]必须    
                    }
                    // 判断图片是否有改变，没改变则不上传
                    if (JSON.stringify(fileImg) == "{}") {
                      $.ajax({
                        type : 'put',
                        url : '/books/book',
                        data : form.serialize(),
                        dataType : 'json',
                        success : function(data){
                            if(data.flag == '1'){
                                // 隐藏弹窗
                                // mark.close();
                                $('#addMask').fadeOut(300);
                                // 重新渲染数据列表
                                initList();             
                                // 重置表单
                                resetInput();
                            }
                        }
                      });
                    } else {
                      // 先上传图片
                      $.ajax({
                        type : "POST",  
                        url : "/books/upload",  //请求路径
                        data : formData,  
                        cache: false,
                        contentType: false,
                        processData: false,
                        success : function(res){
                          if (res.code === 200) {
                            const img = res.url[0];
                            var params = form.serialize() + "&img=" + img;
                            // 编辑完成数据之后重新提交表单
                            $.ajax({
                              type : 'put',
                              url : '/books/book',
                              data : params,
                              dataType : 'json',
                              success : function(data){
                                  if(data.flag == '1'){
                                      // 隐藏弹窗
                                      // mark.close();
                                      $('#addMask').fadeOut(300);
                                      // 重新渲染数据列表
                                      initList();             
                                      // 重置表单
                                      resetInput();
                                  }
                              }
                            });
                          }
                        }
                      });
                    }

                });
            }
        });
    }

    // 添加图书信息
    $('#addBookId').unbind('click').click(function(){
        var form = $('#addBookForm');
        // 显示弹窗
        $('#addMask').fadeIn(300).find('.tit').text('添加图片');
        form.find('input[type=button]').unbind('click').click(function(){
              var filearr = [];
              var formData = new FormData();  
              for(var i = 0;i < fileImg.length;i++){
                  filearr.push(fileImg[i]);
              }              
              for(var i =0;i<filearr.length;i++){    // 提交时，我们把filearr中的数据遍历一遍
                  formData.append("file", filearr[i]); // 用append添加到formData中，就得用户最终要提交的图片了，多张的话[]必须    
              }
              // 先上传图片
              $.ajax({
                type : "POST",  
                url : "/books/upload",  //请求路径
                data : formData,  
                cache: false,
                contentType: false,
                processData: false,
                success : function(res){
                  if (res.code === 200) {
                    const img = res.url[0];
                    var params = form.serialize() + "&img=" + img
                    // 再把图片地址和其他信息提交到后台储存
                    $.ajax({
                      type : 'post',
                      url : '/books/book',
                      data : params,
                      dataType : 'json',
                      success : function(data){
                          if(data.flag == '1'){
                              // 关闭弹窗
                              // mark.close();
                              $('#addMask').fadeOut(300);
                              // 添加图书成功之后重新渲染数据列表
                              initList();
                              // 重置表单
                              resetInput();
                          }
                      }
                    });
                  }
                }
              });
          });
    });

    // 关闭添加或编辑操作
    $('.closeMask').on('click', function(){
      $('#addMask').hide();
      // 重置表单
      resetInput();
    })

    // 重置表单
    function resetInput () {    
      // 重置表单
      var form = $('#addBookForm');
      form.get(0).reset();
      form.find('input[type=hidden]').val('');
      form.find('#imgshow').attr('src','').hide();
    }


    // ======================以下为单图和多图上传功能实现与图片管理无关=================================
    // 上传图片到nodejs后台
    var files = {};
    $("#fileInput").on('change',function(e){
      files = this.files;
   })
   $('#imgBtn').on('click',function(){
    var filearr = [];
    var formData = new FormData();  
    for(var i = 0;i < files.length;i++){
        filearr.push(files[i]);
    }              
    for(var i =0;i<filearr.length;i++){    // 提交时，我们把filearr中的数据遍历一遍
        formData.append("file", filearr[i]); // 用append添加到formData中，就得用户最终要提交的图片了，多张的话[]必须    
    }
     $.ajax({  
       type : "POST",  
       url : "/upLoadImg",  //请求路径
       data : formData,  
       cache: false,
       contentType: false,
       processData: false,
       success:function(data) { 
        //  console.log(data)
         if (data.code === 200) {
           // $('#fileImg').attr('src',data.data);
           const urls = data.url;
           // 将后台返回的图片地址追加到页面
           let html = "";
           for (let i=0;i<urls.length;i++) {
             html += `<img src="${urls[i]}">`;
           }
           $('#imgBox').append(html);
         }
       },
       error:function(err){
           alert("上传失败");
       }
     });
   })

});