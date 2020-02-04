export class CommonDataService {
    public buildUrl(url: string, params: any): string {
        let ret = url;
        if (params && Object.keys(params).length > 0) {
            for (const key of Object.keys(params)) {
                if (params.hasOwnProperty(key)) {
                    ret = ret.replace(':' + key, params[key]);
                }
            }
        }
        return ret;
    }
}

