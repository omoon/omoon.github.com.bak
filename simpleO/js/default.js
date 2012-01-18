/**
 * スクロール管理クラス
 *
 */
var Scroller = function() {

    /**
     * 初期化が終わっているかどうか
     */
    this.is_initialized = false;

    /**
     * ズレの値
     */
    this.shift_num = 0;

    /**
     * 右始まりかどうか
     */
    this.is_right_start = false;
    this.max_box_num = 7;

    this.height_of_viewer = 595;

    this.padding_of_scandata_wrapper = 490;

    this.default_height_of_scandata = 128;
    this.height_of_scandata = this.default_height_of_scandata;
    this.width_of_scandata = 0;

    this.viewer_frame = '';
    this.scandata = '';
    this.scandata_area = '';
    this.scandata_wrapper = '';
    this.pager = '';

    /**
     * ボックスの位置
     */
    this.box_position = 1;

    /**
     * ページ番号
     */
    this.page_num = 1;

    /**
     * 拡大縮小比率
     */
    this.zoom_scale = Math.sqrt(2);

    /**
     * スクロール比率
     */
    this.scroll_scale = 10;

    /**
     * 画像配列
     */
    this.images = ([]);

    /**
     * 画像の読み込み
     */
    this.loadImages = function() {

        this.images = (this.is_right_start) ? this.images.reverse() : this.images;

        for (var i = 1; i < this.max_box_num; i ++) {
            this.scandata.eq(i).remove();
        }

        for (var i = 1; i < this.max_box_num; i ++) {
            scandata_clone = this.scandata.eq(0).clone();
            this.scandata_wrapper.append(scandata_clone);

            // 追加したものを追加
            this.scandata = $("." + this.scandata.attr('class'));

        }

        for (var i = 0; i < this.max_box_num; i ++) {
            this.scandata.eq(i).attr('src', this.images[i]);
        }

    };

    /**
     * 初期化
     */
    this.initialize = function() {

        if (false == this.is_initialized) {

            this.viewer_frame.css("height", this.height_of_viewer + 'px');
            this.scandata_area.css("height", this.height_of_viewer + 'px');

            this.scandata.css("height", this.height_of_scandata + 'px');
            this.width_of_scandata = parseInt(this.scandata.css("width"));
            this.scandata_wrapper.css("padding-left", this.padding_of_scandata_wrapper + 'px');
            this.scandata.last().css("padding-right", this.padding_of_scandata_wrapper + 'px');

            this.reSize();
            this.scrollToStart();
            this.displayPage();

            this.is_initialized = true;

        }

    };

    this.scrollRight = function(is_shift) {
        this.calcBoxPosition(1, is_shift);
        this.doScroll();
    };

    this.scrollLeft = function(is_shift) {
        this.calcBoxPosition(-1, is_shift);
        this.doScroll();
    };

    this.zoomIn = function() {
        this.reSize('in');
        this.doScroll();
    };

    this.zoomOut = function() {
        this.reSize('out');
        this.doScroll();
    };

    this.reSize = function(in_out) {
        if (in_out == 'in') {
	        if (this.height_of_scandata < (16 / 1.4) * this.default_height_of_scandata) {
                this.width_of_scandata *= this.zoom_scale;
                this.height_of_scandata *= this.zoom_scale;
            }
        } else if (in_out == 'out') {
	        if (this.height_of_scandata > (0.5 * 1.4) * this.default_height_of_scandata) {
                this.width_of_scandata /= this.zoom_scale;
                this.height_of_scandata /= this.zoom_scale;
            }

        }
        this.scandata.css("height", this.height_of_scandata);
        this.scandata.css("width", this.width_of_scandata);
        margin_top = (this.height_of_viewer - parseInt(this.scandata.css("height"))) / 2;
        this.scandata_wrapper.css("margin-top", margin_top + 'px');
    };

    /**
     * スクロール先のポジション計算
     */
    this.calcBoxPosition = function(direction, is_shift) {
        scroll = is_shift ? this.scroll_scale * 10 : this.scroll_scale;
        this.box_position = this.box_position + direction * scroll / this.width_of_scandata;

        this.page_num = this.page_num + direction * scroll / this.width_of_scandata;

        if (this.box_position < 1) {
            this.box_position = 1;
            this.page_num = 1;
        }
        if (this.box_position > this.max_box_num + 1) {
            this.box_position = this.max_box_num + 1;
        }

        if (false === this.isScrollable(direction)) {
            this.box_position = this.box_position - direction;
            this.shift_num = this.shift_num + direction;
        }
    }

    /**
     * 画像の入れ替え
     */
    this.swapImages = function() {
        for (var i = 0; i < this.max_box_num; i ++) {
            this.scandata.eq(i).attr('src', this.images[i + this.shift_num]);
        }
    };

    /**
     * スクロール
     */
    this.doScroll = function() {
        this.swapImages();
        this.scandata_area.scrollLeft(this.width_of_scandata * (this.box_position - 1));
        this.displayPage();
    };

    /**
     * 先頭に戻る
     */
    this.scrollToStart = function() {
        this.jumpTo(0);
    };

    /**
     * 末尾に戻る
     */
    this.scrollToLast = function() {
        this.jumpTo(this.images.length + 1);
    };

    /**
     * ジャンプ
     */
    this.jumpTo = function(page_num) {

        if (this.is_right_start) {
            this.page_num = this.images.length - page_num + 2;
        } else {
            this.page_num = page_num;
        }

        // shift_num の最大
        var max_shift_num = this.images.length - this.max_box_num;

        // shift 発動時の box_num
        var box_num_when_shifting = Math.round(this.max_box_num / 2);

        if (this.page_num <= box_num_when_shifting) {
            this.shift_num = 0;
            this.box_position = this.page_num;

        } else if (this.page_num > box_num_when_shifting) {

            this.shift_num = this.page_num - box_num_when_shifting;

            if (this.shift_num > max_shift_num) {
                this.box_position = box_num_when_shifting + this.shift_num - max_shift_num;
                this.shift_num = max_shift_num;
            } else {
                this.box_position = box_num_when_shifting;
            }

        }

        this.doScroll();
    };

    /**
     * ページ番号表示
     */
    this.displayPage = function() {
        var page_num_for_display = parseInt(this.page_num);
        if (this.is_right_start) {
            page_num_for_display = this.images.length - page_num_for_display + 2;
        }

        if (page_num_for_display > this.images.length) {
            page_num_for_display = this.images.length;
        }

        if (page_num_for_display < 1) {
            page_num_for_display = 1;
        }
        
        var kazu = Math.round(this.height_of_scandata / this.default_height_of_scandata * 100);

        this.pager.html('page : ' + parseInt(page_num_for_display) + '/' + this.images.length + '<br>   [scale : ' + (kazu) + ']');// + '/' + this.box_position);
    };

    /**
     * 通常スクロールしてもいいか
     */
    this.isScrollable = function(direction) {
        if (direction > 0) {
            if (this.box_position < this.max_box_num / 2 + 1) {
                return true;
            }
            if (this.images[this.images.length - 1] == this.scandata.last().attr('src')) {
                return true;
            }
        }

        if (direction < 0) {
            if (this.box_position > this.max_box_num / 2 + 1) {
                return true;
            }
            if (this.images[0] == this.scandata.first().attr('src')) {
                return true;
            }
        }
        return false;
    };

};

