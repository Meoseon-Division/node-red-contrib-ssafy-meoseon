module.exports = function(RED) {
    // const aladin = require('aladin');
    const axios = require('axios');

    function AladinNode(config) {
        RED.nodes.createNode(this,config);
        // node-specific code goes here

        const node = this;
        this.name = config.name;
        node.RequestType = config.RequestType;

        node.params = {}
        // 아래 코드가 오류 계속 발생해서 주석("Credential type 'aladinTTBKey' is not registered", "TypeError: Cannot read property 'TTBKey' of undefined") -> aladinTTBKey register에서 credentials 안 넣었음
        node.params["TTBKey"] = RED.nodes.getNode(config.creds).credentials.TTBKey || "";
        node.params["Query"] = config.Query;
        node.params["RequestType"] = config.RequestType;
        // 비어있는 문자열도 인정돼서 왼쪽이 무조건 들어가지 않나...? (답:ㄴㄴ 왼쪽비면 오른쪽 들어가고 둘다 비면 undefined 가져옴)
        if (node.params.RequestType==="ItemSearch") {
            node.params["QueryType"] = config.QueryType1
        } else {
            node.params["QueryType"] = config.QueryType2;  
        }
        node.params["SearchTarget"] = config.SearchTarget;
        node.params["SubSearchTarget"] = config.SubSearchTarget;
        node.params["ItemId"] = config.ItemId;
        node.params["ItemIdType"] = config.ItemIdType;
        node.params["Start"] = config.Start;
        node.params["MaxResults"] = config.MaxResults;
        node.params["Sort"] = config.Sort;
        node.params["Cover"] = config.Cover;
        node.params["CategoryId"] = config.CategoryId;
        node.params["Output"] = config.Output;
        node.params["Partner"] = config.Partner;
        node.params["includeKey"] = config.includeKey;
        node.params["InputEncoding"] = config.InputEncoding;
        node.params["Version"] = config.Version;
        node.params["outofStockfilter"] = config.outofStockfilter;
        node.params["offCode"] = config.offCode;
        node.params["OptResult"] = config.OptResult;
        
        // console.log(node.params)

        this.on('input', function(msg, send, done) {
            // For maximum backwards compatibility, check that send exists.
            // If this node is installed in Node-RED 0.x, it will need to
            // fallback to using `node.send`
            // const send = send || function() { node.send.apply(node,arguments) }
            
            // do something with 'msg'
            
            // inject로 값을 주는 경우, 본래 값을 override
            node.params["TTBKey"] = msg.TTBKey || node.params["TTBKey"];
            node.params["Query"] = msg.Query || node.params["Query"];
            node.params["RequestType"] = msg.RequestType || node.params["RequestType"];
            if (node.params.RequestType==="ItemSearch") {
                node.params["QueryType"] = msg.QueryType1 || node.params["QueryType"]
            } else {
                node.params["QueryType"] = msg.QueryType2 || node.params["QueryType"];  
            }
            node.params["SearchTarget"] = msg.SearchTarget || node.params["SearchTarget"];
            node.params["SubSearchTarget"] = msg.SubSearchTarget || node.params["SubSearchTarget"];
            node.params["ItemId"] = msg.ItemId || node.params["ItemId"];
            node.params["ItemIdType"] = msg.ItemIdType || node.params["ItemIdType"];
            node.params["Start"] = msg.Start || node.params["Start"];
            node.params["MaxResults"] = msg.MaxResults || node.params["MaxResults"];
            node.params["Sort"] = msg.Sort || node.params["Sort"];
            node.params["Cover"] = msg.Cover || node.params["Cover"];
            node.params["CategoryId"] = msg.CategoryId || node.params["CategoryId"];
            node.params["Output"] = msg.Output || node.params["Output"];
            node.params["Partner"] = msg.Partner || node.params["Partner"];
            node.params["includeKey"] = msg.includeKey || node.params["includeKey"];
            node.params["InputEncoding"] = msg.InputEncoding || node.params["InputEncoding"];
            node.params["Version"] = msg.Version || node.params["Version"];
            node.params["outofStockfilter"] = msg.outofStockfilter || node.params["outofStockfilter"];
            node.params["offCode"] = msg.offCode || node.params["offCode"];
            node.params["OptResult"] = msg.OptResult || node.params["OptResult"];


            msg.params = node.params
            if (config.RequestType === "ItemSearch") {
                console.log("This is:", config.RequestType)
                axios.get('http://www.aladin.co.kr/ttb/api/ItemSearch.aspx', { params: node.params })
                .then((response) => {
                    // console.log(response.data);
                    msg.payload = response.data
                    node.send(msg);
                })
            } else if (config.RequestType === "ItemList") {
                axios.get('http://www.aladin.co.kr/ttb/api/ItemList.aspx', { params: node.params })
                .then((response) => {
                    // console.log(response.data);
                    msg.payload = response.data
                    node.send(msg);
                })
                
            } else if (config.RequestType === "ItemLookUp") {
                axios.get('http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx', { params: node.params })
                .then((response) => {
                    // console.log(response.data);
                    msg.payload = response.data
                    node.send(msg);
                })
                
            } else if (config.RequestType === "ItemOffStoreList") {
                axios.get('http://www.aladin.co.kr/ttb/api/ItemOffStoreList.aspx', { params: node.params })
                .then((response) => {
                    // console.log(response.data);
                    msg.payload = response.data
                    node.send(msg);
                })

            } else {
                // 넷 중 하나는 선택하라고 에러창

                // If an error is hit, report it to the runtime
                // if (err) {
                    if (done) {
                        // Node-RED 1.0 compatible
                        // done(err);
                        done("RequestType 넷 중 하나는 선택하세요")
                    } else {
                        // Node-RED 0.x compatible
                        // node.error(err, msg);
                        node.error("RequestType 넷 중 하나는 선택하세요",msg)
                    }
                // }
            }

            // 비동기식 처리로 인해 axios 결과 나오기전에 node.send를 보내기 때문에 payload안바뀜.
            // console.log('async')
            // 위에서 node.send() 해도 logic이 종료되지 않기 때문에 두 번 보내게 됨
            // node.send(msg);

            // send(msg);

            // // Once finished, call 'done'.
            // // This call is wrapped in a check that 'done' exists
            // // so the node will work in earlier versions of Node-RED (<1.0)
            // if (done) {
            //     done();
            // }
        });

    }
    RED.nodes.registerType("aladin",AladinNode);

    // https://nodered.org/docs/creating-nodes/config-nodes
    function AladinTTBKeyNode(config) {
        RED.nodes.createNode(this,config);
        this.name = config.name;
        this.TTBKey = config.TTBKey;
    }
    RED.nodes.registerType("aladinTTBKey",AladinTTBKeyNode,{
        // https://nodered.org/docs/creating-nodes/credentials
        credentials: {
            TTBKey: { type: "text" },
        }
    });
}
