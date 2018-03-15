/* eslint-disable */
import { wallet, Neon, rpc, tx, api } from "@cityofzion/neon-js";
import storage from 'electron-json-storage'

export default {
    

    /**
     * @param {String} passphrase
     * @param {String} passphraseConfirm
     * @return Promise
     *
     * Response passed to Promise ideally looks like this:
     *  {String} encrypted_key
     *  {String} encrypted_private_key_qr
     *  {String} passhrase
     *  {String} private_key
     *  {String} public_address
     *  {String} public_address_qr
     */
    createWallet(walletName, passphrase, passphraseConfirm) {
        return new Promise((resolve, reject) => {
            if (passphrase !== passphraseConfirm) {
                console.log('Passphrases do not match');
                return;
            }
            else if (passphrase.length < 4) {
                console.log('Please choose a longer passphrase');
                return;
            }


            try {
                var account = new wallet.Account(wallet.generatePrivateKey());
                var { WIF, address } = account;
                account.label = walletName;
                var encryptedWIF = wallet.encrypt(WIF, passphrase);
                console.log(account);

                return storage.get('userWallet', (readError, data) => {
                    if (readError) {
                        console.log(`Error loading wallet: ${readError.message}`);
                    }
                    
                    if (typeof data.accounts === 'undefined') {
                        data.accounts = [];
                    }
                    
                    if (data.accounts.some(e => e.address === account.address)) {
                        console.log(`Error saving wallet: '${account.address}' already exists`);
                        return
                    } else if (data.accounts.some(e => e.label === account.label)) {
                        console.log(`Error saving wallet: '${account.label}' already exists`);
                        return
                    } else {
                        data.accounts.push(account)
                    }

                    storage.set('userWallet', data, (saveError) => {
                        if (saveError) {
                            console.log(`Error saving wallet: ${saveError.message}`);
                        } else {
                            console.log(`Saved key as ${walletName}`);
                        }
                    })
                })
            }
            catch (e) {
                console.log('An error occured while trying to generate a new wallet.')
                console.log(e);
                return;
            }
        });
    },

    /**
     * Fetch wallet's recent transactions.
     *
     * @param {Object} wallet
     * @return Promise
     *
     * Response passed to Promise ideally looks like this:
     *  {Float} token_count
     *  {String} from_address
     *  {String} hash
     *  {String} timestamp
     *  {String} to_address
     */
    fetchRecentTransactions(walletName) {
        return new Promise((resolve, reject) => {

            return storage.get('userWallet', (readError, data) => {
                if (readError) {
                    console.log(`Error loading wallet: ${readError.message}`);
                }

                if (typeof data.accounts === 'undefined') {
                    data.accounts = [];
                }

                var account = data.accounts.find(e => e.label === walletName);
                if (typeof account === 'undefined') {
                    console.log(`Error opening wallet: '${walletName}' doesn't exit.`);
                    return
                }

                //this isn't working yet
                api.getBalance('TestNet', account.address)
                    .then(res => console.log(res));
            })
        });
    },

    /**
     * Fetches single wallet transaction.
     *
     * @param {Object} wallet
     * @return Promise
     *
     * Response passed to Promise ideally looks like this:
     *  {Boolean} comfirmed
     *  {Float} network_fee
     *  {Float} system_fee
     *  {Float} token_count
     *  {Float} value_usd
     *  {Number} block
     *  {Number} bytes
     *  {Number} confirmations
     *  {String} from_address
     *  {String} from_address
     *  {String} status
     *  {String} timestamp
     *  {String} to_address
     */
    fetchTransaction(wallet) {

    },

    /**
     * Fetches wallet contents...
     *
     * @param {Object} wallet
     * @return Promise
     *
     * Response passed to Promise ideally looks like this:
     *  {Array} holdings
     *    {Float} 24_hour_change_value
     *    {Float} token_count
     *    {String} icon_url
     *    {String} name
     *    {String} symbol
     *  {Float} 24_hour_change_usd
     *  {Float} value_usd
     *  {Number} 24_hour_change_percentage
     */
    fetchWalletContents(wallet) {

    },

    /**
     * Fetches locally stored wallets.
     *
     * @return Array
     */
    fetchWallets() {

    },

    /**
     * Logs in with encrypted key.
     *
     * @param {String} passphrase
     * @param {String} encryptedKey
     * @return Promise
     */
    loginWithEncryptedKey(passphrase, encryptedKey) {

    },

    /**
     * Logs in with wallet.
     *
     * @param {Object} wallet
     * @param {String} passphrase
     * @return Promise
     */
    loginWithWallet(wallet, passphrase) {

    },

    /**
     * @return Promise
     */
    sendFunds() {

    },

    /**
     * Stores wallet locally.
     *
     * @param {String} name
     * @param {Object} wallet
     */
    storeWallet(name, wallet) {

    },

};