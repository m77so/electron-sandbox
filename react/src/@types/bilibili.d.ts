declare module BilibiliApi {

    export interface Rights {
        bp: number;
        elec: number;
        download: number;
        movie: number;
        pay: number;
        hd5: number;
        no_reprint: number;
        autoplay: number;
        ugc_pay: number;
        is_cooperation: number;
        ugc_pay_preview: number;
        no_background: number;
    }

    export interface Owner {
        mid: number;
        name: string;
        face: string;
    }

    export interface Stat {
        aid: number;
        view: number;
        danmaku: number;
        reply: number;
        favorite: number;
        coin: number;
        share: number;
        now_rank: number;
        his_rank: number;
        like: number;
        dislike: number;
        evaluation: string;
    }

    export interface Dimension {
        width: number;
        height: number;
        rotate: number;
    }

    export interface Page {
        cid: number;
        page: number;
        from: string;
        part: string;
        duration: number;
        vid: string;
        weblink: string;
        dimension: Dimension;
    }

    export interface Author {
        mid: number;
        name: string;
        sex: string;
        face: string;
        sign: string;
        rank: number;
        birthday: number;
        is_fake_account: number;
        is_deleted: number;
    }

    export interface List {
        id: number;
        lan: string;
        lan_doc: string;
        is_lock: boolean;
        subtitle_url: string;
        author: Author;
    }

    export interface Subtitle {
        allow_submit: boolean;
        list: List[];
    }

    export interface Label {
        type: number;
    }

    export interface View {
        bvid: string;
        aid: number;
        videos: number;
        tid: number;
        tname: string;
        copyright: number;
        pic: string;
        title: string;
        pubdate: number;
        ctime: number;
        desc: string;
        state: number;
        attribute: number;
        duration: number;
        rights: Rights;
        owner: Owner;
        stat: Stat;
        dynamic: string;
        cid: number;
        dimension: Dimension;
        no_cache: boolean;
        pages: Page[];
        subtitle: Subtitle;
        label: Label;
    }

    export interface LevelInfo {
        current_level: number;
        current_min: number;
        current_exp: number;
        next_exp: number;
    }

    export interface Pendant {
        pid: number;
        name: string;
        image: string;
        expire: number;
        image_enhance: string;
    }

    export interface Nameplate {
        nid: number;
        name: string;
        image: string;
        image_small: string;
        level: string;
        condition: string;
    }

    export interface Official {
        role: number;
        title: string;
        desc: string;
        type: number;
    }

    export interface OfficialVerify {
        type: number;
        desc: string;
    }

    export interface Vip {
        vipType: number;
        dueRemark: string;
        accessStatus: number;
        vipStatus: number;
        vipStatusWarn: string;
        theme_type: number;
    }

    export interface Card2 {
        mid: string;
        name: string;
        approve: boolean;
        sex: string;
        rank: string;
        face: string;
        DisplayRank: string;
        regtime: number;
        spacesta: number;
        birthday: string;
        place: string;
        description: string;
        article: number;
        attentions: any[];
        fans: number;
        friend: number;
        attention: number;
        sign: string;
        level_info: LevelInfo;
        pendant: Pendant;
        nameplate: Nameplate;
        Official: Official;
        official_verify: OfficialVerify;
        vip: Vip;
    }

    export interface Card {
        card: Card2;
        following: boolean;
        archive_count: number;
        article_count: number;
        follower: number;
    }

    export interface Count {
        view: number;
        use: number;
        atten: number;
    }

    export interface Tag {
        tag_id: number;
        tag_name: string;
        cover: string;
        head_cover: string;
        content: string;
        short_content: string;
        type: number;
        state: number;
        ctime: number;
        count: Count;
        is_atten: number;
        likes: number;
        hates: number;
        attribute: number;
        liked: number;
        hated: number;
    }

    export interface Page2 {
        acount: number;
        count: number;
        num: number;
        size: number;
    }

    export interface Content {
        message: string;
        ipi: any;
        plat: number;
        device: string;
        members?: any;
        jump_url?: any;
        max_line: number;
    }

    export interface Folder {
        has_folded: boolean;
        is_folded: boolean;
        rule: string;
    }

    export interface UpAction {
        like: boolean;
        reply: boolean;
    }

    export interface Reply2 {
        rpid: any;
        oid: number;
        type: number;
        mid: number;
        root: number;
        parent: number;
        dialog: number;
        count: number;
        rcount: number;
        floor: number;
        state: number;
        fansgrade: number;
        attr: number;
        ctime: number;
        like: number;
        action: number;
        member?: any;
        content: Content;
        replies?: any;
        assist: number;
        folder: Folder;
        up_action: UpAction;
        show_follow: boolean;
    }

    export interface Reply {
        page: Page2;
        replies: Reply2[];
    }


    export interface Stat2 {
        aid: number;
        view: number;
        danmaku: number;
        reply: number;
        favorite: number;
        coin: number;
        share: number;
        now_rank: number;
        his_rank: number;
        like: number;
        dislike: number;
    }


    export interface Related {
        aid: number;
        videos: number;
        tid: number;
        tname: string;
        copyright: number;
        pic: string;
        title: string;
        pubdate: number;
        ctime: number;
        desc: string;
        state: number;
        attribute: number;
        duration: number;
        rights: Rights;
        owner: Owner;
        stat: Stat;
        dynamic: string;
        cid: number;
        dimension: Dimension;
        bvid: string;
        mission_id?: number;
        redirect_url: string;
    }

    export interface Data {
        View: View;
        Card: Card;
        Tags: Tag[];
        Reply: Reply;
        Related: Related[];
    }

    export interface Detail {
        code: number;
        message: string;
        ttl: number;
        data: Data;
    }
}
