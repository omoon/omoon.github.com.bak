$(document).ready(function(){

    // 初期化
    var scale = 1.5;
    var scroll_scale = 10;
    var counter = 0;
    var initial_padding_left_of_scandata_wrapper = 270;
    var padding_left_of_scandata_wrapper = initial_padding_left_of_scandata_wrapper;

    var scandata_height = 128;
    $(".scandata").css("height", scandata_height + 'px');

    var width_of_scandata = 0;
    var width_of_scandatas = 0;
    $(".scandata").bind('load', function() {
        width_of_scandata = parseInt($(this).width());
        width_of_scandatas += parseInt($(this).width());
    });

    margin_top_of_scandata_wrapper = (640 - scandata_height) / 2;
    arrangePict(margin_top_of_scandata_wrapper);

    $('html').keydown(function(e) {
        scroll = e.shiftKey ? scroll_scale * 10 : scroll_scale;
        switch(e.which) {
            case 39: // Key[→]
                $(".scandata_area").scrollLeft(getScrollLeft() + scroll);
                break;

            case 37: // Key[←]
                $(".scandata_area").scrollLeft(getScrollLeft() - scroll);
                break;

            case 38: // Key[↑]
                counter++;
                $(".scandata_area").scrollLeft(reCalcScrollLeft(1, width_of_scandata, scale));
                scandata_height *= scale;
                width_of_scandata *= scale;
                width_of_scandatas *= scale;
                $(".scandata").css("height", scandata_height);
                reArrangePict();
                break;

            case 40: // Key[↓]
                counter--;
                $(".scandata_area").scrollLeft(reCalcScrollLeft(-1, width_of_scandata, scale));
                scandata_height /= scale;
                width_of_scandata /= scale;
                width_of_scandatas /= scale;
                $(".scandata").css("height", scandata_height);
                reArrangePict();
                break;

            case 83: // Key[S]
                $(".scandata_area").scrollLeft(0);
                break;

            case 76: // Key[L]
                $(".scandata_area").scrollLeft(width_of_scandatas - width_of_scandata);
                break;

            case 74: // Key[J]
                var page_num = prompt("ページ番号を入力してください", "");
                $(".scandata_area").scrollLeft(width_of_scandata * (page_num - 1));
                break;

        }

        //$(".viewer_frame").animate({
        //    left: $(window).scrollLeft() + 50
        //    }, 30, function() {
        //    // Animation complete.
        //});

    });


});

function getScrollLeft() {
    return $(".scandata_area").scrollLeft();
}

function reCalcScrollLeft(type, width_of_scandata, scale) {
    var scroll_left = getScrollLeft();
    if (type > 0) {
        scroll_left *= scale;
        // おっきくなったサイズの半分だけ右に動かす
        //scroll_left = scroll_left + (width_of_scandata * scale - width_of_scandata) / 2;

    } else if (type < 0) {
        scroll_left /= scale;
        // ちっさくなったサイズだけ右に動かす
        //scroll_left = scroll_left + (width_of_scandata - width_of_scandata / scale) / 2;
    }
    return scroll_left;
}

function reArrangePict() {
    $(".scandata").last().css('width', '5000px');
    margin_top = (640 - parseInt($(".scandata").css("height"))) / 2;
    arrangePict(margin_top);
}

function arrangePict(top) {
    $(".scandata_wrapper").css("margin-top", top + 'px');
}
