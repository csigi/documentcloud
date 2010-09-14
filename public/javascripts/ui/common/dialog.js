dc.ui.Dialog = dc.View.extend({

  className : 'dialog',

  DEFAULT_OPTIONS : {
    title       : "Untitled Dialog",
    text        : null,
    information : null,
    description : null,
    choices     : null,
    password    : false,
    editor      : false,
    draggable   : true
  },

  callbacks : {
    '.cancel.click'   : 'cancel',
    '.ok.click'       : 'confirm',
    'input.focus'     : '_addFocus',
    'textarea.focus'  : '_addFocus',
    'input.blur'      : '_removeFocus',
    'textarea.blur'   : '_removeFocus'
  },

  constructor : function(options) {
    this.base(options);
    if (this.options.mode) this.setMode(this.options.mode, 'dialog');
    if (this.options.draggable) this.setMode('is', 'draggable');
    _.bindAll(this, 'close', '_maybeConfirm');
  },

  render : function(opts) {
    opts = opts || {};
    $(this.el).html(JST['common/dialog'](_.extend({}, this.options, opts)));
    var cel = this.contentEl = $('.content', this.el);
    this._controls = $('.controls', this.el);
    this._controlsInner = $('.controls_inner', this.el);
    this._information = $('.information', this.el);
    if (this.options.width) $(this.el).css({width : this.options.width});
    if (this.options.content) cel.val(this.options.content);
    $(document.body).append(this.el);
    this.center();
    this.setCallbacks();
    if (this._returnCloses()) $(document.body).bind('keypress', this._maybeConfirm);
    if (cel[0]) _.defer(function(){ cel.focus(); });
    if (!opts.noOverlay) $(document.body).addClass('overlay');
    return this;
  },

  setCallbacks : function(callbacks) {
    this.base(callbacks);
    if (this.options.draggable) $(this.el).draggable();
  },

  defaultOptions : function() {
    return _.clone(this.DEFAULT_OPTIONS);
  },

  append : function(el) {
    this._controls.before(el);
  },

  addControl : function(el) {
    this._controlsInner.prepend(el);
  },

  val : function() {
    return (this.options.choices && this.options.mode == 'prompt') ?
      $('input:radio:checked', this.el).val() : this.contentEl.val();
  },

  title : function(title) {
    $('.title', this.el).text(title);
  },

  cancel : function() {
    if (this.options.onCancel) this.options.onCancel(this);
    this.close();
  },

  info : function(message, leaveOpen) {
    this._information.removeClass('error').text(message).show();
    if (!leaveOpen) this._information.delay(3000).fadeOut();
  },

  error : function(message, leaveOpen) {
    this._information.addClass('error').text(message).show();
    if (!leaveOpen) this._information.delay(3000).fadeOut();
  },

  confirm : function() {
    if (this.options.onConfirm && !this.options.onConfirm(this)) return false;
    this.close();
  },

  close : function() {
    if (this.options.onClose) this.options.onClose(this);
    $(this.el).remove();
    if (this._returnCloses()) $(document.body).unbind('keypress', this._maybeConfirm);
    $(document.body).removeClass('overlay');
  },

  center : function() {
    $(this.el).align(window, '', {top : -50});
  },

  showSpinner : function() {
    $('.spinner_dark', this.el).show();
  },

  hideSpinner : function() {
    $('.spinner_dark', this.el).hide();
  },

  _returnCloses : function() {
    return this.options.mode == 'alert' || this.options.mode == 'short_prompt';
  },

  _maybeConfirm : function(e) {
    if (e.keyCode == 13) this.confirm();
  },

  _addFocus : function(e) {
    $(e.target).addClass('focus');
    $(this.el).css({zoom : 1});
  },

  _removeFocus : function(e) {
    $(e.target).removeClass('focus');
  }

}, {

  alert : function(text, options) {
    return new dc.ui.Dialog(_.extend({
      mode  : 'alert',
      title : null,
      text  : text
    }, options)).render();
  },

  prompt : function(text, content, callback, options) {
    var onConfirm = callback && function(dialog){ return callback(dialog.val(), dialog); };
    return new dc.ui.Dialog(_.extend({
      mode      : 'prompt',
      password  : !!(options && options.password),
      title     : text,
      text      : '',
      content   : content,
      onConfirm : onConfirm
    }, options)).render();
  },

  confirm : function(text, callback, options) {
    return new dc.ui.Dialog(_.extend({
      mode      : 'confirm',
      title     : null,
      text      : text,
      onConfirm : callback
    }, options)).render();
  },

  choose : function(text, choices, callback, options) {
    return new dc.ui.Dialog(_.extend({
      mode      : 'prompt',
      title     : text,
      choices   : choices,
      text      : '',
      onConfirm : callback && function(dialog){ return callback(dialog.val()); }
    }, options)).render();
  },

  progress : function(text, options) {
    return new dc.ui.Dialog(_.extend({
      mode  : 'progress',
      text  : text,
      title : null
    }, options)).render();
  }

});