({
    loadAccounts : function(cmp) {
        var helper = this;
        cmp.set("v.displaySpinner",true);
        var action = cmp.get("c.getAccountList");

        action.setParams({
            industry : cmp.get("v.industry"),
            searchString : cmp.get("v.searchString")
        });

        action.setCallback(cmp, function(response){
            cmp.set("v.displaySpinner", false);
            if(response.getState() === 'SUCCESS') {
                let accounts = response.getReturnValue();
                accounts.forEach(function(account){
                    try {
                        account['OwnerName'] = account.Owner.Name;
                        account['Link'] = '/' + account.Id;
                    }catch(e){
                        console.log(e);
                    }
                });
                cmp.set("v.accountList",accounts);
            } else {
                helper.showToast(cmp, '', 'Error:' + response.getError()[0].message,'error');
            }
		});

        $A.enqueueAction(action);
    },

    saveEdition: function (cmp, draftValues) {
        var helper = this;
        cmp.set("v.displaySpinner",true);
        var action = cmp.get("c.updateAccount");

        action.setParams({
            accountsString : JSON.stringify(draftValues)
        });

        action.setCallback(cmp, function(response){
            cmp.set("v.displaySpinner", false);
            if(response.getState() === 'SUCCESS') {
                cmp.set('v.draftValues', []);
                helper.showToast(cmp, '', 'Update Accounts Successfully','success');
            } else {
                helper.showToast(cmp, '', 'Error:' + response.getError()[0].message,'error');
            }
		});
        $A.enqueueAction(action);
    },

    sortData: function (cmp, fieldName, sortDirection) {
        var data = cmp.get("v.accountList");
        var reverse = sortDirection !== 'asc';
        //sorts the rows based on the column header that's clicked
        data.sort(this.sortBy(fieldName, reverse))
        cmp.set("v.accountList", data);
    },

    sortBy: function (field, reverse, primer) {
        var key = primer ?
            function(x) {return primer(x[field])} :
            function(x) {return x[field]};
        //checks if the two rows should switch places
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    },

    showToast : function(component, title, message,type) {
        let mode = '';
        let duration = 5000;
        if (type == 'error') {
            mode = 'stiky';
            duration = 10000;
        }
        var toastEvent = $A.get("e.force:showToast");

        toastEvent.setParams({
            "title": title,
            "message": message,
            "type": type,
            "mode": mode,
            "duration":duration
        });
        toastEvent.fire();
    },
})