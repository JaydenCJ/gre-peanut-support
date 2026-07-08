# GRE Peanut 支持站 — 关键词与转化策略

> 适用范围:本仓库三个静态页(index / privacy / 404)。目标:承接主 app 的品牌词搜索,
> 解决用户问题,并把访客引导回 app(下载 / 恢复购买 / 继续学习)。

## 1. 品牌词

### 英文(主战场)
- 核心:`GRE Peanut`、`GRE Peanut app`、`GRE Peanut support`、`GRE Peanut privacy`
- App Store 线上名:`GRE Peanut: Ace the GRE`(已作为 `alternateName` 写入 index 的
  MobileApplication 结构化数据;下次发版若改名为 `GRE Peanut: Offline Prep`,记得同步)。
- 品牌词页面覆盖:title、meta description、og:title、h1、h2(About GRE Peanut)、
  FAQ 标题(Does GRE Peanut work offline?)、footer,全部自然出现,无堆砌。

### 中文(结论:暂不上中文品牌词)
- 已核对主 app 仓库(README、store/metadata.md、store/ASO_next_version.md、PRODUCT.md,
  并全仓搜索「花生」):**app 没有正式中文名**,App Store 主 locale 为 en-US,
  上架名即英文 `GRE Peanut: Ace the GRE`。
- 因此本站不放中文品牌名——写一个不存在的「中文名」等于凭空造品牌,还会分裂搜索权重。
- 中文用户实际的搜法是「GRE Peanut」原文加中文修饰词(见下方长尾),英文品牌词本身
  即可命中,谷歌对 query 语言与页面语言不同的品牌导航词一样会出站点链接。
- **后续建议**:若将来在 ASC 给 app 增加 zh-Hant/zh-Hans localization 并确立正式中文名
  (例如「GRE 花生」),再回来做三件事:① index 的 `alternateName` 数组加中文名;
  ② footer 或 hero 副文自然带一次中文名;③ 本文档更新。在那之前不要动。

## 2. 类目词 / 长尾词

| 意图 | 词 | 承接页 |
| --- | --- | --- |
| 类目 | offline GRE prep app / GRE vocabulary app / GRE prep iPhone | index(title、tag、About) |
| 售前疑问 | GRE Peanut free trial / one-time purchase / no subscription | index FAQ 第 2 条 |
| 售后问题 | GRE Peanut restore purchase / restore not working | index FAQ 第 3 条 |
| 信任类 | GRE Peanut offline / does GRE Peanut need internet | index FAQ 第 1 条 |
| 信任类 | GRE Peanut privacy / data / analytics | privacy 页 |
| 合规类 | GRE Peanut ETS / official GRE score | index FAQ 第 4、5 条 |
| 中文长尾 | GRE Peanut 背单词 / 下载 / 离线 / 隐私 | 由英文品牌词 + 页面主题命中 |

## 3. 每页定位

| 页 | 角色 | title(字符数) | description(字符数) |
| --- | --- | --- | --- |
| index.html | 品牌词着陆 + 支持/FAQ 中心 | GRE Peanut Support — Offline GRE Prep & Vocabulary App(54) | Get help with … Read the FAQ or email support.(158,含 CTA) |
| privacy.html | 隐私信任页(ASC 也引用此 URL) | GRE Peanut Privacy Policy — Offline GRE Prep App(48) | GRE Peanut privacy policy: … Read how the offline GRE prep app protects your data.(157,含 CTA) |
| 404.html | 兜底回流(noindex) | Page Not Found — GRE Peanut Support(35) | 保持原文,按钮回 Support |

## 4. 结构化数据现状

- index:FAQPage(与页面 5 条 FAQ 逐字一致,改 FAQ 必须同步)+ Organization +
  MobileApplication(operatingSystem iOS、applicationCategory EducationalApplication、
  alternateName 为线上 App Store 名)。
- 未写 offers/价格与评分:站内不展示价格,评分数据无来源,宁缺毋滥,避免与商店页不一致。

## 5. 后续建议(按优先级)

1. **App Store 链接**:app 已上架(App id 6774980836)。本仓页面目前没有商店链接;
   确认最终商店 URL 后,在 index 的 Support 卡或 hero 加一个 "Download on the App Store"
   链接,并给 MobileApplication 结构化数据补 `url` / `installUrl` / `offers`——这是本站
   最大的一块转化缺口。
2. **自定义域名**:现用 `jaydencj.github.io/gre-peanut-support/`,canonical 已统一;
   若将来上自定义域,三处要一起改:canonical、og:url、404 页的绝对 URL。
3. **sitemap / robots**:此前复审裁决过三页小站不加,维持;若页面数量增长再议。
4. **og:image**:已有 1200×630 品牌图,两页引用正常,无需改。
5. **改名跟进**:App Store 名称若按 ASO 计划改为 `GRE Peanut: Offline Prep`,
   同步更新 index 的 `alternateName`。
