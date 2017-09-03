export class Util {
    static toDouble(num: number): string {
        if (num < 10) return '0' + num;
        else return '' + num;
    }

    static handleError(): {} {
        return {
            'code': 3,
            'msg': '非法操作'
        }
    }
}