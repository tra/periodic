# jQuery periodic plugin

While this plugin is still considered to be "under development", it seems to be working and may suit your purposes fine.   But we reserve the right to change how things work and/or change names of things, etc.   Please give us feedback if you'd like to see some feature or tweak.

The purpose of this plugin is to provide a simple wrapper around setTimeout to allow your application
to do any sort of polling task.   Most often, this would be used in conjunction with the jQuery ajax
(or related) function like this:

    $.periodic(periodic_options, function() {
      $.ajax(ajax_options);
    }

The plugin provides built-in settings for decreasing the poll time via a "decay" setting (much like
prototype's PeriodicalExecuter).  The name of this plugin, 'periodic', is a more grammatically correct description of what it does (a "periodical" is something you read).

## Examples

Let's say you want to poll your server and update some part of your page by hitting the '/update.json' URL.
Also, let's set it up to poll the server every 2 seconds initially but to decay 20% until it reaches a maximum 
of 60 seconds if there are no changes to the content returned from the server.   This example would look like
this:

    $.periodic({period: 2000, decay: 1.2, max_period: 60000}, function() {
      $p = this;
      $.ajax({
        url: '/update.json',
        success: function(data) { do_something_with_data(data) },
        complete: $p.ajaxComplete,
        dataType: 'json'
      });
    }
    
Notice that, in the above example, jQuery.periodic provides a utility callback function, ajaxComplete that checks the return value of the ajax request to see if it has changed.   If it hasn't changed since the last call then
the time between calls will decay as per your settings (1.2 in this example).

If you need to define your own 'complete' function and would still like to use the provided function then you could do so like this:

    $.periodic({period: 2000, decay: 1.2, max_period: 60000}, function() {
      $p = this;
      $.ajax({
        url: '/update.json',
        success: function(data) { do_something_with_data(data) },
        complete: function(xhr, status) {
          // do your own thing
          do_something_on_complete();
          // use the utility callback
          $p.ajaxComplete(xhr, status);
        },
        dataType: 'json'
      });
    }

If you'd prefer to have more control over when the period should increment or should be reset to the initial value, then you can use the provided 'increment' and 'reset' functions instead.   For example, if you wanted to base it off of some condition from the returned ajax data:

    $.periodic({period: 2000, decay: 1.2, max_period: 60000}, function() {
      $p = this;
      $.ajax({
        url: '/my_url',
        success: function(data) {
          do_something_with_data(data);
          if (need_to_reset_timer()) {
            $p.reset();
          } else {
            $p.increment();
          }
        },
      });
    }
    
You can also get at the current value of the period using by accessing the $p.cur_period value.

These examples are just a starting point.   If you'd like to see other specific example, send us a message or open a ticket.

## Options

The plugin expects the first argument to be the settings and the second argument is the user-provided
callback function to call every time the plugin wakes up.

    $.periodic(options, callback);

The options object recognizes the following settings:

<table>
  <tr><th>Option</th><th>Description</th><th>Default Value</th></tr>
  <tr><td>period</td><td>Initial time in msec to wait between calls to the callback.</td><td>5000</td></tr>
  <tr><td>decay</td><td>Multiplier to increase the time if the request doesn't change.  A value of 1.0 means that the period never changes.</td><td>1.0</td></tr>
  <tr><td>max_period</td><td>The maximum value for the delay.</td><td>180000 (30 min)</td></tr>
  <tr><td>on_max</td><td>User supplied function to call when the max_period is reached.</td><td>undefined</td></tr>
</table>

## Installation

Simply download the file jquery.periodic.js to wherever your javascript files live.
