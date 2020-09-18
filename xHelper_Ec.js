/*

XHelperWrapper 版本: 1.2.0

 使用方法:
 在 main.js 中 实例化

    let h = new XHelperWrapper();

    function main()
    {
        h.ToastLog("测试")
        h.ClickTextOrDesc("测试")
    }
    main()
*/


function XHelperWrapper() {
    this._findNodeOutTime = 0;
    this._imgObj = null;
    this._imgLockState = false;
}

XHelperWrapper.prototype.ToastLog = function (msg) {
    toast(msg)
    logd(msg)
}

// region 简单的点击节点  (复杂节点信息  请查看文档,使用 clickObj 点击)

/**
 * 点击text或desc
 * @param content 文本内容
 * @return {boolean} 是否点击成功
 * @constructor
 */
XHelperWrapper.prototype.ClickTextOrDesc = function (content) {
    let res = this.ClickText(content);

    if (!res) {
        res = this.ClickDesc(content)
    }

    if (res) {
        logd("ClickTextOrDesc 点击成功: " + content)
    }

    return res;
}

XHelperWrapper.prototype.ClickId = function (content) {

    let obj = null;
    if (this.IsRegEx(content)) {
        obj = idMatch(content).getOneNodeInfo(this._findNodeOutTime)
    } else {
        obj = id(content).getOneNodeInfo(this._findNodeOutTime)
    }

    return this.ClickObj(obj)
}

XHelperWrapper.prototype.ClickText = function (content) {

    let obj = null;
    if (this.IsRegEx(content)) {
        obj = textMatch(content).getOneNodeInfo(this._findNodeOutTime)
    } else {
        obj = text(content).getOneNodeInfo(this._findNodeOutTime)
    }

    return this.ClickObj(obj)
}

XHelperWrapper.prototype.ClickDesc = function (content) {
    let obj = null;
    if (this.IsRegEx(content)) {
        obj = descMatch(content).getOneNodeInfo(this._findNodeOutTime)
    } else {
        obj = desc(content).getOneNodeInfo(this._findNodeOutTime)
    }
    return this.ClickObj(obj)
}

XHelperWrapper.prototype.ClickClz = function (content) {
    let obj = null;
    if (this.IsRegEx(content)) {
        obj = clzMatch(content).getOneNodeInfo(this._findNodeOutTime)
    } else {
        obj = clz(content).getOneNodeInfo(this._findNodeOutTime)
    }
    return this.ClickObj(obj)

}

XHelperWrapper.prototype.ClickPkg = function (content) {
    let obj = null;
    if (this.IsRegEx(content)) {
        obj = pkgMatch(content).getOneNodeInfo(this._findNodeOutTime)
    } else {
        obj = pkg(content).getOneNodeInfo(this._findNodeOutTime)
    }
    return this.ClickObj(obj)
}

/**
 * 判断是否是 正则
 * @param content
 * @return {boolean}
 * @constructor
 */
XHelperWrapper.prototype.IsRegEx = function (content) {
    return content.indexOf(".*") > -1
}

/**
 * 点击 节点
 * @param obj{NodeInfo} 节点nodeinfo 对象
 * @return {boolean} 是否点击成功
 * @constructor
 */
XHelperWrapper.prototype.ClickObj = function (obj) {
    let res = false;
    if (obj) {
        try {
            res = clickRandomRect(obj.bounds)
            //sleep(500)

        } catch (e) {
            loge("ClickObj 异常:" + e.message)
            loge(e.track);
        }
    }
    return res
}

XHelperWrapper.prototype.ClickCenter = function (rectObj) {
    let res = false;
    if (rectObj != null) {
        try {
            res = clickCenter(new Rect(rectObj))
            //sleep(500)

        } catch (e) {
            loge("ClicRandomkRect 异常:" + e.message)
            loge(e.track);
        }
    }
    return res
}


// endregion

// region 简单判断节点是否存在
XHelperWrapper.prototype.IsExistTextOrDesc = function (content) {
    let res = this.IsExistText(content);
    if (!res) {
        res = this.IsExistDesc(content)
    }
    return res;

}

XHelperWrapper.prototype.IsExistId = function (content) {
    let res = false;
    if (this.IsRegEx(content)) {
        res = has(idMatch(content));
    } else {
        res = has(id(content));
    }
    return res;
}

