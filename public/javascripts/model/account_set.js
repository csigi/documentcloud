dc.model.AccountSet = dc.model.RESTfulSet.extend({
  
  resource : 'accounts',
  
  // Lazy-fetch all the organization's DocumentCloud accounts.
  fetch : function(callback) {
    var me = this;
    dc.ui.Spinner.show('fetching accounts...');
    $.get('/accounts', {}, function(resp) {
      dc.ui.Spinner.hide();
      me.refresh(_.map(resp.accounts, function(acc){ 
        return new dc.model.Account(acc); 
      }));
      if (callback) callback();
    }, 'json');
  }
  
});

window.Accounts = new dc.model.AccountSet();
