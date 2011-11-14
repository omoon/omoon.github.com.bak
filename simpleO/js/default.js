var max_page = 7;

$(document).ready(function(){

    // 初期化

    /**
     * 現在のページ
     */
    var page = 1;

    var scale = 1.5;
    var scroll_scale = 10;

    var counter = 0;

    var initial_padding_left_of_scandata_wrapper = 495;
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

    $(".scandata_wrapper").css("padding-left", initial_padding_left_of_scandata_wrapper + 'px');
    $(".scandata").last().css("padding-right", initial_padding_left_of_scandata_wrapper + 'px');

    $('html').keydown(function(e) {

        // Shift 押下時は 10 倍
        scroll = e.shiftKey ? scroll_scale * 10 : scroll_scale;

        switch(e.which) {
            case 39: // Key[→]
                page = getPage(page, scroll, width_of_scandata);
                doScroll(page, width_of_scandata);
                break;

            case 37: // Key[←]
                page = getPage(page, scroll * -1, width_of_scandata);
                doScroll(page, width_of_scandata);
                break;

            case 38: // Key[↑]
                counter++;
                scandata_height *= scale;
                width_of_scandata *= scale;
                width_of_scandatas *= scale;
                $(".scandata").css("height", scandata_height);
                doScroll(page, width_of_scandata);
                reArrangePict();
                break;

            case 40: // Key[↓]
                counter--;
                scandata_height /= scale;
                width_of_scandata /= scale;
                width_of_scandatas /= scale;
                $(".scandata").css("height", scandata_height);
                doScroll(page, width_of_scandata);
                reArrangePict();
                break;

            case 83: // Key[S]
                page = 1;
                doScroll(page, width_of_scandata);
                break;

            case 76: // Key[L]
                page = max_page;
                doScroll(page, width_of_scandata);
                break;

            case 74: // Key[J]
                page = prompt("ページ番号を入力してください", "") * 1;
                doScroll(page, width_of_scandata);
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

function getPage(page, scroll, width_of_scandata) {
    page = page + scroll / width_of_scandata;
    if (page < 1) {
        page = 1;
    }
    if (page > max_page + 1) {
        page = max_page + 1;
    }
    return page;
}

function doScroll(page, width_of_scandata) {
    $(".scandata_area").scrollLeft(width_of_scandata * (page - 1));
    displayPage(page);
}

function displayPage(page) {
    $("#pager").html('page : ' + parseInt(page));
}

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