XHelperWrapper.prototype.IsExistText = function (content) {
    let res = false;
    if (this.IsRegEx(content)) {
        res = has(textMatch(content));
    } else {
        res = has(text(content));
    }
    return res;
}

XHelperWrapper.prototype.IsExistDesc = function (content) {
    let res = false;
    if (this.IsRegEx(content)) {
        res = has(descMatch(content));
    } else {
        res = has(desc(content));
    }
    return res;
}

XHelperWrapper.prototype.IsExistClz = function (content) {
    let res = false;
    if (this.IsRegEx(content)) {
        res = has(clzMatch(content));
    } else {
        res = has(clz(content));
    }
    return res;
}

XHelperWrapper.prototype.IsExistPkg = function (content) {
    let res = false;
    if (this.IsRegEx(content)) {
        res = has(pkgMatch(content));
    } else {
        res = has(pkg(content));
    }
    return res;
}

XHelperWrapper.prototype.IsNotNull = function (data) {
    return data != null
}

// endregion

// region 计时器(一般用来 查看某段代码的耗时)
/**
 * 开始计时
 * @return {Date}
 * @constructor
 */
XHelperWrapper.prototype.StartTime = function () {
    return new Date();
}

/**
 * 停止 计时
 * @param startTime 开始的时间 请使用 @StartTime() 获取
 * @returns {number} 单位: 毫秒
 * @constructor
 */
XHelperWrapper.prototype.StopTime = function (startTime) {
    return new Date() - startTime;
}
// endregion


/**
 * 曲线 仿真滑动
 * @param x1  起始 x
 * @param y1  起始 y
 * @param x2 结束x
 * @param y2 结束y
 * @param time  大概消耗的时间 (单位: 毫秒)
 * @return {Boolean}  true 成功  false 失败
 * @constructor
 */
XHelperWrapper.prototype.SwipeCurve = function (x1, y1, x2, y2, time) {

    /**
     * 生成随机 xy
     * @param qx 起始x
     * @param qy 起始y
     * @param zx 终点x
     * @param zy 终点y
     * @return {Array} 路径点  数组
     */
    function randomPoint(qx, qy, zx, zy) {

        let point = [];

        let dx0 = {
            "x": random(qx, qx + 50),
            "y": random(qy, qy + 50)
        }

        let dx1 = {
            "x": random(qx - 100, qx + 100),
            "y": random(qy, qy + 50)
        }
        let dx2 = {
            "x": random(zx - 100, zx + 100),
            "y": random(zy, zy + 50),
        }
        let dx3 = {
            "x": random(zx - 100, zx + 100),
            "y": random(zy, zy + 50),
        }
        let dx4 = {
            "x": random(zx - 100, zx + 100),
            "y": random(zy, zy + 50),
        }
        let dx5 = {
            "x": random(zx - 100, zx + 100),
            "y": random(zy, zy + 50),
        }
        let dx6 = {
            "x": random(zx - 100, zx + 100),
            "y": random(zy, zy + 50),
        }
        let dx7 = {
            "x": zx,
            "y": zy
        }

        for (let i = 0; i < 8; i++) {

            eval("point.push(dx" + i + ")");

        }

        let res = [];

        for (let i = 0; i < 1; i += 0.08) {
            res.push([parseInt(bezierCurves(point, i).x), parseInt(bezierCurves(point, i).y)]);
        }

        return res
    }

    /**
     * 贝塞尔曲线
     * @param cp
     * @param t
     * @return {*}
     */
    function bezierCurves(cp, t) {
        let cx, bx, ax, cy, by, ay, tSquared, tCubed, result
        cx = 3.0 * (cp[1].x - cp[0].x);
        bx = 3.0 * (cp[2].x - cp[1].x) - cx;
        ax = cp[3].x - cp[0].x - cx - bx;
        cy = 3.0 * (cp[1].y - cp[0].y);
        by = 3.0 * (cp[2].y - cp[1].y) - cy;
        ay = cp[3].y - cp[0].y - cy - by;

        tSquared = t * t;
        tCubed = tSquared * t;
        result = {
            "x": 0,
            "y": 0
        }
        result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x;
        result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y;
        return result;
    }

    /**
     * 多点触摸
     * @param pointList xy坐标集合
     * @param time 滑动消耗的时长
     * @param outTime 超时时间
     * @return {boolean}
     */
    function gesture(pointList, time, outTime) {
        let res = false

        // 随机 停顿时间
        let left = (time / 10) - 10
        let min = left < 0 ? 0 : left;
        let max = (time / 10) + 10

        let touch1 = [{
            "action": 0,
            "x": pointList[0][0],
            "y": pointList[0][1],
            "pointer": 1,
            "delay": random(min, max)
        }]

        for (let i in pointList) {
            ++i;
            if (i === pointList.length - 2) {
                break;
            }
            touch1.push({
                "action": 2,
                "x": pointList[i][0],
                "y": pointList[i][1],
                "pointer": 1,
                "delay": random(min, max)
            });

        }
        touch1.push({
            "action": 1,
            "x": pointList[pointList.length - 1][0],
            "y": pointList[pointList.length - 1][1],
            "pointer": 1,
            "delay": random(min, max)
        })

        res = multiTouch(touch1, null, null, outTime);

        return res
    }

    return gesture(randomPoint(x1, y1, x2, y2), time, 9999)
}


