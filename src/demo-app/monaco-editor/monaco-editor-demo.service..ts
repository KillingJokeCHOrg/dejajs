import { Injectable } from "@angular/core";
import { Http, ResponseContentType } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class MonacoEditorDemoService {

    constructor(protected _http: Http) {

    }

    public getFile(filename: string): Observable<any> {
        return Observable.create((observer) => {
            this._http.get(`src/demo-app/monaco-editor/data/${filename}`, { responseType: ResponseContentType.Text })
                .subscribe((response) => {
                    observer.next(response.text());
                    observer.complete();
                }
                );
        });
    }
}
