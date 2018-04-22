# PG-WORKER

Simple utility class to connect to pg modules exposing db operations

The class return Promises, so please use them to do your work. 

## Examples

1. Normal query -> ``` return this.query(query, params); ```
2. Query returning booleans -> ``` return this.booleanQuery(query, params) ```
3. Start a transaction. This function resolves with the transaction client ``` return this.startDbTransaction(query, params) ```
4. End a transaction. You should pass the transaction client returned by startDbTransacion and error if exists and function will handle it. -> ``` return this.endDbTransaction(client, errorObject) ```

