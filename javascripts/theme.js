 if (window.jQuery) { 
  $(document).ready(function(){
    if (window.devicePixelRatio > 1) {
      var images = findImagesByRegexp('contacts_thumbnail', document);

      for(var i = 0; i < images.length; i++) {
        var lowres = images[i].src;
        old_size = lowres.match(/\/(\d*)$/)[1]
        var highres = lowres.replace(/\/(\d*)$/, "/" + String(old_size*2));
        images[i].src = highres;
      }

      var images = findImagesByRegexp('gravatar.com/avatar', document);

      for(var i = 0; i < images.length; i++) {
        var lowres = images[i].src;
        old_size = lowres.match(/size=(\d+)x(\d+)/)[1]
        var highres = lowres.replace(/size=(\d+)x(\d+)/, "size=" + String(old_size*2));
        images[i].src = highres;
      }    
    }
  });
} else {
  document.observe("dom:loaded", function() {
    if (window.devicePixelRatio > 1) {
      var images = findImagesByRegexp('thumbnail', document);

      for(var i = 0; i < images.length; i++) {
        var lowres = images[i].src;
        old_size = lowres.match(/size=(\d*)$/)[1]
        var highres = lowres.replace(/size=(\d*)$/, "size=" + String(old_size*2));
        images[i].src = highres;
      }

      var images = findImagesByRegexp('gravatar.com/avatar', document);

      for(var i = 0; i < images.length; i++) {
        var lowres = images[i].src;
        old_size = lowres.match(/size=(\d+)x(\d+)/)[1]
        var highres = lowres.replace(/size=(\d+)x(\d+)/, "size=" + String(old_size*2));
        images[i].src = highres;
      }    
    }

  });
}

function findImagesByRegexp(regexp, parentNode) {
   var images = Array.prototype.slice.call((parentNode || document).getElementsByTagName('img'));
   var length = images.length;
   var ret = [];
   for(var i = 0; i < length; ++i) {
      if(images[i].src.search(regexp) != -1) {
         ret.push(images[i]);
      }
   }
   return ret;
};

var original_sidebar_width = 0;
var original_content_width = 0;

function setup_dom() {
    var zoom = $("#zoom").val();
    $(".handle").draggable(
        {
            axis: "x",
            containment: "parent",
            grid: [ Math.pow(2, zoom), 10 ],
            stop: function(event, ui) {
                issue_moved(this);
            }
        }
    );


    $(".task_todo").resizable(
        {
            handles: "e, w",
            grid: [ Math.pow(2, zoom), 10 ],
            minWidth: [ Math.pow(2, zoom), 10 ],
            start: function(event, ui) {
                $(this).siblings().hide();
            },
            stop: function(event, ui) {
                issue_resized(this);
            }
        }
    );
}

function issue_resized(i_el) {
    el = $(i_el);

    pel = el.parent();
    pel_dom = pel.get(0);

    el_left = el.position().left;
    pel_left = pel_dom.style.left;

    pel.css("left", parseInt(pel_left) + parseInt(el_left));
    el.css("left", "auto");
    pel.width(el.width() + 100);

    issue_moved(pel.get(0));
}

function setup_events() {
    $("#toggle-sidebar").click(function() {
        if ($(this).hasClass("hide")) {
            if (original_sidebar_width == 0) {
                original_sidebar_width = $("#sidebar").css('width');
            }
            if (original_content_width == 0) {
                original_content_width = $("#content").css('margin-right');
            }
            $(this).removeClass("hide");
            $("#sidebar").css("width", 10);
            $("#sidebar-content").hide();
            $("#content").css("margin-right", 0);
            $(this).html("&laquo;");
        } else {
            $(this).addClass("hide");
            $("#sidebar").css("width", original_sidebar_width);
            $("#sidebar-content").show();
            $("#content").css("margin-right", original_content_width);
            $(this).html("&raquo;");
        }
    });
}
$(document).ready(setup_dom);
$(document).ready(setup_events);

