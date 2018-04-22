const { Pool }  = require('pg');

module.exports = class DatabaseWorker {
    constructor(postgresConfigs) {        
        this.pool = new Pool(postgresConfigs);
    }
    /**
     * Performs a given query agains the database.
     *
     * @param {string} query - The string that represents the target query.
     * @param {Array} params - One array with parameters to be used with the query.
     * @returns {Promise} Resolved promiss in any case of success. Reject if error connecting to
     * db or performing the query.
     */
    query (query, params = []) {     
        console.log('WILL PERFORM QUERY')
        return new Promise((resolve, reject) => {
            this.pool.connect((error, client, done) => {
                if (error) {
                    return reject(error);
                }
                client.query(query, params, (errorQ, results) => {
                    done();
                    errorQ ? reject(errorQ) : resolve( results.rows );
                });
            });
        });
    }          
    
    /**
     * Performs a given query agains the database.
     *
     * @param {string} query - The string that represents the target query.
     * @param {Array} params - One array with parameters to be used with the query.
     * @returns {Promise} Resolved promiss in any case of success. Reject if error connecting to
     * db or performing the query.
     */
    booleanQuery(query, params = []) {        
        return new Promise((resolve, reject) => {
            this.pool.connect((error, client, done) => {
                if (error) {
                    return reject(error);
                }
                return client.query(query, params, (errorQ, results) => {
                    done();
                    console.log(results.rows[0])
                    errorQ ? reject(errorQ) : resolve( 
                        results.rows &&
                        results.rows[0] &&
                        results.rows[0].count == 0 );
                });
            });
        });
    }   
    
    /**
     * Starts a PostgreSQL transaction.
     *
     * @returns {Promise} - Resolves or rejects 
     */
    startDbTransaction() {        
        return new Promise(function(resolve, reject) {
            return this.pool.connect()
                .then(function(client) {                    
                    return client.query('BEGIN', function(error) {
                        return error ? reject(error) : resolve(client);                        
                    });
                });
        });
    }

    /**
     * This function ends a transaction on a given client
     * 
     * @param {Object} pgCTrans - The client object
     * @param {Object} [error=undefined] - The error in the end. If there is one, will ROLLBACK, otherwise, COMMIT
     * @returns {Promise} - Resolves or rejects 
     */
    endDbTransaction (pgCTrans, error = undefined) {     
        return new Promise(function(resolve, reject) {
            return pgCTrans.query(error ? 'ROLLBACK' : 'COMMIT')
                .then(function() {
                    pgCTrans.release();
                    error ? reject(error) : resolve();
                })                
        });
    }
};
