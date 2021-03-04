import { LightningElement, wire, api, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getAccountList from '@salesforce/apex/AccountController.getAccountList';
import updateAccount from '@salesforce/apex/AccountController.updateAccount';
import { showToast } from 'c/utility';

const FINANCIAL_SERVICES = 'Financial Services';
const UPDATE_ACCOUNT_SUCCESS = 'Update Accounts Successfully';
const UPDATE_ACCOUNT_FAILURE = 'Update Accounts Failed';
const SUCCESS = 'success';
const ERROR = 'error';

export default class LWCAccountList extends LightningElement
{
    @track sortBy;
    @track sortDirection;

    @track draftValues = [];
    @track searchString = '';
    error;

    @track columns = [
        {label: 'Account Name',  fieldName: 'Link', type: 'url',sortable: true, initialWidth:350, typeAttributes: {label:{fieldName: 'Name'},target: '_parent', tooltip: 'Open Account'}},
        {label: 'Account Owner', fieldName: 'OwnerName', type: 'text',sortable: true,initialWidth:250,typeAttributes:{label:{fieldName:'OwnerName'},variant: 'base',disabled: 'true'}},
        {label: 'Phone', fieldName: 'Phone', editable:{value:'Phone'}, type: 'text',sortable: false, initialWidth:200,title: {fieldName: 'Phone'},typeAttributes:{tooltip:{fieldName:'Phone'}}},
        {label: 'Website', fieldName: 'Website', editable:{value:'Website'}, type: 'text',sortable: false, initialWidth:250},
        {label: 'Annual Revenue', fieldName: 'AnnualRevenue', editable:{value:'AnnualRevenue'}, type: 'currency',sortable: false, initialWidth:200}
    ];


    @track accountList;
    @wire (getAccountList,{industry : FINANCIAL_SERVICES,searchString : '$searchString'})
    wiredAccountList(result) {
        const { data, error } = result;
        if (data) {
            let Link;
            let OwnerName;
            this.accountList = data.map(row => {
                Link = `/${row.Id}`;
                OwnerName = row.Owner.Name;
                return {...row , Link,OwnerName}
            })
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error.body.message;
            this.accountList = undefined;
        }
    }

    handleSave(event) {
        let saveDraftValues = JSON.stringify(event.detail.draftValues);

        updateAccount({accountsString: saveDraftValues}).then(() => {
            showToast(UPDATE_ACCOUNT_SUCCESS, '', SUCCESS, 'dismissable', '');
            refreshApex(this.accountList);
            this.draftValues = [];
        }).catch(error => {
            showToast(UPDATE_ACCOUNT_FAILURE, '', ERROR, 'dismissable', '');
        });
    }

    refreshAccountList(event) {
        this.displaySpinner = true;
        refreshApex(this.accountList);
        this.displaySpinner = false;
    }

    handleKeyUp(event) {
        this.searchString = event.target.value;
    }

    handleSortdata(event) {
        this.sortBy = event.detail.fieldName;
        // sort direction
        this.sortDirection = event.detail.sortDirection;
        this.sortData(event.detail.fieldName, event.detail.sortDirection);
    }

    sortData(fieldname, direction) {
        // serialize the data before calling sort function
        let parseData = JSON.parse(JSON.stringify(this.accountList));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };

        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1: -1;

        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';

            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });

        // set the sorted data to data table data
        this.accountList = parseData;
    }
}