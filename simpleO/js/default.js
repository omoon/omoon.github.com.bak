/**
 * スクロール管理クラス
 *
 */
var Scroller = function() {

    this.max_box_num = 7;

    this.scandata = '';
    this.scandata_area = '';
    this.scandata_wrapper = '';
    this.pager = '';

    this.box_position = 1;
    this.page_num = 1;

    this.scale = 1.5;
    this.scroll_scale = 10;

    this.height_of_scandata = 128;

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
            this.width_of_scandata *= this.scale;
            this.height_of_scandata *= this.scale;
        } else if (in_out == 'out') {
            this.width_of_scandata /= this.scale;
            this.height_of_scandata /= this.scale;
        }
        this.scandata.css("height", this.height_of_scandata);
        margin_top = (640 - parseInt(this.scandata.css("height"))) / 2;
        this.scandata_wrapper.css("margin-top", margin_top + 'px');
    };

    /**
     * スクロール先のポジション計算
     *
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

    this.doScroll = function() {
        this.scandata_area.scrollLeft(this.width_of_scandata * (this.box_position - 1));
        this.displayPage();
    };

    this.scrollToStart = function() {
        this.box_position = 1;
        this.page_num = 1;
        this.doScroll();
    };

    this.scrollToLast = function() {
        this.box_position = this.max_box_num + 1;
        this.page_num = 100;
        this.doScroll();
    };

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


    var initial_padding_left_of_scandata_wrapper = 495;
    var padding_left_of_scandata_wrapper = initial_padding_left_of_scandata_wrapper;

    var scandata_height = 128;
    $(".scandata").css("height", scandata_height + 'px');

    var width_of_scandata = 0;
    $(".scandata").bind('load', function() {
        S.width_of_scandata = parseInt($(this).width());
    });

    margin_top_of_scandata_wrapper = (640 - scandata_height) / 2;
    arrangePict(margin_top_of_scandata_wrapper);

    $(".scandata_wrapper").css("padding-left", initial_padding_left_of_scandata_wrapper + 'px');
    $(".scandata").last().css("padding-right", initial_padding_left_of_scandata_wrapper + 'px');

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

/**
 * 縦位置の調整
 *
 */
function arrangePict(top) {
    $(".scandata_wrapper").css("margin-top", top + 'px');
}

/**
 * リサイズ後の縦位置の調整
 *
 */
function reArrangePict() {
    margin_top = (640 - parseInt($(".scandata").css("height"))) / 2;
    arrangePict(margin_top);
}
