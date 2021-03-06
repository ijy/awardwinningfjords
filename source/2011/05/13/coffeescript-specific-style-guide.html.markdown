---
title: CoffeeScript-specific Style Guide
date: 2011-05-13
blog_editor_id: 32
---

[@topfunky]: http://twitter.com/topfunky
[CoffeeScript PeepCode screencast]: https://peepcode.com/products/coffeescript

First, go buy [@topfunky]'s new [CoffeeScript PeepCode screencast]. It's wonderful. All done? Okay.

One of the most interesting pieces of information to me, as someone who's been writing a lot of CoffeeScript and has written a ton of Javascript in the past, is the subtle tweaks to style in CoffeeScript. Here are some quick preferred styles.

READMORE

Here's a simple piece of jQuery and a test case in plain Javascript.

    var elem = $("#myselector").addClass("testing");
    expect(elem.id).toEqual("myselector");

## Naive Conversion to CoffeeScript:

Simply removing semi-colons and the <tt>var</tt> keyword isn't really enough.

    elem = $("#myselector").addClass("testing")
    expect(elem.id).toEqual("myselector")

## Lisp-y Function Grouping/Calling & Omitting Final parentheses

First, remember that CoffeeScript doesn't require parentheses when calling functions. These two lines are rendered identically:

    myfunc("string")
    myfunc "string"

The second version, without parentheses, is the preferred style. The general rule is: __the final method call in a chain should omit the parentheses__. The original, naive conversion can become:

    elem = $("#myselector").addClass "testing"
    expect(elem.id).toEqual "myselector"

Finally, CoffeeScript prefers to use parentheses to group methods, rather than group method parameters. This subtle difference is best illustrated by the final code. I think seeing the jQuery <tt>$</tt> without a parenthesis was off-putting at first, but I'm slowly learning to like it. The resulting code feels more math-y (or Lisp-y).

## Preferred Style

    elem = ($ "#myselector").addClass "testing"
    (expect elem.id).toEqual "myselector"
