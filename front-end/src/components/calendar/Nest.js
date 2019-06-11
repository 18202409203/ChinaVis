export default function Nest() {

    var keys = [];
    var rollup = undefined;

    // 将数组按照元素内某字段归类
    function nest(a, s) {
        let obj = {};
        for (let e of a) {
            obj[e[s]] = obj[e[s]] || [];
            obj[e[s]].push(e);
        }
        let res = [];
        for (let o in obj) {
            res.push({
                key: o,
                values: obj[o]
            })
        }
        return res;
    }

    function recursion(array, depth) {
        let result = [];
        // 递归前
        result = nest(array, keys[keys.length - depth]);
        if (depth === 1) {
            // 递归转折点
            if (rollup) {
                for (let i = 0; i < result.length; i++) {
                    result[i].values = rollup(result[i].values, i)
                }
            }
        } else {
            --depth; // 递归深度
            for (let r of result) {
                r.values = recursion(r.values, depth)
            }
        }
        // 递归后
        return result;
    }

    this.rollup = (f) => {
        rollup = f;
        return this;
    }

    this.key = (s) => {
        keys.push(s);
        return this;
    }
    this.entries = (array) => recursion(array, keys.length)
}