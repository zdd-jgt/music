$(function(){
        var audio=$("#audio")[0];
        var play=$(".anniu");
        var pause=$(".pause");
        var progress=$(".progress");
        var p_i=$(".p-i");
        var curvent=$(".curvent-time");
        var duration=$(".duration");
        var volune=$(".volune");
        var v_i=$(".v-i");
        var w=progress.width();
        var currentIndex=0;
        var ul=$(".ul");
        var musics=[
            {
                name:"老街",
                author:"李荣浩",
                src:"yinyue/老街.mp3"
            },
            {
                name:"我希望",
                author:"杨功",
                src:"yinyue/我希望.mp3"
            },
            {
                name:"年少有你",
                author:"李易峰",
                src:"yinyue/年少有你.mp3"
            }
            
        ];
        
        
//      function render(){
//          $(".ul").empty();
//          $.each(musics,function(i,v){
//              var c=(i==currentIndex) ? "active" : "";
//              $("<li class='"+c+"'><span>"+v.name+"</span><span>"+v.author+"</span><div class='delete'></li>").appendTo($(".ul"));
//          })
//      }
        function render(){
            $(ul).empty();
            $.each(musics,function(i,v){
                var s=(i==currentIndex)?"active":"";
                $("<li class='"+s+"'><span>"+v.name+"</span><span>-"+v.author+"</span></div><div class='delete'></div><div class='shoucang'></li>").appendTo(ul);
            })
            $(".liebiao_head b").html(musics.length);
        }
        $(".ul").on("touchend","li",function(){
            $(".ul").find("li").removeClass("active");
            $(this).addClass("active");
            currentIndex=$(this).index();
            audio.src=musics[currentIndex].src;
            audio.play();
            audio.onended=function(){
                if(currentIndex>musics.length-1){
                    currentIndex=0;
                }
                 audio.src=musics[currentIndex].src;
                 audio.play();
            };
        })
        render();
    
    
         //时间
        function format(v){
            var v=Math.floor(v);
            var s=v%60;
            s=(s<10)?("0"+s):s;
            var m=Math.floor(v/60);
            return m+":"+s;
        }
        
        //开关
        play.on("touchend",function(){
            if(audio.paused){
                audio.play();
                $(this).removeClass("pause");
                $(this).addClass("play");
            }else {
                audio.pause();
                $(this).removeClass("play");
                $(this).addClass("pause");
            }
        });
        play.on("play",function(){
            $(this).removeClass("play");
            $(this).addClass("pause");
            console.log(1)
        })
        play.on("pause",function(){
             $(this).removeClass("pause");
             $(this).addClass("play");
        })
        
        //进度条
        p_i.on("touchend",false);
        progress.on("touchend",function(e){
            var offsetx=e.originalEvent.changedTouches[0].clientX;
            //火狐
//          var offsetx=e.originalEvent.clientX;
            audio.currentTime=offsetx / $(this).width() * audio.duration;
        })
        //进度条拖拽
        p_i.on("touchstart",function(e){    
//          var r=p_i.width()/2;
//          var offsetx=e.originalEvent.changedTouches[0].clientX;
//          var start=r-offsetx;
            $(document).on('touchmove',function(e){
                var left=e.originalEvent.changedTouches[0].clientX - progress.position().left;
                var c=left / progress.width() * audio.duration;
                if(c>=audio.duration||c<=0){
                    return;
                }
                audio.currentTime=c;
            })
            return false;
        });
        //取消按下
        $(document).on("touchend",function(){
            $(document).off("touchmove");
        })
        //音量
       var mute=$(".mute");
        v_i.on("touchend",false);
        volune.on("touchend",function(e){
            console.log(e)
            var offsetx=e.originalEvent.changedTouches[0].clientX;
            audio.volume=offsetx/volune.width();
            mute.removeAttr("aa");
        })
        //静音
        mute.on("touchend",function(){
            if($(this).attr("aa")){
                audio.volume=$(this).attr("aa");
                $(this).removeAttr("aa");
            }else{
                $(this).attr("aa",audio.volume);
                audio.volume= 0;
            }
        });
        
        $(audio).on("volumechange",function(){
            v_i.css("left",volune.width() * audio.volume-v_i.width() / 2);
        });
        //拖拽
       
        v_i.on("mousedown",function(e){
            var r=v_i.width()/2;
            var offsetx=e.originalEvent.changedTouches[0].clientX;
            var start=r-e.offsetx;
            $(document).on("mousemove",function(e){
                var m=e.originalEvent.changedTouches[0].clientX;
                var left=m-volune.position().left+start;
                var c=left/volune.width();
                if(c>1||c<0){
                    return;
                }
                audio.volume= c;
            });
            return false;
        })
        $(document).on("mouseup",function(){
            $(document).off("mousemove");
        })
        ////////////////////////
        
        //刪除

        ul.on("touchend",".delete",function(){
            console.log(this)
            var li=$(this).closest("li");
            var index=li.index();
            musics.splice(index,1);
            console.log(li)
            if(index===currentIndex){
                if(musics[currentIndex]){
                    audio.src=musics[currentIndex].src;
                }else{
                    audio.src="";
                }
            }else if(index>currentIndex){
                //不用管
            }else if(index<currentIndex){
                currentIndex-=1;
            }
            render();
        })
        //添加
        $('.son_tianjia').on("touchend",'div',function(){
            console.log(1)
            var d=$(this).attr("data-v");
            musics.push(JSON.parse(d));
            render();
        })
        //點擊切歌
        ul.on("touchend","li",function(){
            var index=$(this).index();
            currentIndex=index;
            audio.src=musics[currentIndex].src;
            render();
        })
        render();
        //上一首、下一首
        function prev(){
            currentIndex-=1;
            if(currentIndex===-1){
                currentIndex=musics.length-1;
            }
            audio.src=musics[currentIndex].src;
            render();
        }
        function next(){
            currentIndex+=1;
            if(currentIndex===musics.length){
                currentIndex=0;
            }
            audio.src=musics[currentIndex].src;
            render();
        }
        ///////pre_music
        $(".pre") .on("touchend",prev); 
        $(".next") .on("touchend",next); 
        //
        
        
        
        
        
        
//////////////////////////事件///////////////////////
        $(audio).on("volumechange",function(){
            //拖拽事件
            console.log('volumechange')
        })
        $(audio).on("loadstart",function(){
//          $("#son_list1").html(musics[currentIndex].name,musics[currentIndex].author)
            
           $(".head_zhong h1").html(musics[currentIndex].name)
           $(".head_zhong span").html(musics[currentIndex].author)
           $(".liebiao_head b").html(musics.length);
            console.log('loadstart');
//          var delete=$(".delete");
        })
        $(audio).on("progress",function(){
            console.log('lprogress')
            
        })
        $(audio).on("canplay",function(){
            audio.play();
            console.log('canplay')
            duration.html(format(audio.duration));
            
        })
        $(audio).on("play",function(){
            
            //最終時間
            console.log('play')
        })
        $(audio).on("pause",function(){
            console.log('pause')
        })
        $(audio).on("ended",function(){
            next();
            console.log('ended')
        })
        $(audio).on("timeupdate",function(){
            console.log('timeupdate')
            curvent.html(format(audio.currentTime));
            var width=w*audio.currentTime/audio.duration;
            p_i.css("width",width);    
        })
   ///////////////////////////////////////////////////////
   $(".qita_tu5").on("touchend",function(){
       $(".liebiao").addClass("liebiao_active");
   })
   $(".liebiao_foot").on("touchend",function(){
       $(".liebiao").removeClass("liebiao_active");
       
   })
});