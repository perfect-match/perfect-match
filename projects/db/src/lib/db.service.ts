import { Injectable } from '@angular/core';

import * as Pouch from 'pouchdb/dist/pouchdb';
import PouchDB from 'pouchdb';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DBService {

    code: string;

    localDB: PouchDB.Database;

    remoteDB: PouchDB.Database;

    syncHandler: PouchDB.Replication.Sync<{}>;

    change = new Subject();

    private rev: string;

    constructor() { }

    connect(code: string) {
        this.code = code;

        return new Promise(resolve => {
            const localDB: PouchDB.Database = this.localDB = new Pouch(`perfect-match-${ code }`);
            const remoteDB: PouchDB.Database = this.remoteDB = new Pouch(`http://localhost:8080/perfect-match-${ code }`);

            localDB
                .sync(remoteDB)
                .on('complete', () => this.complete(resolve))
                .on('error', console.error);
        });
    }

    disconnect() {
        this.syncHandler.cancel();
    }

    async get<T = any>() {
        const game = await this.localDB.get<T>(this.code);

        this.rev = game._rev;

        return game;
    }

    async put<T>(data: PouchDB.Core.PutDocument<T>) {
        data._rev = this.rev;

        const response = await this.localDB.put(data);

        this.rev = response.rev;

        return response;
    }

    attachment() {
        const attachment = new Blob(['Is there life on Mars?'], { type: 'text/plain' });

        return this.localDB.putAttachment(this.code, 'att.txt', this.rev, attachment, 'text/plain');
    }

    private complete(resolve: () => void) {
        this.syncHandler = this.localDB
            .sync(
                this.remoteDB,
                {
                    live: true,
                    retry: true,
                    timeout: 100
                }
            )
            .on('change', syncResult => {
                if (syncResult.direction === 'push') {
                    return;
                }

                const game = syncResult.change.docs[0];

                this.rev = game._rev;

                this.change.next(game);
            })
            .on('error', console.error);

        resolve();
    }

}
