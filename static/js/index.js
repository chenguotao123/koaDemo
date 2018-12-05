$(function(){
    // 初始化数据列表
    function initList(){
        $.ajax({
            type : 'get',
            url : '/index',
            dataType : 'json',
            success : function(data){
              console.log(data)
                // 渲染数据列表
                var html = template('indexTpl',{list : data});
                $('#dataList').html(html);
                // 必须在渲染完成内容之后才可以操作DOM标签

                $('#dataList').find('tr').each(function(index,element){
                    var td = $(element).find('td:eq(5)');
                    var id = $(element).find('td:eq(0)').text();
                    // 绑定编辑图书的单击事件
                    td.find('a:eq(0)').click(function(){
                        editBook(id);
                    });
                    // 绑定删除图书的单击事件
                    td.find('a:eq(1)').click(function(){
                        deleteBook(id);
                    });

                    // 绑定添加图书信息的单击事件
                    addBook();
                    // 重置表单
                    var form = $('#addBookForm');
                    form.get(0).reset();
                    form.find('input[type=hidden]').val('');
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

    // 编辑图书信息
    function editBook(id){
        var form = $('#addBookForm');
        // 先根据数据id查询最新的数据
        $.ajax({
            type : 'get',
            url : '/books/book/' + id,
            dataType : 'json',
            success : function(data){
                // 初始化弹窗
                var mark = new MarkBox(600,400,'编辑图书',form.get(0));
                mark.init();
                // 填充表单数据
                form.find('input[name=id]').val(data.id);
                form.find('input[name=name]').val(data.name);
                form.find('input[name=author]').val(data.author);
                form.find('input[name=category]').val(data.category);
                form.find('input[name=description]').val(data.description);
                // 对表单提交按钮重新绑定单击事件
                form.find('input[type=button]').unbind('click').click(function(){
                    // 编辑完成数据之后重新提交表单
                    $.ajax({
                        type : 'put',
                        url : '/books/book',
                        data : form.serialize(),
                        dataType : 'json',
                        success : function(data){
                            if(data.flag == '1'){
                                // 隐藏弹窗
                                mark.close();
                                // 重新渲染数据列表
                                initList();
                            }
                        }
                    });
                });
            }
        });
    }

    // 添加图书信息
    function addBook(){
        $('#addBookId').click(function(){
            var form = $('#addBookForm');
            // 实例化弹窗对象
            var mark = new MarkBox(600,400,'添加图书',form.get(0));
            mark.init();
            form.find('input[type=button]').unbind('click').click(function(){
                $.ajax({
                    type : 'post',
                    url : '/books/book',
                    data : form.serialize(),
                    dataType : 'json',
                    success : function(data){
                        if(data.flag == '1'){
                            // 关闭弹窗
                            mark.close();
                            // 添加图书成功之后重新渲染数据列表
                            initList();
                        }
                    }
                });
            });
        });
    }

    // 上传图片到nodejs后台
    $("#fileInput").on('change',function(e){
      var filearr = [];
      var files = this.files;
      var formData = new FormData();  
      // console.log(files)
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
          console.log(data)
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