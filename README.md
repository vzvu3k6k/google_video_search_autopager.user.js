In Google Video Search with JavaScript enabled, thumbnails appended by [AutoPagerize](http://autopagerize.net/) are not rendered, because thumbnails are dynamically inserted by `<script>` tag (I don't know why they have to do so...). This script fetches and appends next pages as you scroll, fixing thumbnails.

If you use this script with AutoPagerize, set this exclude pattern: `/^https://(www\.)?google\.(com|co\.\w\w)/search\?.*tbm=vid.*/`.

`@match` is for userscript engines which don't support `@include` (e.g. Google Chrome).

# See Also

- [firefox用スクリプトアップローダー | fixAutoPagerize4Google.user.js 検索 | uploader.jp](http://u6.getuploader.com/script/search?q=fixAutoPagerize4Google.user.js)
  - Fixes probably all kinds of thumbnails (e.g. image search snippet in web search)
  - Works with AutoPagerize
