jQuery.periodic = function (options, callback) {

  // Merge passed settings with default values
  var settings = jQuery.extend({
    period       : 5000,      // 5 sec.
    max_period   : 1800000,   // 30 min.
    decay        : 1,         // time period multiplier
    on_max       : undefined, // called if max_period is reached
    ajaxComplete : ajaxComplete,
    reset        : reset
  }, options);

  // bookkeeping variables
  settings.cur_period = settings.period;
  var prev_ajax_response = '';

  run();

  return this;

  function reset() {
    settings.cur_period = settings.period;
  }

  // convenience function for use with ajax calls
  function ajaxComplete(xhr, status) {
    if (status === 'success' && prev_ajax_response != xhr.responseText) {
      // go back to the period whenver the response changes
      prev_response = xhr.responseText;
      reset();
    }
  }

  function run() {
    setTimeout(function() {
      // set the context (this) for the callback to the settings object
      callback.call(settings);

      // compute the next delay
      settings.cur_period *= settings.decay
      if (settings.cur_period < settings.period) {
        settings.cur_period = settings.period
      } else if (settings.cur_period > settings.max_period) {
        settings.cur_period = settings.max_period
        if (settings.on_max !== undefined) {
          // call the user-supplied callback if we reach max_period
          settings.on_max.call(settings);
        }
      }

      // queue up the next run
      run();
    }, settings.cur_period);
  }
  
  // other functions we might want to add
  function pause() {}
  function resume() {}
  function log() {}
};
