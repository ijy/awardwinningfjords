---
title: Trigger CSS3 Animations with jQuery
date: 2011-05-06
blog_editor_id: 34
---

Did you know that jQuery 1.4.3 added a system for adding custom css attributes? For example, any normal style can be applied like so:

    $(elem).css({ background: 'red' })

But what about more complicated styles? Complicated polyfills and vendor-prefixed styles? What if you could add a custom handler for <tt>border-radius</tt>? It's pretty simple and I'll show you a strawman example.

READMORE

    $.cssHooks['pirateBackground'] = {
      get: function(elem, computed, extra) {
        return "yaarrr";
      },
      set: function(elem, value) {
        elem.style.background = value + " url(pirates.png)";
      }
    };
    
    $(elem).css({ pirateBackground: 'red' });
    // elem now has a red background and the pirates.png pattern
    
    $(elem).css('pirateBackground') == "yaarrr"
    
Included in David DeSandro's excellent [Isotope] library are [csshooks for CSS3 scale and translate]. These hooks correctly use the fast 3d-transforms if available. I've included the full implementation below, but the important part is that you can include the following gist and use it like this:

    // Double the size using CSS3 transform scale 
    $(elem).css({ scale: [2] })
    
    // Move the element 100px right and 200px down
    $(elem).css({ translate: [ 100, 200 ] })

## Demo

    $('.2x').click(function() {
      $('.square').css({ scale: [2] })
    });
    
    $('.1x').click(function() {
      $('.square').css({ scale: [1] })
    });

    $('.right').click(function() {
      $('.square').css({ translate: [150, 0] })
    });

    $('.left').click(function() {
      $('.square').css({ translate: [25, 0] })
    });

<iframe width="300" height="450" src="/images/iso/demo.html"></iframe>

## Full Implementation

Download: https://gist.github.com/959860

<script src="https://gist.github.com/959860.js?file=isoTransform.js"></script>

[csshooks for CSS3 scale and translate]: https://github.com/desandro/isotope/blob/a2a238968347199842dd7e2d552741d5a63c90b9/jquery.isotope.js
[Isotope]: http://isotope.metafizzy.co/