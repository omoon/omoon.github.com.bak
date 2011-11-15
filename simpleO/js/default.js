/**
 * スクロール管理クラス
 *
 */
var Scroller = function() {

    this.max_box_num = 7;

    this.padding_of_scandata_wrapper = 495;
    this.height_of_scandata = 128;
    this.width_of_scandata = 0;

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
    this.zoom_scale = 1.5;

    /**
     * スクロール比率
     */
    this.scroll_scale = 10;

    /**
     * 初期化
     *
     */
    this.initialize = function() {



        this.scandata.css("height", this.height_of_scandata + 'px');
        this.width_of_scandata = parseInt(this.scandata.css("width"));
        this.scandata_wrapper.css("padding-left", this.padding_of_scandata_wrapper + 'px');
        this.scandata.last().css("padding-right", this.padding_of_scandata_wrapper + 'px');
        this.reSize();

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
            this.width_of_scandata *= this.zoom_scale;
            this.height_of_scandata *= this.zoom_scale;

        } else if (in_out == 'out') {
            this.width_of_scandata /= this.zoom_scale;
            this.height_of_scandata /= this.zoom_scale;

        }
        this.scandata.css("height", this.height_of_scandata);
        margin_top = (640 - parseInt(this.scandata.css("height"))) / 2;
        this.scandata_wrapper.css("margin-top", margin_top + 'px');
    };

    /**
     * スクロール先のポジション計算
     */
    this.calcBoxPosition = function(direction, is_shift) {
        scroll = is_shift ? this.scroll_scale * 10 : this.scroll_scale;
        this.box_position = this.box_position + direction * scroll / this.width_of_scandata;
        if (this.box_position < 1) {
            this.box_position = 1;
        }
        if (this.box_position > this.max_box_num + 1) {
            this.box_position = this.max_box_num + 1;
        }
    }

    /**
     * スクロール
     */
    this.doScroll = function() {
        this.scandata_area.scrollLeft(this.width_of_scandata * (this.box_position - 1));
        this.displayPage();
    };

    /**
     * 先頭に戻る
     */
    this.scrollToStart = function() {
        this.box_position = 1;
        this.page_num = 1;
        this.doScroll();
    };

    /**
     * 末尾に戻る
     */
    this.scrollToLast = function() {
        this.box_position = this.max_box_num + 1;
        this.page_num = 100;
        this.doScroll();
    };

    /**
     * ページ番号表示
     */
    this.displayPage = function() {
        this.page_num = parseInt(this.box_position);
        this.pager.html(this.page_num);
    };

};


$(document).ready(function(){

    // 初期化

    var S = new Scroller();

    S.scandata = $(".scandata");
    S.scandata_area = $(".scandata_area");
    S.scandata_wrapper = $(".scandata_wrapper");
    S.pager = $("#pager");

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
                S.box_position = prompt("ページ番号を入力してください", "") * 1;
                S.doScroll();
                break;

        }

        //alert(page);

        //$(".viewer_frame").animate({
        //    left: $(window).scrollLeft() + 50
        //    }, 30, function() {
        //    // Animation complete.
        //});

    });

});
