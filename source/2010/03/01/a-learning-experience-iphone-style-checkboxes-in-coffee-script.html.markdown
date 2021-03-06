---
title: A Learning Experience. iPhone-style checkboxes in Coffee-Script
date: 2010-03-01
blog_editor_id: 69
---

[Coffee Script website]: http://jashkenas.github.com/coffee-script/
[iphone-coffee]: http://github.com/tdreyno/iphone-style-checkboxes/blob/master/coffee/iphone-style-checkboxes.coffee
[fat-arrow]: http://jashkenas.github.com/coffee-script/#fat_arrow

According to the [Coffee Script website], "CoffeeScript is a little language that compiles into JavaScript. Think of it as JavaScript's less ostentatious kid brother — the same genes, roughly the same height, but a different sense of style. Apart from a handful of bonus goodies, statements in CoffeeScript correspond one-to-one with their equivalent in JavaScript, it's just another way of saying it."

Basically, Coffee Script is compiled into Javascript and attempts to make basic operations simpler and safe. For example, in Ruby you can add a conditional to the end of the current line as a short-hand for a full <tt>if</tt> statement. In Coffee Script this looks like:

    number = -42 if opposite_day

Which compiles to:

    if (opposite_day) {
      number = -42;
    }

Pretty simple, right? If you're familiar with Javascript, you'll recognize Coffee Script's attempt to fix little annoyances. I dove right in and ported my iPhone-style Checkboxes for jQuery to Coffee Script. [The code can be found on GitHub][iphone-coffee]. Here are a few thoughts and examples I discovered. 

Basic Features
--------------

A lot of the convenience of Coffee Script is only really apparent if you're quite familiar with Javascript. The following three features are fairly common and useful in Ruby, but trying something similar in Javascript requires a bit more error-checking and code. Coffee Script hides this.

    # Conditional assignments
    expensive ||= do_the_math()
    
    # Treating function arguments as a real array
    backwards = ->
      alert arguments.reverse()
    
    # Existence conditions
    solipsism = true if mind? and not world?

These are compiled to their Javascript representations.

    # Conditional assignments
    expensive = expensive || do_the_math();
    
    # Treating function arguments as a real array
    var backwards;
    backwards = function backwards() {
      arguments = Array.prototype.slice.call(arguments, 0);
      return alert(arguments.reverse());
    };
    
    # Existence conditions
    var solipsism;
    if ( (typeof mind !== "undefined" && mind !== null) && 
        !(typeof world !== "undefined" && world !== null)) {
      solipsism = true;
    }
    

Features I Love #1: Simpler functions, this.attribute & function binding
----------------------------------------------------------------------

From here on out, I'll omit the Javascript version. Let's just look at some cool features and trust they will work when compiled. To begin, function definitions, and anonymous functions, are even simpler in Coffee Script. It's as simple as:

    method_name: (parameter1, parameter1, other_params...) ->
      "Thanks for coming"

The method is defined by a series of parameters, a -> symbol and an indented method body. Unless you specific a return value, the last statement of the method is automatically returned, as in Ruby. The ellipsis parameter is called a Splat, this sucks up the remaining parameters that may have been passed in a groups them into an array.

A class is just a variation of a function in Javascript. Usually capitalized, it looks like this:

    Account = (customer, cart) ->
      @customer = customer
      @cart     = cart
      
The Account class takes two parameters on it's constructor. The @ sign is used for accessing instance variables. In raw Javascript, this is usually handled by the <tt>this</tt> value. Maybe Javascript event libraries allow anonymous functions as callbacks, but the value of <tt>this</tt> inside these callbacks can be hard to ensure. In Coffee Script, we can force the value of <tt>this</tt>, called binding, to the current object by using a => symbol instead of ->

      $('.shopping_cart').bind 'click', (event) =>
        @customer.purchase @cart

The above code, when indented inside the Account class, will make sure the callback method has access to the instance @customer and @cart variables. [Look on the Coffee Script site if you want to see the Javascript version of this code][fat-arrow]. It's a bit rough.

Features I Love #2: Pattern Matching
-----------------------------------

Next up is Pattern Matching, also known as Destructuring Assignment in the ECMAScript 4 syntax. Basically, we have an object or array and we want to pull some pieces out and into variables to work with. The simplest example is having a method that returns an array of three items.

    weather_report: (location) ->
      # Make an Ajax request to fetch the weather...
      [location, 72, "Mostly Sunny"]

    [city, temp, forecast] = weather_report "Berkeley, CA"
    
In the above example, the weather_report function returns 3 variables which we then assign to three local variables. The structure of the template on the left-hand side mirrors the value on the right-hand side. So in the example above, we have an array of local variables on the left and an array of results from the function on the right.

Now lets get very complicated. Let's destructure nested objects. This can be very powerful. Here's an example nested object:

    futurists: {
      sculptor: "Umberto Boccioni"
      painter:  "Vladimir Burliuk"
      poet: {
        name:   "F.T. Marinetti"
        address: [
          "Via Roma 42R"
          "Bellagio, Italy 22021"
        ]
      }
    }
    
Now, we'll pull out the pieces we want into local variables:

    {poet: {name: poet_name, address: [street, city]}} = futurists
    
This results in poet_name="F.T. Marinetti", street="Via Roma 42R" and city="Bellagio, Italy 22021"

I admit, I'm not used to thinking about data structures in this way, so there are probably some very cool applications which I haven't even thought of yet.
    
Features I Love #3: Indentation-aware Heredocs
-----------------------------------

The triple quote (from Python, I think?) starts a block of text which will be turned into a single string which has the indentation you'd expect rather than including all of the prefixed whitespace. 

    html: '''
          <strong>
            cup of coffeescript
          </strong>
          '''
          
Compiles to:

    var html;
    html = "<strong>\n  cup of coffeescript\n</strong>";

Conclusion
----------

That's all I can think of right now. Make sure to check out the [Coffee Script docs][Coffee Script website], look at [my port of iPhone-style Checkboxes][iphone-coffee] and invest a little time in this new language.

Welcome to the Year 2010, it's ASCII art time!
----------------------------------------------
    
            {                   
         }   }   {              
        {   {  }  }             
         }   }{  {               
        {  }{  }  }                    _____       __  __           
       ( }{ }{  { )                   / ____|     / _|/ _|          
     .- { { }  { }} -.               | |     ___ | |_| |_ ___  ___ 
    (  ( } { } { } }  )              | |    / _ \|  _|  _/ _ \/ _ \ 
    |`-..________ ..-'|              | |___| (_) | | | ||  __/  __/ 
    |                 |               \_____\___/|_| |_| \___|\___|
    |                 ;--.           
    |                (__  \            _____           _       _   
    |                 | )  )          / ____|         (_)     | |  
    |                 |/  /          | (___   ___ _ __ _ _ __ | |_ 
    |                 (  /            \___ \ / __| '__| | '_ \| __|
    |                 |/              ____) | (__| |  | | |_) | |_ 
    |                 |              |_____/ \___|_|  |_| .__/ \__|
     `-.._________..-'                                  | |        
                                                        |_|


