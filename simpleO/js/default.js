/**
 * スクロール管理クラス
 *
 */
var Scroller = function() {

    /**
     * ズレの値
     */
    this.shift_num = 0;
    
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
     * 画像配列
     */
    this.images = '';
    this.books = ([]);

    this.books[1] = ([ 
            'images/001.jpg',
            'images/002.jpg',
            'images/003.jpg',
            'images/004.jpg',
            'images/005.jpg',
            'images/006.jpg',
            'images/007.jpg',
            'images/008.jpg',
            'images/009.jpg',
            'images/010.jpg'
            ]);

    this.books[2] = ([ 
            'http://www.flib.u-fukui.ac.jp/elib/kaigan/photo/src/0001.jpg',
            'http://www.flib.u-fukui.ac.jp/elib/kaigan/photo/src/0002.jpg',
            'http://www.flib.u-fukui.ac.jp/elib/kaigan/photo/src/0003.jpg',
            'http://www.flib.u-fukui.ac.jp/elib/kaigan/photo/src/0004.jpg',
            'http://www.flib.u-fukui.ac.jp/elib/kaigan/photo/src/0005.jpg',
            'http://www.flib.u-fukui.ac.jp/elib/kaigan/photo/src/0006.jpg',
            'http://www.flib.u-fukui.ac.jp/elib/kaigan/photo/src/0007.jpg',
            'http://www.flib.u-fukui.ac.jp/elib/kaigan/photo/src/0008.jpg',
            'http://www.flib.u-fukui.ac.jp/elib/kaigan/photo/src/0009.jpg',
            'http://www.flib.u-fukui.ac.jp/elib/kaigan/photo/src/0010.jpg',
            'http://www.flib.u-fukui.ac.jp/elib/kaigan/photo/src/0011.jpg',
            'http://www.flib.u-fukui.ac.jp/elib/kaigan/photo/src/0012.jpg',
            'http://www.flib.u-fukui.ac.jp/elib/kaigan/photo/src/0013.jpg',
            'http://www.flib.u-fukui.ac.jp/elib/kaigan/photo/src/0014.jpg',
            'http://www.flib.u-fukui.ac.jp/elib/kaigan/photo/src/0015.jpg',
            'http://www.flib.u-fukui.ac.jp/elib/kaigan/photo/src/0016.jpg',
            'http://www.flib.u-fukui.ac.jp/elib/kaigan/photo/src/0017.jpg',
            'http://www.flib.u-fukui.ac.jp/elib/kaigan/photo/src/0018.jpg',
            'http://www.flib.u-fukui.ac.jp/elib/kaigan/photo/src/0019.jpg'
            ]);

    /**
     * 初期化
     *
     */
    this.loadImages = function(book_num) {

        this.images = this.books[book_num];

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
        this.scandata.css("width", this.width_of_scandata);
        margin_top = (640 - parseInt(this.scandata.css("height"))) / 2;
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

        if (this.page_num > this.images.length) {
            this.page_num = this.images.length;
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
        this.jumpTo(1);
    };

    /**
     * 末尾に戻る
     */
    this.scrollToLast = function() {
        this.jumpTo(this.images.length);
    };

    /**
     * ジャンプ
     */
    this.jumpTo = function(page_num) {
        this.page_num = page_num;

        // shift_num の最大
        var max_shift_num = this.images.length - this.max_box_num;

        // shift 発動時のbox_num
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
        this.pager.html('page : ' + parseInt(this.page_num));// + '/' + this.box_position);
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


$(document).ready(function(){

    var S = new Scroller();

    S.scandata = $(".scandata");
    S.scandata_area = $(".scandata_area");
    S.scandata_wrapper = $(".scandata_wrapper");
    S.pager = $("#pager");

    S.loadImages(1);
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

    $("#book").change(function() {
        S.loadImages($(this).val());
        $(".scandata").first().bind('load', function() {
            // 最初の画像の読み込みが終わってから初期化する
            S.initialize();
        });
    });

});
