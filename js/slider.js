(function(t, i, s) {
    var l = function(i, s) {
        this.ele = i;
        this.defaults = {
            width: 300,
            height: 34,
            sliderBg: "#e8e8e8",
            color: "#666",
            fontSize: 12,
            bgColor: "#7ac23c",
            textMsg: "请按住滑块，拖动到最右边",
            successMsg: "验证成功",
            successColor: "#fff",
            time: 160,
            callback: function(t) {}
        };
        this.opts = t.extend({}, this.defaults, s);
        this.init()
    };
    l.prototype = {
        init: function() {
            this.result = false;
            this.sliderBtn_left = 0;
            this.maxLeft = this.opts.width - this.opts.height;
            this.render();
            this.eventBind()
        },
        render: function() {
            var t = '<div class="ui-slider-wrap">' + '<div class="ui-slider-text ui-slider-no-select">' + this.opts.textMsg + "</div>" + '<div class="ui-slider-btn init ui-slider-no-select"></div>' + '<div class="ui-slider-bg"></div>' + "</div>";
            this.ele.html(t);
            this.initStatus()
        },
        initStatus: function() {
            var t = this;
            var i = this.ele;
            this.slider = i.find(".ui-slider-wrap");
            this.sliderBtn = i.find(".ui-slider-btn");
            this.bgColor = i.find(".ui-slider-bg");
            this.sliderText = i.find(".ui-slider-text");
            this.slider.css({
                width: t.opts.width,
                height: t.opts.height,
                backgroundColor: t.opts.sliderBg
            });
            this.sliderBtn.css({
                width: t.opts.height,
                height: t.opts.height,
                lineHeight: t.opts.height + "px"
            });
            this.bgColor.css({
                height: t.opts.height,
                backgroundColor: t.opts.bgColor
            });
            this.sliderText.css({
                lineHeight: t.opts.height + "px",
                fontSize: t.opts.fontSize,
                color: t.opts.color
            })
        },
        restore: function() {
            var t = this;
            var i = t.opts.time;
            this.result = false;
            this.initStatus();
            this.sliderBtn.removeClass("success").animate({
                left: 0
            }, i);
            this.bgColor.animate({
                width: 0
            }, i, function() {
                t.sliderText.text(t.opts.textMsg)
            })
        },
        eventBind: function() {
            var t = this;
            this.ele.on("mousedown", ".ui-slider-btn", function(i) {
                if(t.result) {
                    return
                }
                t.sliderMousedown(i)
            })

            $('.ui-slider-btn').get(0).addEventListener('touchstart',function(i){
                if(t.result) {
                    return
                }
                t.slidertouchstart(i)
            })
        },
        slidertouchstart: function(t){
            var i = this;
            var s = t.touches[0].clientX;
            var e = s - this.sliderBtn.offset().left;
            i.slidertouchmove(s, e);
            i.slidertouchup()
        },
        slidertouchmove: function(i,e){
            var l = this;
            $('.ui-slider-btn').get(0).addEventListener('touchmove',function(t){
                if(l.result) return;
                window.getSelection().removeAllRanges();
                l.sliderBtn_left = t.touches[0].clientX - i - e;
                if(l.sliderBtn_left < 0) {
                    return
                }
                if(l.sliderBtn_left > l.maxLeft) {
                    l.sliderBtn_left = l.maxLeft
                }
                l.sliderBtn.css("left", l.sliderBtn_left);
                l.bgColor.width(l.sliderBtn_left)
            })
        },
        slidertouchup: function(){
            var i = this;
            $('.ui-slider-btn').get(0).addEventListener('touchend',function(t){
                if(i.sliderBtn_left != i.maxLeft) {
                    i.sliderBtn_left = 0
                } else {
                    i.ele.find(".ui-slider-text").text(i.opts.successMsg).css({
                        color: i.opts.successColor
                    });
                    i.ele.find(".ui-slider-btn").addClass("success");
                    i.result = true;
                }
                i.sliderBtn.animate({
                    left: i.sliderBtn_left
                }, i.opts.time);
                i.bgColor.animate({
                    width: i.sliderBtn_left
                }, i.opts.time);
                $('.ui-slider-btn').get(0).ontouchmove = null;
                if(i.opts.callback && typeof i.opts.callback === "function") {
                    i.opts.callback(i.result)
                }
            })
        },
        sliderMousedown: function(t) {
            var i = this;
            var s = t.clientX;
            var e = s - this.sliderBtn.offset().left;
            i.sliderMousemove(s, e);
            i.sliderMouseup()
        },
        sliderMousemove: function(i, e) {
            var l = this;
            t(s).on("mousemove.slider", function(t) {
                window.getSelection().removeAllRanges();
                l.sliderBtn_left = t.clientX - i - e;
                if(l.sliderBtn_left < 0) {
                    return
                }
                if(l.sliderBtn_left > l.maxLeft) {
                    l.sliderBtn_left = l.maxLeft
                }
                l.sliderBtn.css("left", l.sliderBtn_left);
                l.bgColor.width(l.sliderBtn_left)
            })
        },
        sliderMouseup: function() {
            var i = this;
            t(s).on("mouseup.slider", function() {
                if(i.sliderBtn_left != i.maxLeft) {
                    i.sliderBtn_left = 0
                } else {
                    i.ele.find(".ui-slider-text").text(i.opts.successMsg).css({
                        color: i.opts.successColor
                    });
                    i.ele.find(".ui-slider-btn").addClass("success");
                    i.result = true
                }
                i.sliderBtn.animate({
                    left: i.sliderBtn_left
                }, i.opts.time);
                i.bgColor.animate({
                    width: i.sliderBtn_left
                }, i.opts.time);
                t(this).off("mousemove.slider mouseup.slider");
                if(i.opts.callback && typeof i.opts.callback === "function") {
                    i.opts.callback(i.result)
                }
            })
        }
    };

    t.fn.extend({
        slider : function(i) {
            return this.each(function() {
                var s = t(this);
                var e = s.data("slider");
                if(!e) {
                    e = new l(s, i);
                    s.data("slider", e)
                }
                if(typeof i === "string") {
                    e[i]()
                }
            })
        }
    })
    /*t.fn.slider = function(i) {
        return this.each(function() {
            var s = t(this);
            var e = s.data("slider");
            if(!e) {
                e = new l(s, i);
                s.data("slider", e)
            }
            if(typeof i === "string") {
                e[i]()
            }
        })
    }*/
})(jQuery, window, document);
