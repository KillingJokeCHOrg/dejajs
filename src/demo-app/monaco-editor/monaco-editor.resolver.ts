import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { MonacoEditorDemoService } from "./monaco-editor-demo.service.";

@Injectable()
export class MonacoEditorXmlFileResolver implements Resolve<any> {
    constructor(private _fileService: MonacoEditorDemoService) {

    }

    public resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return this._fileService.getFile('xmlFile.xml');
    }
}

@Injectable()
export class MonacoEditorXmlToCompareFileResolver implements Resolve<any> {
    constructor(private _fileService: MonacoEditorDemoService) {

    }

    public resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return this._fileService.getFile('xmlFileToCompare.xml');
    }
}

@Injectable()
export class MonacoEditorJsonFileResolver implements Resolve<any> {
    constructor(private _fileService: MonacoEditorDemoService) {

    }

    public resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return this._fileService.getFile('jsonFile.json');
    }
}

@Injectable()
export class MonacoEditorJsonToCompareFileResolver implements Resolve<any> {
    constructor(private _fileService: MonacoEditorDemoService) {

    }

    public resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return this._fileService.getFile('jsonFileToCompare.json');
    }
}
