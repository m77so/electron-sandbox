import querystring from 'querystring';
import { http } from './fetchHelper'
const BILIBILI_ENDPOINT = 'https://api.bilibili.com'

//https://api.bilibili.com/x/web-interface/view/detail?bvid= BV1ot4y1y7js
export default {
    detail: async (bvId: string) => {
        const r = await http<BilibiliApi.Detail>(new Request(BILIBILI_ENDPOINT + `/x/web-interface/view/detail?bvid=${bvId}`, {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:74.0) Gecko/20100101 Firefox/74.0",
                "Accept": "*/*",
                "Accept-Language": "ja,en;q=0.5"
            },
            "referrer": "",
            "method": "GET",
            "mode": "cors"
        }))
        return r
    },
}
