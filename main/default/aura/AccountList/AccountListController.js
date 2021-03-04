({
    doInit : function(component, event, helper) {
        helper.loadAccounts(component);

        component.set('v.columns', [
            {label: 'Account Name',  fieldName: 'Link', type: 'url',sortable: true, initialWidth:350, typeAttributes: {label:{fieldName: 'Name'},target: '_parent', tooltip: 'Open Account'}},
            {label: 'Account Owner', fieldName: 'OwnerName', type: 'text',sortable: true,initialWidth:250,typeAttributes:{label:{fieldName:'OwnerName'},variant: 'base',disabled: 'true'}},
            {label: 'Phone', fieldName: 'Phone', editable:{value:'Phone'}, type: 'text',sortable: false, initialWidth:200,title: {fieldName: 'Phone'},typeAttributes:{tooltip:{fieldName:'Phone'}}},
            {label: 'Website', fieldName: 'Website', editable:{value:'Website'}, type: 'text',sortable: false, initialWidth:250},
            {label: 'Annual Revenue', fieldName: 'AnnualRevenue', editable:{value:'AnnualRevenue'}, type: 'currency',sortable: false, initialWidth:200}
        ]);
    },

    handleSaveEdition: function (component, event, helper) {
        var draftValues = event.getParam('draftValues');
        helper.saveEdition(component, draftValues);
    },

    refresh : function(component,event,helper) {
        $A.get('e.force:refreshView').fire();
    },

    handleKeyUp: function (component, event,helper) {
        var searchString = component.find('account-search').get('v.value');
        component.set("v.searchString",searchString);
        helper.loadAccounts(component);
    },

    updateColumnSorting: function (component, event, helper) {
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        // assign the latest attribute with the sorted column fieldName and sorted direction
        component.set("v.sortedBy", fieldName);
        component.set("v.sortedDirection", sortDirection);
        helper.sortData(component, fieldName, sortDirection);
    },

})