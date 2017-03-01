function Router () {
	return function route(request) {
			if (request.url == '/') {
				filePath = 'views/index.html';
			} else {
				filePath = 'public/' + request.url;
			}
	};
}



module.exports = Router;