var ConfigLoader = function() {

    // 初期設定
    this.start = 'left';
    this.max_box_num = 7;

    this.config = jQuery.data(document.body, 'config').split(/\n/);
    this.images = jQuery.data(document.body, 'images').split(/\n/);

    $.each(this.config, function(key, val) {
        if (regs = val.match(/^(.*):(.*)$/)) {
            this[regs[1]] = regs[2];
        }
    });

    /**
     * 値の取得
     */
    this.getValue = function(key) {
        var value = '';
        $.each(this.config, function(k, v) {
            if (regs = v.match(/^(.*):(.*)$/)) {
                if (key == regs[1]) {
                    value = regs[2];
                }
            }
        });
        return (value) ? value : this[key];
    };

    /**
     * 画像一覧の取得
     */
    this.getImages = function() {
        var images = ([]);
        $.each(this.images, function(k, v) {
            if (v) {
                images.push(v);
            }
        });
        return images;
    };

}

$(document).ready(function(){

    $.ajax({ type: "GET", url: "./config.txt" }).done(function(data) {
        jQuery.data(document.body, 'config', data);
        
    $.ajax({ type: "GET", url: "./images.txt" }).done(function(data) {
        jQuery.data(document.body, 'images', data);

    var S = new Scroller();

    S.viewer_frame = $(".viewer_frame");
    S.scandata = $(".scandata");
    S.scandata_area = $(".scandata_area");
    S.scandata_wrapper = $(".scandata_wrapper");
    S.pager = $("#pager");

    var C = new ConfigLoader();
    S.is_right_start = (C.getValue('start') == 'right') ? true : false;
    S.max_box_num = C.getValue('max_box_num');
    S.images = C.getImages();

    S.loadImages();
    $(".scandata").first().bind('load', function() {
        // 最初の画像の読み込みが終わってから初期化する
        S.initialize();
    });

    $('html').keydown(function(e) {

        switch(e.which) {
            case 39: // Key[→]
                S.scrollRight(e.shiftKey);
                break;

            case 37: // Key[←]
                S.scrollLeft(e.shiftKey);
                break;

            case 38: // Key[↑]
                S.zoomIn();
                break;

            case 40: // Key[↓]
                S.zoomOut();
                break;

            case 83: // Key[S]
                S.scrollToStart();
                break;

            case 76: // Key[L]
                S.scrollToLast();
                break;

            case 74: // Key[J]
                S.jumpTo(prompt("ページ番号を入力してください", "") * 1);
                break;

        }

    });

    }); // end load images.txt
    }); // end load config.txt
});
