# nextTRA
[nextTRA](https://az801590.github.io/nextTRA/)，是一個台灣鐵路和台灣高鐵班次查詢系統，優化老舊設備使用體驗，減少除班次資訊外的其餘資訊，加速查詢速度。  
同時這也是一個 react 專案的範本，其中展示了 react 的基礎語法和運用，希望對於 react 的學習有幫助。  

資料來源: 交通部TDX平台
---
[nextTRA](https://az801590.github.io/nextTRA/) is a transit query system for Taiwan Railway (TRA) and High-Speed Rail (THSR). The application is engineered to provide a modern, responsive experience on legacy hardware and older mobile browsers by minimizing performance overhead and maximizing efficiency.

Data source from TDX.
---
## TODO:
- [ ] build warning: size too big
    - [ ] lazt import thsr (?)
    - split react-dom / core-js package
    - UglifyJsPlugin()
        ```javascript
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                comments: false
            }
        })
        ```
    - compression-webpack-plugin