/**
 * 多点找图并点击
 * @param colorInfoArr{Array} EC 多点信息 (用自带的工具 生成,参数顺序不变) (个数 在方法中已经写死为1)
 * @param isClick {boolean} 找到后是否点击
 * @return {boolean} 返回是否成功点击 / 是否找到
 * @constructor
 */
XHelperWrapper.prototype.FindMultiColor = function (colorInfoArr, isClick) {
    let res = false
    let points = null;
    if (this._imgLockState && this._imgObj != null) {
        points = image.findMultiColor(this._imgObj, colorInfoArr[0], colorInfoArr[1], colorInfoArr[2], colorInfoArr[3], colorInfoArr[4], colorInfoArr[5], colorInfoArr[6], 1, colorInfoArr[8])
    } else {
        points = image.findMultiColorEx(colorInfoArr[0], colorInfoArr[1], colorInfoArr[2], colorInfoArr[3], colorInfoArr[4], colorInfoArr[5], colorInfoArr[6], 1, colorInfoArr[8]);
    }
    if (points != null) {
        if (isClick) {

            let x = points[0].x + random(-3, 3)
            let y = points[0].y + random(-3, 3)
            //防止负数报错
            if (x > -1 && y > -1) {
                res = clickPoint(x, y)
            } else {
                res = clickPoint(points[0].x, points[0].y)
            }
        } else {
            res = true;
        }
    }
    return res
}

/**
 * 图色加锁, 接下来找色 用一张图
 * @constructor
 */
XHelperWrapper.prototype.LockImg = function () {
    this._imgObj = image.captureFullScreen()
    this._imgLockState = true;
}

/**
 * 释放图色锁,  接下来找色,使用不同截图
 * @constructor
 */
XHelperWrapper.prototype.ReleaseImg = function () {
    if (this._imgObj != null) {
        image.recycle(this._imgObj)

        // logd("图片回收结果: " + image.isRecycled(this._imgObj))
    }

    this._imgObj = null;
    this._imgLockState = false;
}

/**
 * 请求截图权限
 * @constructor
 */
XHelperWrapper.prototype.RequestScreenCapture = function () {
    let res = image.requestScreenCapture(10000, 0)
    sleep(1000)
    return res
}

/**
 * 打印 日志, 支持 多参数  支持打印 json数组/对象
 * @constructor
 */
XHelperWrapper.prototype.Logd = function () {
    let arr = []
    for (let item of arguments) {
        if (typeof item == "object") {
            item = JSON.stringify(item, null, 0);
        }
        arr.push(item)
    }
    logd(arr)
}

/**
 * 打印JSON 数组/ 对象 并格式化
 * @param jsonStr
 * @constructor
 */
XHelperWrapper.prototype.LogJson = function (jsonStr) {

    if (typeof jsonStr == "string") {
        jsonStr = JSON.parse(jsonStr)
    }
    logd("\n", JSON.stringify(jsonStr, null, 2))
}

/**
 *  判断是否是 数组
 * @param data 欲判断的数据
 * @return {boolean} true/false
 * @constructor
 */
XHelperWrapper.prototype.IsArray = function (data) {
    return Array.isArray(data)
}
