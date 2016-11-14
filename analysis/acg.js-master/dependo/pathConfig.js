function requireConfig() {
	return {
		// extracted from src/dashboard/js/config.js
		'common': 'common/js',
		'accounts': 'dashboard/accounts/js',
        'accountsAdmin': 'dashboard/accountsAdmin/js',
        'convoDeck': 'dashboard/convoDeck/js',
        'payBills': 'dashboard/payBills/js',
		'payMultipleBills': 'dashboard/payMultipleBills/js',
    	'profile': 'dashboard/profile/js',
    	'quickPay':'dashboard/quickPay/js',
        'transferMoney': 'dashboard/transferMoney/js',
    	'misc': 'dashboard/misc/js',
        'paymentsAdmin': 'dashboard/paymentsAdmin/js',
        'investments': 'dashboard/investments/js',
        'balanceTransfers': 'dashboard/balanceTransfers/js',
        'interstitial': 'dashboard/interstitial/js',
        'markets': 'dashboard/markets/js',
        'wires': 'dashboard/wires/js',
        'wiresAdmin': 'dashboard/wiresAdmin/js',
        'chasePay': 'dashboard/chasePay/js',
        'offers': 'dashboard/offers/js',
        // Manually resolve the dependencies
        'dashboard': 'dashboard/js',
        // TODO: include blue stack dependencies
        // Test Path
        '.': '.'
	};
}

module.exports = {
	requireConfig: requireConfig
}