module.exports = function (RED) {
	'use strict';
	const axios = require('axios');
	function AladinNode(config) {
		RED.nodes.createNode(this, config);

		const node = this;
		this.name = config.name;
		
		const temp = {
			TTBKey: RED.nodes.getNode(config.creds).credentials.TTBKey || '',
			QueryType: config.RequestType === 'ItemSearch' ? config.QueryType1 : config.QueryType2
		}
		node.params = Object.assign({}, config, temp)
		
		node.on('input', (msg, send, done) => {
			node.params = Object.assign(node.params, msg)
			
			if (node.params.RequestType === 'ItemSearch') {
				node.params['QueryType'] = msg.QueryType || msg.QueryType1 || node.params['QueryType'];
			} else {
				node.params['QueryType'] = msg.QueryType || msg.QueryType2 || node.params['QueryType'];
			}
			
			msg.params = node.params;

			if (config.RequestType === 'ItemSearch') {
				// console.log('This is:', config.RequestType);
				axios
					.get('http://www.aladin.co.kr/ttb/api/ItemSearch.aspx', {
						params: node.params,
					})
					.then((response) => {
						msg.payload = response.data;
						node.send(msg);
					})
					.catch((error) => {
						node.error('요청에서 에러를 확인했습니다.');
					});
			} else if (config.RequestType === 'ItemList') {
				axios
					.get('http://www.aladin.co.kr/ttb/api/ItemList.aspx', {
						params: node.params,
					})
					.then((response) => {
						msg.payload = response.data;
						node.send(msg);
					})
					.catch((error) => {
						node.error('요청에서 에러를 확인했습니다.');
					});
			} else if (config.RequestType === 'ItemLookUp') {
				axios
					.get('http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx', {
						params: node.params,
					})
					.then((response) => {
						msg.payload = response.data;
						node.send(msg);
					})
					.catch((error) => {
						node.error('요청에서 에러를 확인했습니다.');
					});
			} else if (config.RequestType === 'ItemOffStoreList') {
				axios
					.get('http://www.aladin.co.kr/ttb/api/ItemOffStoreList.aspx', {
						params: node.params,
					})
					.then((response) => {
						msg.payload = response.data;
						node.send(msg);
					})
					.catch((error) => {
						node.error('요청에서 에러를 확인했습니다.');
					});
			} else {
				if (done) {
					done('RequestType 넷 중 하나는 선택하세요');
				} else {
					node.error('RequestType 넷 중 하나는 선택하세요', msg);
				}
			}
		});
	}
	RED.nodes.registerType('aladin', AladinNode);

	function AladinTTBKeyNode(config) {
		RED.nodes.createNode(this, config);
		this.name = config.name;
		this.TTBKey = config.TTBKey;
	}

	RED.nodes.registerType('aladinTTBKey', AladinTTBKeyNode, {
		credentials: {
			TTBKey: { type: 'text' },
		},
	});
};
