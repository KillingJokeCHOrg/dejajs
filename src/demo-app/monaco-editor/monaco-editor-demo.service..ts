/**
 * Created by rtr on 24.11.2016.
 */
import {Injectable} from "@angular/core";
import {ResponseContentType, Http} from "@angular/http";
import {Observable} from "rxjs/Observable";

/**
 * Mock of LangService
 */
@Injectable()
export class MonacoEditorDemoService {

    constructor(protected _http: Http) {

    }

    public getFile(filename: string): Observable<any> {
        return Observable.create(observer => {
            this._http.get(`src/demo-app/monaco-editor/data/${filename}`, {responseType: ResponseContentType.Text})
                .subscribe(response => {
                    observer.next(response.text());
                    observer.complete();
                }
            );
        });
    }
}
