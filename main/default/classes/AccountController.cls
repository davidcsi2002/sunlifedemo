public with sharing class AccountController {

    static final String RETRIEVE_ACCOUNTS_ERROR = 'Retrieving Accounts Error';
    static final String UPDATE_ACCOUNT_ERROR = 'Updating Account Error';

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountList(String industry,String searchString){
        try {
            searchString = String.isBlank(searchString) ? '' : searchString.trim();
            industry = String.isBlank(industry) ? '' : industry.trim();

            if (String.isBlank(searchString)) {
                if (String.isBlank(industry)) {
                    return [SELECT Id,Name,Owner.Name, Phone, Website, AnnualRevenue FROM Account ORDER BY Name];
                } else {
                    return [SELECT Id,Name,Owner.Name, Phone, Website, AnnualRevenue FROM Account WHERE Industry =:industry ORDER BY Name];
                }

            } else {
                searchString = '%' + searchString + '%';
                if (String.isBlank(industry)) {
                    return [SELECT Id,Name,Owner.Name, Phone, Website, AnnualRevenue FROM Account WHERE Name LIKE :searchString ORDER BY Name];
                } else {
                    return [SELECT Id,Name,Owner.Name, Phone, Website, AnnualRevenue FROM Account WHERE Industry = :industry AND Name LIKE :searchString  ORDER BY Name];
                }
            }
        } catch (Exception ex) {
            throw new AuraHandledException(RETRIEVE_ACCOUNTS_ERROR + ': ' + ex.getMessage());
        }
    }

    @AuraEnabled
    public static Boolean updateAccount(String accountsString) {
        try {
            List<Account> accounts = (List<Account>)JSON.deserialize(accountsString, List<Account>.class);

            SObjectAccessDecision decision = Security.stripInaccessible(
                AccessType.UPDATABLE,
                accounts);

            update decision.getRecords();
            return true;
        } catch (Exception ex) {
            throw new AuraHandledException(UPDATE_ACCOUNT_ERROR + ': ' + ex.getMessage());
        }
    }

}